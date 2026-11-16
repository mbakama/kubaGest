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
import { EstablishmentProduct } from '../catalog/establishment-product.entity.js';
import { PhysicalProduct } from '../catalog/physical-product.entity.js';
import { Warehouse, WarehouseKind } from '../tenants/entities/warehouse.entity.js';
import { multiplyMoney } from '../common/money.js';
import { ReceiveStockDto, StockLineResponseDto } from './dto/stock.dto.js';
import { ProductValuation } from './product-valuation.entity.js';
import {
  ProductValuationService,
  type ValuationSnapshot,
} from './product-valuation.service.js';
import { StockBalance, StockBucket } from './stock-balance.entity.js';
import { StockMovement, StockMovementKind } from './stock-movement.entity.js';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(StockBalance)
    private readonly balances: Repository<StockBalance>,
    @InjectRepository(PhysicalProduct)
    private readonly products: Repository<PhysicalProduct>,
    @InjectRepository(EstablishmentProduct)
    private readonly activations: Repository<EstablishmentProduct>,
    private readonly catalog: CatalogService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
    private readonly valuations: ProductValuationService,
  ) {}

  async list(tenantId: string): Promise<StockLineResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const warehouse = await this.findEstablishmentWarehouse(
      this.dataSource.manager,
      tenantId,
      establishment.id,
    );
    const activations = await this.activations.find({
      where: { tenantId, establishmentId: establishment.id, isActive: true },
    });
    if (activations.length === 0) return [];
    const products = await this.products.find({
      where: {
        tenantId,
        id: In(activations.map((row) => row.physicalProductId)),
        isActive: true,
      },
      order: { name: 'ASC' },
    });
    const productIds = products.map((product) => product.id);
    const balances = await this.balances.find({
      where: {
        tenantId,
        warehouseId: warehouse.id,
        physicalProductId: In(productIds),
        bucket: StockBucket.AVAILABLE,
      },
    });
    const valuationByProduct = await this.valuations.findForProducts(
      this.dataSource.manager,
      {
        tenantId,
        warehouseId: warehouse.id,
        physicalProductIds: productIds,
      },
    );
    const activationByProduct = new Map(
      activations.map((row) => [row.physicalProductId, row]),
    );
    const quantities = new Map(
      balances.map((row) => [row.physicalProductId, row.quantityBase]),
    );
    return products.map((product) => {
      const reorderLevel =
        activationByProduct.get(product.id)?.reorderLevel ?? 0;
      const quantityBase = quantities.get(product.id) ?? 0;
      const valuation = valuationByProduct.get(product.id);
      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        baseUnit: product.baseUnit,
        reorderLevel,
        quantityBase,
        belowThreshold: quantityBase <= reorderLevel,
        averageCost: valuation?.averageCost ?? '0.000000',
        totalValue: valuation?.totalValue ?? '0.000000',
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
      const [product, activation] = await Promise.all([
        manager.findOne(PhysicalProduct, {
          where: { id: dto.productId, tenantId, isActive: true },
        }),
        manager.findOne(EstablishmentProduct, {
          where: {
            tenantId,
            establishmentId: establishment.id,
            physicalProductId: dto.productId,
            isActive: true,
          },
        }),
      ]);
      if (!product || !activation)
        throw new NotFoundException('Article introuvable');
      const warehouse = await this.findEstablishmentWarehouse(
        manager,
        tenantId,
        establishment.id,
      );
      let valuationSnapshot: ValuationSnapshot | null = null;
      if (dto.unitCost) {
        valuationSnapshot = await this.recordValuedEntry(manager, {
          tenantId,
          warehouseId: warehouse.id,
          physicalProductId: product.id,
          quantity: dto.quantity,
          unitCost: dto.unitCost,
          sourceType: 'direct_receipt',
          sourceId: null,
          actorMembershipId: null,
        });
      } else {
        await this.increase(
          manager,
          tenantId,
          warehouse.id,
          product.id,
          dto.quantity,
        );
        await this.valuations.adjustQuantity(manager, {
          tenantId,
          warehouseId: warehouse.id,
          physicalProductId: product.id,
          quantityDelta: dto.quantity,
        });
        await manager.insert(StockMovement, {
          tenantId,
          warehouseId: warehouse.id,
          physicalProductId: product.id,
          batchId: null,
          bucket: StockBucket.AVAILABLE,
          quantityDelta: dto.quantity,
          unitCost: null,
          totalCost: null,
          kind: StockMovementKind.ENTRY,
          sourceType: 'direct_receipt',
          sourceId: null,
          actorMembershipId: null,
          occurredAt: new Date(),
        });
      }
      await this.audit.record(
        {
          action: 'stock.received',
          entityType: 'physical_product',
          entityId: product.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            warehouseId: warehouse.id,
            quantity: dto.quantity,
            baseUnit: product.baseUnit,
            reference: dto.reference ?? null,
          },
        },
        manager,
      );
      const balance = await manager.findOneByOrFail(StockBalance, {
        tenantId,
        warehouseId: warehouse.id,
        physicalProductId: product.id,
        bucket: StockBucket.AVAILABLE,
      });
      if (!valuationSnapshot) {
        const stored = await manager.findOneBy(ProductValuation, {
          tenantId,
          warehouseId: warehouse.id,
          physicalProductId: product.id,
        });
        valuationSnapshot = stored
          ? {
              averageCost: stored.averageCost,
              totalValue: stored.totalValue,
              quantity: stored.quantity,
            }
          : null;
      }

      return {
        productId: product.id,
        sku: product.sku,
        name: product.name,
        baseUnit: product.baseUnit,
        reorderLevel: activation.reorderLevel,
        quantityBase: balance.quantityBase,
        belowThreshold: balance.quantityBase <= activation.reorderLevel,
        averageCost: valuationSnapshot?.averageCost ?? '0.000000',
        totalValue: valuationSnapshot?.totalValue ?? '0.000000',
      };
    });
  }

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
    const warehouse = await this.findEstablishmentWarehouse(
      manager,
      input.tenantId,
      input.establishmentId,
    );
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const balance = await manager.findOne(StockBalance, {
        where: {
          tenantId: input.tenantId,
          warehouseId: warehouse.id,
          physicalProductId: input.productId,
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
        { id: balance.id, version: balance.version },
        {
          quantityBase: balance.quantityBase - input.quantityBase,
          version: balance.version + 1,
        },
      );
      if (updated.affected === 1) {
        const valuation = await this.valuations.adjustQuantity(manager, {
          tenantId: input.tenantId,
          warehouseId: warehouse.id,
          physicalProductId: input.productId,
          quantityDelta: -input.quantityBase,
        });
        const unitCost = valuation?.averageCost ?? null;
        const totalCost =
          unitCost !== null
            ? multiplyMoney(unitCost, input.quantityBase)
            : null;

        await manager.insert(StockMovement, {
          tenantId: input.tenantId,
          warehouseId: warehouse.id,
          physicalProductId: input.productId,
          batchId: null,
          bucket: StockBucket.AVAILABLE,
          quantityDelta: -input.quantityBase,
          unitCost,
          totalCost,
          kind: StockMovementKind.SALE,
          sourceType: 'sale_item',
          sourceId: input.saleItemId,
          actorMembershipId: null,
          occurredAt: new Date(),
        });
        return;
      }
    }
    throw new ConflictException(
      'Le stock a changé pendant la vente. Réessayez.',
    );
  }

  /**
   * Entrée valorisée : stock, CUMP, mouvement — à réutiliser (bon de réception, etc.).
   */
  async recordValuedEntry(
    manager: EntityManager,
    input: {
      tenantId: string;
      warehouseId: string;
      physicalProductId: string;
      quantity: number;
      unitCost: string;
      sourceType: string;
      sourceId: string | null;
      actorMembershipId: string | null;
      batchId?: string | null;
    },
  ): Promise<ValuationSnapshot> {
    await this.increase(
      manager,
      input.tenantId,
      input.warehouseId,
      input.physicalProductId,
      input.quantity,
    );
    const valuation = await this.valuations.recordReceipt(manager, {
      tenantId: input.tenantId,
      warehouseId: input.warehouseId,
      physicalProductId: input.physicalProductId,
      quantity: input.quantity,
      unitCost: input.unitCost,
    });
    const totalCost = multiplyMoney(input.unitCost, input.quantity);
    await manager.insert(StockMovement, {
      tenantId: input.tenantId,
      warehouseId: input.warehouseId,
      physicalProductId: input.physicalProductId,
      batchId: input.batchId ?? null,
      bucket: StockBucket.AVAILABLE,
      quantityDelta: input.quantity,
      unitCost: input.unitCost,
      totalCost,
      kind: StockMovementKind.ENTRY,
      sourceType: input.sourceType,
      sourceId: input.sourceId,
      actorMembershipId: input.actorMembershipId,
      occurredAt: new Date(),
    });
    return valuation;
  }

  private async increase(
    manager: EntityManager,
    tenantId: string,
    warehouseId: string,
    physicalProductId: string,
    quantity: number,
  ): Promise<void> {
    for (let attempt = 0; attempt < 4; attempt += 1) {
      const balance = await manager.findOne(StockBalance, {
        where: {
          tenantId,
          warehouseId,
          physicalProductId,
          bucket: StockBucket.AVAILABLE,
        },
      });
      if (!balance) {
        try {
          await manager.insert(StockBalance, {
            tenantId,
            warehouseId,
            physicalProductId,
            batchId: null,
            bucket: StockBucket.AVAILABLE,
            quantityBase: quantity,
            version: 0,
          });
          return;
        } catch {
          continue;
        }
      }
      const updated = await manager.update(
        StockBalance,
        { id: balance.id, version: balance.version },
        {
          quantityBase: balance.quantityBase + quantity,
          version: balance.version + 1,
        },
      );
      if (updated.affected === 1) return;
    }
    throw new ConflictException(
      'Le stock a changé pendant la réception. Réessayez.',
    );
  }

  private async findEstablishmentWarehouse(
    source: EntityManager,
    tenantId: string,
    establishmentId: string,
  ): Promise<Warehouse> {
    const warehouse = await source.findOne(Warehouse, {
      where: {
        tenantId,
        establishmentId,
        kind: WarehouseKind.SECONDARY,
        isActive: true,
      },
      order: { createdAt: 'ASC' },
    });
    if (!warehouse)
      throw new NotFoundException("Aucun entrepôt actif pour l'établissement");
    return warehouse;
  }
}
