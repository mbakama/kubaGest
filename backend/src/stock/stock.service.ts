import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { Product } from '../catalog/product.entity.js';
import { ReceiveStockDto, StockLineResponseDto } from './dto/stock.dto.js';
import { StockBalance, StockBucket } from './stock-balance.entity.js';
import { StockMovement, StockMovementKind } from './stock-movement.entity.js';

/**
 * Stock disponible et journal des quantités.
 *
 * Le stock est tenu en unité de base, par article. Toute variation écrit une
 * ligne de journal dans la même transaction que la projection, et la
 * projection ne descend jamais sous zéro.
 */
@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockBalance)
    private readonly balances: Repository<StockBalance>,
    @InjectRepository(StockMovement)
    private readonly movements: Repository<StockMovement>,
    @InjectRepository(Product)
    private readonly products: Repository<Product>,
    private readonly catalog: CatalogService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async list(tenantId: string): Promise<StockLineResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const products = await this.products.find({
      where: {
        tenantId,
        establishmentId: establishment.id,
        isActive: true,
      },
      order: { name: 'ASC' },
    });

    if (products.length === 0) return [];

    const balances = await this.balances.find({
      where: {
        tenantId,
        establishmentId: establishment.id,
        productId: In(products.map((product) => product.id)),
        bucket: StockBucket.AVAILABLE,
      },
    });
    const quantities = new Map(
      balances.map((balance) => [balance.productId, balance.quantityBase]),
    );

    return products.map((product) => {
      const quantityBase = quantities.get(product.id) ?? 0;
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        baseUnit: product.baseUnit,
        reorderLevel: product.reorderLevel,
        quantityBase,
        belowThreshold: quantityBase <= product.reorderLevel,
      };
    });
  }

  async receive(
    tenantId: string,
    actorId: string,
    dto: ReceiveStockDto,
  ): Promise<StockLineResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    return this.dataSource.transaction(async (manager) => {
      const product = await manager.findOne(Product, {
        where: {
          id: dto.productId,
          tenantId,
          establishmentId: establishment.id,
        },
      });

      if (!product) throw new NotFoundException('Article introuvable');

      await this.increase(
        manager,
        tenantId,
        establishment.id,
        product.id,
        dto.quantity,
        actorId,
        dto.reference?.trim() || 'Réception',
      );

      await this.audit.record(
        {
          action: 'stock.received',
          entityType: 'product',
          entityId: product.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            quantity: dto.quantity,
            baseUnit: product.baseUnit,
            reference: dto.reference ?? null,
          },
        },
        manager,
      );

      const balance = await manager.findOne(StockBalance, {
        where: {
          tenantId,
          establishmentId: establishment.id,
          productId: product.id,
          bucket: StockBucket.AVAILABLE,
        },
      });
      const quantityBase = balance?.quantityBase ?? 0;

      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        baseUnit: product.baseUnit,
        reorderLevel: product.reorderLevel,
        quantityBase,
        belowThreshold: quantityBase <= product.reorderLevel,
      };
    });
  }

  /**
   * Retire la quantité vendue. Échoue si le stock disponible ne couvre pas la
   * ligne : une vente ne crée jamais de stock négatif.
   */
  async decrease(
    manager: EntityManager,
    input: {
      tenantId: string;
      establishmentId: string;
      productId: string;
      productName: string;
      quantityBase: number;
      saleItemId: string;
      actorId: string | null;
    },
  ): Promise<void> {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const balance = await manager.findOne(StockBalance, {
        where: {
          tenantId: input.tenantId,
          establishmentId: input.establishmentId,
          productId: input.productId,
          bucket: StockBucket.AVAILABLE,
        },
      });

      if (!balance || balance.quantityBase < input.quantityBase) {
        throw new ConflictException(
          `Stock insuffisant pour ${input.productName} : ` +
            `${balance?.quantityBase ?? 0} disponible(s), ` +
            `${input.quantityBase} demandé(s).`,
        );
      }

      const updated = await manager.update(
        StockBalance,
        { id: balance.id, quantityBase: balance.quantityBase },
        { quantityBase: balance.quantityBase - input.quantityBase },
      );

      if (updated.affected === 1) {
        await manager.insert(StockMovement, {
          tenantId: input.tenantId,
          establishmentId: input.establishmentId,
          productId: input.productId,
          bucket: StockBucket.AVAILABLE,
          quantityDelta: -input.quantityBase,
          kind: StockMovementKind.SALE,
          saleItemId: input.saleItemId,
          reference: null,
          actorId: input.actorId,
          occurredAt: new Date(),
        });
        return;
      }
    }

    throw new ConflictException(
      'Le stock a changé pendant la vente. Réessayez.',
    );
  }

  private async increase(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    productId: string,
    quantity: number,
    actorId: string,
    reference: string,
  ): Promise<void> {
    let applied = false;
    for (let attempt = 0; attempt < 4 && !applied; attempt += 1) {
      const balance = await manager.findOne(StockBalance, {
        where: {
          tenantId,
          establishmentId,
          productId,
          bucket: StockBucket.AVAILABLE,
        },
      });

      if (!balance) {
        try {
          await manager.insert(StockBalance, {
            tenantId,
            establishmentId,
            productId,
            bucket: StockBucket.AVAILABLE,
            quantityBase: quantity,
          });
          applied = true;
        } catch {
          // Une réception simultanée a créé la ligne : on recommence.
        }
      } else {
        const updated = await manager.update(
          StockBalance,
          { id: balance.id, quantityBase: balance.quantityBase },
          { quantityBase: balance.quantityBase + quantity },
        );
        applied = updated.affected === 1;
      }
    }

    if (!applied) {
      throw new ConflictException(
        "Le stock a changé pendant la réception. Réessayez.",
      );
    }

    await manager.insert(StockMovement, {
      tenantId,
      establishmentId,
      productId,
      bucket: StockBucket.AVAILABLE,
      quantityDelta: quantity,
      kind: StockMovementKind.ENTRY,
      saleItemId: null,
      reference,
      actorId,
      occurredAt: new Date(),
    });
  }
}
