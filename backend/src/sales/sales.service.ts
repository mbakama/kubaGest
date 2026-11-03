import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { EntityManager } from 'typeorm';
import { DataSource, In } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { CashRegister } from '../cash/cash-register.entity.js';
import { CashSession } from '../cash/cash-session.entity.js';
import { CashService } from '../cash/cash.service.js';
import { CashMovementKind } from '../cash/cash-movement.entity.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { ProductPackaging } from '../catalog/product-packaging.entity.js';
import { Product } from '../catalog/product.entity.js';
import { periodInZone } from '../common/date.js';
import {
  addMoney,
  applyRate,
  fromUnits,
  greaterThan,
  multiplyMoney,
  subtractMoney,
  toUnits,
} from '../common/money.js';
import { CreditsService } from '../credits/credits.service.js';
import { CreditSale } from '../credits/credit-sale.entity.js';
import { Customer } from '../credits/customer.entity.js';
import { DocumentNumberService } from '../documents/document-number.service.js';
import { StockService } from '../stock/stock.service.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { SaleItem } from './sale-item.entity.js';
import {
  PaymentDirection,
  PaymentMethod,
  PaymentPurpose,
  SalePayment,
} from './sale-payment.entity.js';
import { Sale, SaleChannel, SaleStatus } from './sale.entity.js';
import {
  CreateSaleDto,
  SaleLineResponseDto,
  SaleResponseDto,
} from './dto/sale.dto.js';

type PricedLine = {
  product: Product;
  packaging: ProductPackaging;
  quantityPackages: number;
  quantityBase: number;
  unitPrice: string;
  netAmount: string;
  taxRate: string;
  taxAmount: string;
};

const MAX_LINES = 100;
const MAX_QUANTITY = 100_000;

/**
 * Encaissement au comptoir.
 *
 * Un ticket est une opération atomique : lignes, sortie de stock, règlement,
 * journal de caisse et éventuelle dette de crédit sont écrits ensemble, puis
 * validés en une seule transaction. Le prix vient toujours du catalogue : un
 * prix envoyé par le client est ignoré.
 */
