import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { PhysicalProduct } from '../catalog/physical-product.entity.js';
import { addMoney, multiplyMoney } from '../common/money.js';
import { StockService } from '../stock/stock.service.js';
import { Warehouse } from '../tenants/entities/warehouse.entity.js';
import { UsersService } from '../users/users.service.js';
import {
  CreateGoodsReceiptDto,
  CreatePurchaseDto,
  CreateSupplierDto,
  GoodsReceiptResponseDto,
  PurchaseResponseDto,
  SupplierResponseDto,
} from './dto/purchasing.dto.js';
import { GoodsReceiptItem } from './goods-receipt-item.entity.js';
import { GoodsReceipt } from './goods-receipt.entity.js';
import {
  GoodsReceiptStatus,
  PurchaseStatus,
} from './purchasing.enums.js';
import { PurchaseItem } from './purchase-item.entity.js';
import { Purchase } from './purchase.entity.js';
import { Supplier } from './supplier.entity.js';

@Injectable()
export class PurchasingService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliers: Repository<Supplier>,
    @InjectRepository(Purchase)
    private readonly purchases: Repository<Purchase>,
    @InjectRepository(PurchaseItem)
    private readonly purchaseItems: Repository<PurchaseItem>,
    @InjectRepository(GoodsReceipt)
    private readonly receipts: Repository<GoodsReceipt>,
    @InjectRepository(GoodsReceiptItem)
    private readonly receiptItems: Repository<GoodsReceiptItem>,
    @InjectRepository(PhysicalProduct)
    private readonly products: Repository<PhysicalProduct>,
    @InjectRepository(Warehouse)
    private readonly warehouses: Repository<Warehouse>,
    private readonly stock: StockService,
    private readonly users: UsersService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async createSupplier(
    tenantId: string,
    dto: CreateSupplierDto,
  ): Promise<SupplierResponseDto> {
    const saved = await this.suppliers.save(
      this.suppliers.create({
        tenantId,
        name: dto.name.trim(),
        phone: dto.phone?.trim() ?? null,
        email: dto.email?.trim() ?? null,
        address: dto.address?.trim() ?? null,
      }),
    );
    return { id: saved.id, name: saved.name };
  }

  async createPurchase(
    tenantId: string,
    actorUserId: string,
    dto: CreatePurchaseDto,
  ): Promise<PurchaseResponseDto> {
    const membership = await this.users.findMembership(actorUserId, tenantId);
    if (!membership) {
      throw new NotFoundException('Rattachement introuvable');
    }

    const supplier = await this.suppliers.findOne({
      where: { id: dto.supplierId, tenantId },
    });
    if (!supplier) throw new NotFoundException('Fournisseur introuvable');

    const warehouse = await this.warehouses.findOne({
      where: { id: dto.destinationWarehouseId, tenantId, isActive: true },
    });
    if (!warehouse) throw new NotFoundException('Entrepôt introuvable');

    const productIds = [...new Set(dto.items.map((line) => line.physicalProductId))];
    const products = await this.products.find({
      where: { tenantId, id: In(productIds), isActive: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('Un ou plusieurs articles sont invalides');
    }

    return this.dataSource.transaction(async (manager) => {
      const duplicate = await manager.findOne(Purchase, {
        where: { tenantId, reference: dto.reference },
      });
      if (duplicate) {
        throw new BadRequestException('Référence de commande déjà utilisée');
      }

      let totalAmount = '0.000000';
      const lineRows = dto.items.map((line) => {
        const totalCost = multiplyMoney(line.unitCost, line.quantityOrdered);
        totalAmount = addMoney(totalAmount, totalCost);
        return {
          tenantId,
          physicalProductId: line.physicalProductId,
          quantityOrdered: line.quantityOrdered,
          unitCost: line.unitCost,
          totalCost,
        };
      });

      const purchase = await manager.save(
        manager.create(Purchase, {
          tenantId,
          supplierId: dto.supplierId,
          destinationWarehouseId: dto.destinationWarehouseId,
          reference: dto.reference,
          status: PurchaseStatus.DRAFT,
          currency: dto.currency,
          totalAmount,
          createdByMembershipId: membership.id,
        }),
      );

      const items = await manager.save(
        lineRows.map((row) =>
          manager.create(PurchaseItem, { ...row, purchaseId: purchase.id }),
        ),
      );

      await this.audit.record(
        {
          action: 'purchase.created',
          entityType: 'purchase',
          entityId: purchase.id,
          tenantId,
          actorId: actorUserId,
          actorMembershipId: membership.id,
          newValues: { reference: purchase.reference, totalAmount },
        },
        manager,
      );

      return this.toPurchaseResponse(purchase, items);
    });
  }

  async createGoodsReceipt(
    tenantId: string,
    actorUserId: string,
    dto: CreateGoodsReceiptDto,
  ): Promise<GoodsReceiptResponseDto> {
    const membership = await this.users.findMembership(actorUserId, tenantId);
    if (!membership) {
      throw new NotFoundException('Rattachement introuvable');
    }

    const purchase = await this.purchases.findOne({
      where: { id: dto.purchaseId, tenantId },
    });
    if (!purchase) throw new NotFoundException('Commande introuvable');
    if (purchase.status === PurchaseStatus.CANCELLED) {
      throw new BadRequestException('Commande annulée');
    }
    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Commande déjà totalement réceptionnée');
    }

    const orderLines = await this.purchaseItems.find({
      where: { tenantId, purchaseId: purchase.id },
    });
    const orderedByProduct = new Map(
      orderLines.map((line) => [line.physicalProductId, line]),
    );

    for (const line of dto.items) {
      if (!orderedByProduct.has(line.physicalProductId)) {
        throw new BadRequestException(
          `L'article ${line.physicalProductId} ne figure pas sur la commande`,
        );
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const duplicate = await manager.findOne(GoodsReceipt, {
        where: { tenantId, reference: dto.reference },
      });
      if (duplicate) {
        throw new BadRequestException('Référence de réception déjà utilisée');
      }

      await this.assertReceiptQuantities(manager, tenantId, purchase.id, dto);

      const receipt = await manager.save(
        manager.create(GoodsReceipt, {
          tenantId,
          purchaseId: purchase.id,
          warehouseId: purchase.destinationWarehouseId,
          reference: dto.reference,
          status: GoodsReceiptStatus.DRAFT,
          receivedByMembershipId: null,
          receivedAt: null,
        }),
      );

      const items = await manager.save(
        dto.items.map((line) =>
          manager.create(GoodsReceiptItem, {
            tenantId,
            goodsReceiptId: receipt.id,
            physicalProductId: line.physicalProductId,
            quantityReceived: line.quantityReceived,
            unitCost: line.unitCost,
            batchId: null,
          }),
        ),
      );

      await this.audit.record(
        {
          action: 'goods_receipt.created',
          entityType: 'goods_receipt',
          entityId: receipt.id,
          tenantId,
          actorId: actorUserId,
          actorMembershipId: membership.id,
          newValues: { reference: receipt.reference, purchaseId: purchase.id },
        },
        manager,
      );

      return this.toReceiptResponse(receipt, items);
    });
  }

  async postGoodsReceipt(
    tenantId: string,
    actorUserId: string,
    receiptId: string,
  ): Promise<GoodsReceiptResponseDto> {
    const membership = await this.users.findMembership(actorUserId, tenantId);
    if (!membership) {
      throw new NotFoundException('Rattachement introuvable');
    }

    return this.dataSource.transaction(async (manager) => {
      const receipt = await manager.findOne(GoodsReceipt, {
        where: { id: receiptId, tenantId },
      });
      if (!receipt) throw new NotFoundException('Réception introuvable');
      if (receipt.status !== GoodsReceiptStatus.DRAFT) {
        throw new BadRequestException('Seul un bon brouillon peut être validé');
      }

      const purchase = await manager.findOne(Purchase, {
        where: { id: receipt.purchaseId, tenantId },
      });
      if (!purchase) throw new NotFoundException('Commande introuvable');

      const items = await manager.find(GoodsReceiptItem, {
        where: { tenantId, goodsReceiptId: receipt.id },
      });
      if (items.length === 0) {
        throw new BadRequestException('Réception sans ligne');
      }

      for (const line of items) {
        const product = await manager.findOne(PhysicalProduct, {
          where: { id: line.physicalProductId, tenantId, isActive: true },
        });
        if (!product) {
          throw new NotFoundException('Article introuvable');
        }

        await this.stock.recordValuedEntry(manager, {
          tenantId,
          warehouseId: receipt.warehouseId,
          physicalProductId: line.physicalProductId,
          quantity: line.quantityReceived,
          unitCost: line.unitCost,
          sourceType: 'goods_receipt_item',
          sourceId: line.id,
          actorMembershipId: membership.id,
        });
      }

      receipt.status = GoodsReceiptStatus.POSTED;
      receipt.receivedAt = new Date();
      receipt.receivedByMembershipId = membership.id;
      await manager.save(receipt);

      await this.refreshPurchaseStatus(manager, tenantId, purchase.id);

      await this.audit.record(
        {
          action: 'goods_receipt.posted',
          entityType: 'goods_receipt',
          entityId: receipt.id,
          tenantId,
          actorId: actorUserId,
          actorMembershipId: membership.id,
          newValues: { purchaseId: purchase.id, lines: items.length },
        },
        manager,
      );

      return this.toReceiptResponse(receipt, items);
    });
  }

  private async assertReceiptQuantities(
    manager: EntityManager,
    tenantId: string,
    purchaseId: string,
    dto: CreateGoodsReceiptDto,
  ): Promise<void> {
    const orderLines = await manager.find(PurchaseItem, {
      where: { tenantId, purchaseId },
    });
    const ordered = new Map(
      orderLines.map((line) => [line.physicalProductId, line.quantityOrdered]),
    );

    const received = await this.sumPostedReceipts(manager, tenantId, purchaseId);

    for (const line of dto.items) {
      const orderedQty = ordered.get(line.physicalProductId);
      if (orderedQty === undefined) continue;
      const already = received.get(line.physicalProductId) ?? 0;
      if (already + line.quantityReceived > orderedQty) {
        throw new BadRequestException(
          'Quantité reçue supérieure à la quantité commandée',
        );
      }
    }
  }

  private async sumPostedReceipts(
    manager: EntityManager,
    tenantId: string,
    purchaseId: string,
  ): Promise<Map<string, number>> {
    const rows = await manager
      .createQueryBuilder(GoodsReceiptItem, 'item')
      .innerJoin(
        GoodsReceipt,
        'receipt',
        'receipt.tenant_id = item.tenant_id AND receipt.id = item.goods_receipt_id',
      )
      .select('item.physical_product_id', 'productId')
      .addSelect('SUM(item.quantity_received)', 'total')
      .where('item.tenant_id = :tenantId', { tenantId })
      .andWhere('receipt.purchase_id = :purchaseId', { purchaseId })
      .andWhere('receipt.status = :status', {
        status: GoodsReceiptStatus.POSTED,
      })
      .groupBy('item.physical_product_id')
      .getRawMany<{ productId: string; total: string }>();

    return new Map(
      rows.map((row) => [row.productId, Number.parseInt(row.total, 10)]),
    );
  }

  private async refreshPurchaseStatus(
    manager: EntityManager,
    tenantId: string,
    purchaseId: string,
  ): Promise<void> {
    const orderLines = await manager.find(PurchaseItem, {
      where: { tenantId, purchaseId },
    });
    const received = await this.sumPostedReceipts(manager, tenantId, purchaseId);

    let complete = true;
    let anyReceived = false;
    for (const line of orderLines) {
      const qty = received.get(line.physicalProductId) ?? 0;
      if (qty > 0) anyReceived = true;
      if (qty < line.quantityOrdered) complete = false;
    }

    const purchase = await manager.findOneByOrFail(Purchase, {
      id: purchaseId,
      tenantId,
    });
    if (complete) {
      purchase.status = PurchaseStatus.RECEIVED;
    } else if (anyReceived) {
      purchase.status = PurchaseStatus.PARTIALLY_RECEIVED;
    } else {
      purchase.status = PurchaseStatus.APPROVED;
    }
    await manager.save(purchase);
  }

  private toPurchaseResponse(
    purchase: Purchase,
    items: PurchaseItem[],
  ): PurchaseResponseDto {
    return {
      id: purchase.id,
      reference: purchase.reference,
      status: purchase.status,
      supplierId: purchase.supplierId,
      destinationWarehouseId: purchase.destinationWarehouseId,
      totalAmount: purchase.totalAmount,
      items: items.map((item) => ({
        id: item.id,
        physicalProductId: item.physicalProductId,
        quantityOrdered: item.quantityOrdered,
        unitCost: item.unitCost,
        totalCost: item.totalCost,
      })),
    };
  }

  private toReceiptResponse(
    receipt: GoodsReceipt,
    items: GoodsReceiptItem[],
  ): GoodsReceiptResponseDto {
    return {
      id: receipt.id,
      reference: receipt.reference,
      status: receipt.status,
      purchaseId: receipt.purchaseId,
      warehouseId: receipt.warehouseId,
      items: items.map((item) => ({
        id: item.id,
        physicalProductId: item.physicalProductId,
        quantityReceived: item.quantityReceived,
        unitCost: item.unitCost,
      })),
    };
  }
}