@Injectable()
export class SalesService {
  constructor(
    private readonly catalog: CatalogService,
    private readonly cash: CashService,
    private readonly stock: StockService,
    private readonly credits: CreditsService,
    private readonly numbers: DocumentNumberService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async create(
    tenantId: string,
    actorId: string,
    dto: CreateSaleDto,
  ): Promise<SaleResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    if (dto.channel === SaleChannel.MOBILE) {
      throw new BadRequestException(
        'L’encaissement mobile money sera activé avec le module dédié. ' +
          'Encaissez en espèces pour le moment.',
      );
    }
    if (dto.channel === SaleChannel.CREDIT && !dto.customerId) {
      throw new BadRequestException(
        'Sélectionnez le client qui achète à crédit.',
      );
    }

    const created = await this.dataSource.transaction(async (manager) => {
      const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });
      if (!tenant) throw new NotFoundException('Commerce introuvable');

      const lines = await this.priceLines(manager, tenantId, establishment, dto);

      const subtotal = lines.reduce(
        (sum, line) => sum + toUnits(line.netAmount),
        0n,
      );
      const taxTotal = lines.reduce(
        (sum, line) => sum + toUnits(line.taxAmount),
        0n,
      );
      const total = fromUnits(subtotal + taxTotal);

      let received: string | null = null;
      let change: string | null = null;
      if (dto.channel === SaleChannel.CASH) {
        if (!dto.received) {
          throw new BadRequestException(
            'Indiquez le montant remis par le client.',
          );
        }
        if (greaterThan(total, dto.received)) {
          throw new BadRequestException(
            `Le montant remis (${dto.received}) ne couvre pas le total (${total}).`,
          );
        }
        received = fromUnits(toUnits(dto.received));
        change = subtractMoney(received, total);
      }

      const session =
        dto.channel === SaleChannel.CASH
          ? await this.cash.ensureSession(
              manager,
              tenantId,
              establishment.id,
              actorId,
              tenant.currency,
            )
          : null;

      const sale = await manager.save(
        manager.create(Sale, {
          tenantId,
          establishmentId: establishment.id,
          number: await this.numbers.next(
            manager,
            tenantId,
            'sale',
            periodInZone(establishment.timezone),
          ),
          cashierId: actorId,
          sessionId: session?.id ?? null,
          status: SaleStatus.POSTED,
          referenceCurrency: tenant.currency,
          channel: dto.channel,
          subtotal: fromUnits(subtotal),
          discountTotal: '0.000000',
          taxTotal: fromUnits(taxTotal),
          total,
          roundingAdjustment: '0.000000',
          postedAt: new Date(),
        }),
      );

      const items = await manager.save(
        lines.map((line, index) =>
          manager.create(SaleItem, {
            tenantId,
            establishmentId: establishment.id,
            saleId: sale.id,
            lineNumber: index + 1,
            productId: line.product.id,
            packagingId: line.packaging.id,
            skuSnapshot: line.product.sku,
            nameSnapshot: line.product.name,
            packagingSnapshot: line.packaging.label,
            factorSnapshot: line.packaging.factorToBase,
            quantityPackages: line.quantityPackages,
            quantityBase: line.quantityBase,
            unitPrice: line.unitPrice,
            discountAmount: '0.000000',
            taxRate: line.taxRate,
            taxAmount: line.taxAmount,
            netAmount: line.netAmount,
          }),
        ),
      );

      for (const [index, line] of lines.entries()) {
        await this.stock.decrease(manager, {
          tenantId,
          establishmentId: establishment.id,
          productId: line.product.id,
          productName: line.product.name,
          quantityBase: line.quantityBase,
          saleItemId: items[index].id,
          actorId,
        });
      }

      let credit: CreditSale | null = null;
      if (dto.channel === SaleChannel.CASH && session) {
        // Le règlement en espèces porte le montant remis par le client ; la
        // monnaie rendue est une sortie séparée. Leur différence vaut le total.
        const settlement = await manager.save(
          manager.create(SalePayment, {
            tenantId,
            establishmentId: establishment.id,
            saleId: sale.id,
            sessionId: session.id,
            direction: PaymentDirection.IN,
            purpose: PaymentPurpose.SETTLEMENT,
            method: PaymentMethod.CASH,
            currency: tenant.currency,
            amount: received as string,
            receivedBy: actorId,
            occurredAt: new Date(),
          }),
        );
        await this.cash.recordMovement(manager, {
          tenantId,
          establishmentId: establishment.id,
          sessionId: session.id,
          currency: tenant.currency,
          amountDelta: received as string,
          kind: CashMovementKind.SALE,
          paymentId: settlement.id,
          actorId,
        });

        if (change && toUnits(change) > 0n) {
          const changePayment = await manager.save(
            manager.create(SalePayment, {
              tenantId,
              establishmentId: establishment.id,
              saleId: sale.id,
              sessionId: session.id,
              direction: PaymentDirection.OUT,
              purpose: PaymentPurpose.CHANGE,
              method: PaymentMethod.CASH,
              currency: tenant.currency,
              amount: change,
              receivedBy: actorId,
              occurredAt: new Date(),
            }),
          );
          await this.cash.recordMovement(manager, {
            tenantId,
            establishmentId: establishment.id,
            sessionId: session.id,
            currency: tenant.currency,
            amountDelta: fromUnits(-toUnits(change)),
            kind: CashMovementKind.CHANGE,
            paymentId: changePayment.id,
            actorId,
          });
        }
      }

      if (dto.channel === SaleChannel.CREDIT) {
        credit = await this.credits.createForSale(manager, {
          tenantId,
          establishment,
          actorId,
          customerId: dto.customerId as string,
          total,
          dueDate: dto.dueDate,
          note: dto.note,
          saleId: sale.id,
        });
      }

      await this.audit.record(
        {
          action: 'sale.posted',
          entityType: 'sale',
          entityId: sale.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            number: sale.number,
            channel: sale.channel,
            total,
            items: lines.length,
            creditId: credit?.id ?? null,
          },
        },
        manager,
      );

      return { sale, items, lines, credit, received, change, session };
    });

    return this.toResponse(created.sale, created.items, {
      credit: created.credit,
      received: created.received,
      change: created.change,
      registerName: await this.registerName(created.session),
      customerName: await this.customerName(
        this.dataSource.manager,
        created.credit,
      ),
    });
  }

  async list(tenantId: string, limit = 50): Promise<SaleResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const manager = this.dataSource.manager;
    const sales = await manager.find(Sale, {
      where: { tenantId, establishmentId: establishment.id },
      order: { postedAt: 'DESC' },
      take: Math.min(Math.max(limit, 1), 200),
    });

    if (sales.length === 0) return [];

    const ids = sales.map((sale) => sale.id);
    const [items, credits, payments] = await Promise.all([
      manager.find(SaleItem, { where: { tenantId, saleId: In(ids) } }),
      manager.find(CreditSale, { where: { tenantId, saleId: In(ids) } }),
      manager.find(SalePayment, { where: { tenantId, saleId: In(ids) } }),
    ]);
    const registerNames = await this.registerNames(manager, sales);

    const creditBySale = new Map(
      credits.map((credit) => [credit.saleId as string, credit]),
    );
    const customerIds = [...new Set(credits.map((credit) => credit.customerId))];
    const customers =
      customerIds.length > 0
        ? await manager.find(Customer, { where: { id: In(customerIds) } })
        : [];
    const customerNames = new Map(
      customers.map((customer) => [customer.id, customer.name]),
    );

    return sales.map((sale) => {
      const rows = payments.filter((payment) => payment.saleId === sale.id);
      const change = rows
        .filter((row) => row.purpose === PaymentPurpose.CHANGE)
        .reduce((sum, row) => sum + toUnits(row.amount), 0n);
      const settlement = rows
        .filter((row) => row.purpose === PaymentPurpose.SETTLEMENT)
        .reduce((sum, row) => sum + toUnits(row.amount), 0n);
      const hasCash = rows.some((row) => row.method === PaymentMethod.CASH);
      const credit = creditBySale.get(sale.id) ?? null;

      return this.toResponse(
        sale,
        items.filter((item) => item.saleId === sale.id),
        {
          credit,
          received: hasCash ? fromUnits(settlement) : null,
          change: hasCash ? fromUnits(change) : null,
          registerName: sale.sessionId
            ? (registerNames.get(sale.sessionId) ?? null)
            : null,
          customerName: credit
            ? (customerNames.get(credit.customerId) ?? null)
            : null,
        },
      );
    });
  }

  // --- Interne -------------------------------------------------------------

  private async priceLines(
    manager: EntityManager,
    tenantId: string,
    establishment: Establishment,
    dto: CreateSaleDto,
  ): Promise<PricedLine[]> {
    const merged = new Map<string, { productId: string; packagingId: string; quantity: number }>();
    for (const item of dto.items) {
      const key = `${item.productId}:${item.packagingId}`;
      const current = merged.get(key);
      const quantity = (current?.quantity ?? 0) + item.quantity;
      if (quantity > MAX_QUANTITY) {
        throw new BadRequestException('Quantité trop élevée sur une ligne.');
      }
      merged.set(key, {
        productId: item.productId,
        packagingId: item.packagingId,
        quantity,
      });
    }

    if (merged.size > MAX_LINES) {
      throw new BadRequestException(
        `Un ticket ne peut pas dépasser ${MAX_LINES} lignes.`,
      );
    }

    const rows = [...merged.values()];
    const products = await manager.find(Product, {
      where: {
        tenantId,
        establishmentId: establishment.id,
        id: In([...new Set(rows.map((row) => row.productId))]),
      },
    });
    const productById = new Map(products.map((product) => [product.id, product]));

    const packagings = await manager.find(ProductPackaging, {
      where: {
        tenantId,
        establishmentId: establishment.id,
        id: In([...new Set(rows.map((row) => row.packagingId))]),
      },
    });
    const packagingById = new Map(
      packagings.map((packaging) => [packaging.id, packaging]),
    );

    return rows.map((row) => {
      const product = productById.get(row.productId);
      if (!product || !product.isActive) {
        throw new NotFoundException(
          'Un article du ticket est introuvable ou inactif.',
        );
      }
      const packaging = packagingById.get(row.packagingId);
      if (!packaging || packaging.productId !== product.id) {
        throw new BadRequestException(
          `Le conditionnement choisi ne correspond pas à ${product.name}.`,
        );
      }
      if (!packaging.isActive) {
        throw new BadRequestException(
          `Le conditionnement « ${packaging.label} » n’est plus actif.`,
        );
      }

      const quantityBase = row.quantity * packaging.factorToBase;

      const netAmount = multiplyMoney(packaging.salePrice, row.quantity);
      const taxRate = product.taxRate ?? '0';
      const taxAmount = applyRate(netAmount, taxRate);

      return {
        product,
        packaging,
        quantityPackages: row.quantity,
        quantityBase,
        unitPrice: fromUnits(toUnits(packaging.salePrice)),
        netAmount,
        taxRate: fromUnits(toUnits(taxRate)),
        taxAmount,
      };
    });
  }

  private async registerName(
    session: CashSession | null,
  ): Promise<string | null> {
    if (!session) return null;
    const register = await this.dataSource.manager.findOne(CashRegister, {
      where: { id: session.registerId },
    });
    return register?.name ?? null;
  }

  private async registerNames(
    manager: EntityManager,
    sales: Sale[],
  ): Promise<Map<string, string>> {
    const sessionIds = [
      ...new Set(
        sales
          .map((sale) => sale.sessionId)
          .filter((id): id is string => id !== null),
      ),
    ];
    if (sessionIds.length === 0) return new Map();

    const sessions = await manager.find(CashSession, {
      where: { id: In(sessionIds) },
    });
    const registers = await manager.find(CashRegister, {
      where: { id: In([...new Set(sessions.map((s) => s.registerId))]) },
    });
    const registerById = new Map(registers.map((row) => [row.id, row.name]));
    return new Map(
      sessions.map((session) => [
        session.id,
        registerById.get(session.registerId) ?? 'Caisse',
      ]),
    );
  }

  private async customerName(
    manager: EntityManager,
    credit: CreditSale | null,
  ): Promise<string | null> {
    if (!credit) return null;
    const customer = await manager.findOne(Customer, {
      where: { id: credit.customerId },
    });
    return customer?.name ?? null;
  }

  private toResponse(
    sale: Sale,
    items: SaleItem[],
    extra: {
      credit: CreditSale | null;
      received: string | null;
      change: string | null;
      registerName: string | null;
      customerName?: string | null;
    },
  ): SaleResponseDto {
    const lines: SaleLineResponseDto[] = items
      .sort((left, right) => left.lineNumber - right.lineNumber)
      .map((item) => ({
        productId: item.productId,
        name: item.nameSnapshot,
        packaging: item.packagingSnapshot,
        quantity: item.quantityPackages,
        factor: item.factorSnapshot,
        quantityBase: item.quantityBase,
        unitPrice: item.unitPrice,
        lineTotal: addMoney(item.netAmount, item.taxAmount),
      }));

    return {
      id: sale.id,
      number: sale.number,
      channel: sale.channel,
      subtotal: sale.subtotal,
      taxTotal: sale.taxTotal,
      total: sale.total,
      received: extra.received,
      change: extra.change,
      registerName: extra.registerName,
      sessionId: sale.sessionId,
      customerName: extra.customerName ?? null,
      credit: extra.credit
        ? {
            id: extra.credit.id,
            number: extra.credit.number,
            dueDate: extra.credit.dueDate as string,
            remaining: fromUnits(
              toUnits(extra.credit.total) - toUnits(extra.credit.paidTotal),
            ),
          }
        : null,
      items: lines,
      postedAt: sale.postedAt,
    };
  }
}
