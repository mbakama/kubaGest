import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { CashService } from '../cash/cash.service.js';
import { CashMovementKind } from '../cash/cash-movement.entity.js';
import { CatalogService } from '../catalog/catalog.service.js';
import { addDays, dateInZone, daysBetween } from '../common/date.js';
import {
  addMoney,
  fromUnits,
  greaterThan,
  isZero,
  toUnits,
} from '../common/money.js';
import { DocumentNumberService } from '../documents/document-number.service.js';
import { periodInZone } from '../common/date.js';
import { SmsService } from '../sms/sms.service.js';
import { Establishment } from '../tenants/establishment.entity.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { CreditPayment, CreditPaymentMethod } from './credit-payment.entity.js';
import {
  CreditReminder,
  CreditReminderStatus,
} from './credit-reminder.entity.js';
import { CreditSale, CreditStatus } from './credit-sale.entity.js';
import { Customer } from './customer.entity.js';
import {
  CancelCreditDto,
  CreateCreditDto,
  CreateCreditPaymentDto,
  CreateCustomerDto,
  CreditFilter,
  ListCreditsQueryDto,
  ListCustomersQueryDto,
  UpdateCustomerDto,
} from './dto/credit.dto.js';
import {
  CreditPaymentResponseDto,
  CreditReminderResponseDto,
  CreditResponseDto,
  CreditSummaryDto,
  CustomerResponseDto,
  ReminderRunResponseDto,
} from './dto/credit-response.dto.js';

const DEFAULT_DUE_DAYS = 30;
const DEFAULT_REMINDER_COOLDOWN_DAYS = 3;

export type SaleCreditContext = {
  tenantId: string;
  establishment: Establishment;
  actorId: string;
  customerId: string;
  total: string;
  dueDate?: string;
  note?: string | null;
  saleId?: string | null;
};

@Injectable()
export class CreditsService {
  constructor(
    @InjectRepository(Customer)
    private readonly customers: Repository<Customer>,
    @InjectRepository(CreditSale)
    private readonly credits: Repository<CreditSale>,
    @InjectRepository(CreditPayment)
    private readonly payments: Repository<CreditPayment>,
    @InjectRepository(CreditReminder)
    private readonly reminders: Repository<CreditReminder>,
    private readonly catalog: CatalogService,
    private readonly cash: CashService,
    private readonly numbers: DocumentNumberService,
    private readonly sms: SmsService,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  // --- Clients -------------------------------------------------------------

  async listCustomers(
    tenantId: string,
    query?: ListCustomersQueryDto,
  ): Promise<CustomerResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const rows = await this.customers
      .createQueryBuilder('customer')
      .where('customer.tenantId = :tenantId', { tenantId })
      .andWhere('customer.establishmentId = :establishmentId', {
        establishmentId: establishment.id,
      })
      .orderBy('customer.name', 'ASC')
      .getMany();

    const search = query?.query?.trim().toLowerCase();
    const filtered = search
      ? rows.filter(
          (customer) =>
            customer.name.toLowerCase().includes(search) ||
            (customer.phone ?? '').includes(search),
        )
      : rows;

    const balances = await this.balances(tenantId, establishment);
    return filtered.map((customer) =>
      this.toCustomerResponse(
        customer,
        balances.get(customer.id) ?? { outstanding: '0.000000', late: false },
      ),
    );
  }

  async createCustomer(
    tenantId: string,
    actorId: string,
    dto: CreateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    await this.assertPhoneFree(tenantId, establishment.id, dto.phone);

    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.save(
        manager.create(Customer, {
          tenantId,
          establishmentId: establishment.id,
          name: dto.name.trim(),
          phone: dto.phone ?? null,
          creditLimit: fromUnits(toUnits(dto.creditLimit ?? '0')),
          note: dto.note?.trim() || null,
          isActive: true,
        }),
      );

      await this.audit.record(
        {
          action: 'customer.created',
          entityType: 'customer',
          entityId: customer.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            name: customer.name,
            creditLimit: customer.creditLimit,
          },
        },
        manager,
      );

      return this.toCustomerResponse(customer, {
        outstanding: '0.000000',
        late: false,
      });
    });
  }

  async updateCustomer(
    tenantId: string,
    actorId: string,
    customerId: string,
    dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    return this.dataSource.transaction(async (manager) => {
      const customer = await manager.findOne(Customer, {
        where: { id: customerId, tenantId, establishmentId: establishment.id },
      });

      if (!customer) throw new NotFoundException('Client introuvable');

      if (dto.phone && dto.phone !== customer.phone) {
        await this.assertPhoneFree(
          tenantId,
          establishment.id,
          dto.phone,
          customer.id,
        );
      }

      const previousLimit = customer.creditLimit;
      if (dto.name !== undefined) customer.name = dto.name.trim();
      if (dto.phone !== undefined) customer.phone = dto.phone;
      if (dto.creditLimit !== undefined) {
        customer.creditLimit = fromUnits(toUnits(dto.creditLimit));
      }
      if (dto.isActive !== undefined) customer.isActive = dto.isActive;
      if (dto.note !== undefined) customer.note = dto.note?.trim() || null;

      await manager.save(customer);

      await this.audit.record(
        {
          action: 'customer.updated',
          entityType: 'customer',
          entityId: customer.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          oldValues: { creditLimit: previousLimit },
          newValues: { creditLimit: customer.creditLimit },
        },
        manager,
      );

      const balances = await this.balances(tenantId, establishment, manager);
      return this.toCustomerResponse(
        customer,
        balances.get(customer.id) ?? { outstanding: '0.000000', late: false },
      );
    });
  }

  // --- Carnet de crédit ----------------------------------------------------

  async listCredits(
    tenantId: string,
    query?: ListCreditsQueryDto,
  ): Promise<CreditResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const where: Record<string, unknown> = {
      tenantId,
      establishmentId: establishment.id,
    };
    if (query?.customerId) where.customerId = query.customerId;

    const rows = await this.credits.find({
      where,
      order: { createdAt: 'DESC' },
    });
    const items = await this.assemble(rows, establishment);
    const status = query?.status ?? CreditFilter.OPEN;

    return items
      .filter((credit) => {
        if (status === CreditFilter.ALL) return true;
        if (status === CreditFilter.PAID) {
          return credit.status === CreditStatus.PAID;
        }
        if (status === CreditFilter.LATE) return credit.daysLate != null;
        return credit.status === CreditStatus.OPEN;
      })
      .sort((left, right) => {
        const leftLate = left.daysLate ?? -1;
        const rightLate = right.daysLate ?? -1;
        if (leftLate !== rightLate) return rightLate - leftLate;
        return right.createdAt.getTime() - left.createdAt.getTime();
      });
  }

  /** Crée une dette hors ticket (saisie directe dans le carnet). */
  async createCredit(
    tenantId: string,
    actorId: string,
    dto: CreateCreditDto,
  ): Promise<CreditResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    return this.dataSource.transaction(async (manager) => {
      const credit = await this.createForSale(manager, {
        tenantId,
        establishment,
        actorId,
        customerId: dto.customerId,
        total: dto.total,
        dueDate: dto.dueDate,
        note: dto.note,
        saleId: null,
      });

      return (await this.assemble([credit], establishment, manager))[0];
    });
  }

  /**
   * Écrit la dette dans la transaction de la vente : contrôle du plafond,
   * numérotation et audit compris. Aucune vente à crédit sans client.
   */
  async createForSale(
    manager: EntityManager,
    context: SaleCreditContext,
  ): Promise<CreditSale> {
    const total = fromUnits(toUnits(context.total));
    if (toUnits(total) <= 0n) {
      throw new BadRequestException('Le montant du crédit doit être positif.');
    }

    const customer = await manager.findOne(Customer, {
      where: {
        id: context.customerId,
        tenantId: context.tenantId,
        establishmentId: context.establishment.id,
      },
    });

    if (!customer) throw new NotFoundException('Client introuvable');
    if (!customer.isActive) {
      throw new BadRequestException('Ce client est désactivé.');
    }
    if (isZero(customer.creditLimit)) {
      throw new BadRequestException(
        `Le crédit n’est pas ouvert pour ${customer.name}.`,
      );
    }

    const open = await manager.find(CreditSale, {
      where: {
        tenantId: context.tenantId,
        establishmentId: context.establishment.id,
        customerId: customer.id,
        status: CreditStatus.OPEN,
      },
    });
    const outstanding = open.reduce(
      (sum, credit) => sum + toUnits(credit.total) - toUnits(credit.paidTotal),
      0n,
    );
    const projected = fromUnits(outstanding + toUnits(total));

    if (greaterThan(projected, customer.creditLimit)) {
      throw new ConflictException(
        `Le plafond de crédit de ${customer.name} est atteint ` +
          `(encours ${fromUnits(outstanding)}, plafond ${customer.creditLimit}).`,
      );
    }

    const today = dateInZone(context.establishment.timezone);
    const credit = await manager.save(
      manager.create(CreditSale, {
        tenantId: context.tenantId,
        establishmentId: context.establishment.id,
        customerId: customer.id,
        saleId: context.saleId ?? null,
        number: await this.numbers.next(
          manager,
          context.tenantId,
          'credit',
          periodInZone(context.establishment.timezone),
        ),
        total,
        paidTotal: '0.000000',
        dueDate: context.dueDate ?? addDays(today, DEFAULT_DUE_DAYS),
        status: CreditStatus.OPEN,
        note: context.note?.trim() || null,
        createdBy: context.actorId,
      }),
    );

    await this.audit.record(
      {
        action: 'credit.created',
        entityType: 'credit_sale',
        entityId: credit.id,
        tenantId: context.tenantId,
        establishmentId: context.establishment.id,
        actorId: context.actorId,
        newValues: {
          customerId: customer.id,
          number: credit.number,
          total: credit.total,
          dueDate: credit.dueDate,
          saleId: credit.saleId,
        },
      },
      manager,
    );

    return credit;
  }

  async recordPayment(
    tenantId: string,
    actorId: string,
    creditId: string,
    dto: CreateCreditPaymentDto,
  ): Promise<CreditResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    return this.dataSource.transaction(async (manager) => {
      const credit = await manager.findOne(CreditSale, {
        where: { id: creditId, tenantId, establishmentId: establishment.id },
      });

      if (!credit) throw new NotFoundException('Crédit introuvable');
      if (credit.status !== CreditStatus.OPEN) {
        throw new BadRequestException(
          'Cette vente à crédit n’attend plus de règlement.',
        );
      }

      const amount = fromUnits(toUnits(dto.amount));
      if (toUnits(amount) <= 0n) {
        throw new BadRequestException('Le règlement doit être positif.');
      }

      const remaining = fromUnits(
        toUnits(credit.total) - toUnits(credit.paidTotal),
      );
      if (greaterThan(amount, remaining)) {
        throw new BadRequestException(
          `Le règlement dépasse le reste dû (${remaining}).`,
        );
      }

      const method = dto.method ?? CreditPaymentMethod.CASH;
      const payment = await manager.save(
        manager.create(CreditPayment, {
          tenantId,
          establishmentId: establishment.id,
          creditId: credit.id,
          amount,
          method,
          paidAt: dto.paidAt ? new Date(`${dto.paidAt}T12:00:00Z`) : new Date(),
          createdBy: actorId,
        }),
      );

      if (method === CreditPaymentMethod.CASH) {
        const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });
        if (!tenant) throw new NotFoundException('Commerce introuvable');
        const session = await this.cash.ensureSession(
          manager,
          tenantId,
          establishment.id,
          actorId,
          tenant.currency,
        );
        await this.cash.recordMovement(manager, {
          tenantId,
          establishmentId: establishment.id,
          sessionId: session.id,
          currency: tenant.currency,
          amountDelta: amount,
          kind: CashMovementKind.CREDIT_PAYMENT,
          creditPaymentId: payment.id,
          actorId,
        });
      }

      credit.paidTotal = addMoney(credit.paidTotal, amount);
      if (toUnits(credit.paidTotal) >= toUnits(credit.total)) {
        credit.status = CreditStatus.PAID;
      }
      await manager.save(credit);

      await this.audit.record(
        {
          action: 'credit.payment_recorded',
          entityType: 'credit_sale',
          entityId: credit.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            amount,
            method,
            paidTotal: credit.paidTotal,
            status: credit.status,
          },
        },
        manager,
      );

      return (await this.assemble([credit], establishment, manager))[0];
    });
  }

  async cancelCredit(
    tenantId: string,
    actorId: string,
    creditId: string,
    dto: CancelCreditDto,
  ): Promise<CreditResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);

    return this.dataSource.transaction(async (manager) => {
      const credit = await manager.findOne(CreditSale, {
        where: { id: creditId, tenantId, establishmentId: establishment.id },
      });

      if (!credit) throw new NotFoundException('Crédit introuvable');
      if (!isZero(credit.paidTotal)) {
        throw new BadRequestException(
          'Un crédit déjà réglé en partie ne peut pas être annulé.',
        );
      }
      if (credit.status === CreditStatus.CANCELLED) {
        throw new BadRequestException('Ce crédit est déjà annulé.');
      }

      credit.status = CreditStatus.CANCELLED;
      if (dto.reason) credit.note = dto.reason.trim();
      await manager.save(credit);

      await this.audit.record(
        {
          action: 'credit.cancelled',
          entityType: 'credit_sale',
          entityId: credit.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          reason: dto.reason ?? null,
          newValues: { status: credit.status },
        },
        manager,
      );

      return (await this.assemble([credit], establishment, manager))[0];
    });
  }

  async summary(tenantId: string): Promise<CreditSummaryDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const today = dateInZone(establishment.timezone);
    const open = await this.credits.find({
      where: {
        tenantId,
        establishmentId: establishment.id,
        status: CreditStatus.OPEN,
      },
    });

    let outstanding = 0n;
    let lateAmount = 0n;
    let lateCount = 0;
    const customers = new Set<string>();
    for (const credit of open) {
      const remaining = toUnits(credit.total) - toUnits(credit.paidTotal);
      outstanding += remaining;
      customers.add(credit.customerId);
      if (credit.dueDate && credit.dueDate < today) {
        lateCount += 1;
        lateAmount += remaining;
      }
    }

    return {
      outstanding: fromUnits(outstanding),
      openCount: open.length,
      lateCount,
      lateAmount: fromUnits(lateAmount),
      customerCount: customers.size,
    };
  }

  // --- Relances ------------------------------------------------------------

  async listReminders(
    tenantId: string,
    creditId?: string,
  ): Promise<CreditReminderResponseDto[]> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const where: Record<string, unknown> = {
      tenantId,
      establishmentId: establishment.id,
    };
    if (creditId) where.creditId = creditId;

    const rows = await this.reminders.find({
      where,
      order: { sentAt: 'DESC' },
      take: 100,
    });

    return rows.map((row) => ({
      id: row.id,
      creditId: row.creditId,
      status: row.status,
      recipient: row.recipient,
      message: row.message,
      sentAt: row.sentAt,
    }));
  }

  /**
   * Relance les clients dont un crédit est échu.
   *
   * Un client n'est relancé qu'une fois par période de refroidissement, quel
   * que soit le nombre de crédits concernés : un seul SMS récapitule la dette.
   */
  async sendReminders(
    tenantId: string,
    actorId: string | null,
    options: { cooldownDays?: number; dryRun?: boolean } = {},
  ): Promise<ReminderRunResponseDto> {
    const establishment = await this.catalog.resolveEstablishment(tenantId);
    const cooldown = options.cooldownDays ?? DEFAULT_REMINDER_COOLDOWN_DAYS;
    const today = dateInZone(establishment.timezone);

    const tenant = await this.dataSource.manager.findOne(Tenant, {
      where: { id: tenantId },
    });
    if (!tenant) throw new NotFoundException('Commerce introuvable');

    const late = await this.dataSource.manager
      .createQueryBuilder(CreditSale, 'credit')
      .where('credit.tenantId = :tenantId', { tenantId })
      .andWhere('credit.establishmentId = :establishmentId', {
        establishmentId: establishment.id,
      })
      .andWhere('credit.status = :status', { status: CreditStatus.OPEN })
      .andWhere('credit.dueDate < :today', { today })
      .getMany();

    if (late.length === 0) {
      return {
        sent: 0,
        skipped: 0,
        failed: 0,
        candidates: 0,
        smsConfigured: this.sms.isConfigured(),
        message: 'Aucun crédit échu.',
      };
    }

    if (!this.sms.isConfigured()) {
      return {
        sent: 0,
        skipped: 0,
        failed: 0,
        candidates: 0,
        smsConfigured: false,
        message:
          'L’envoi de SMS n’est pas configuré : aucune relance n’a été envoyée.',
      };
    }

    const customers = await this.customers.find({
      where: { id: In([...new Set(late.map((credit) => credit.customerId))]) },
    });
    const byCustomer = new Map(customers.map((c) => [c.id, c]));
    const grouped = new Map<string, CreditSale[]>();
    for (const credit of late) {
      const list = grouped.get(credit.customerId) ?? [];
      list.push(credit);
      grouped.set(credit.customerId, list);
    }

    const since = new Date(Date.now() - cooldown * 86_400_000);
    const recent = await this.reminders
      .createQueryBuilder('reminder')
      .where('reminder.tenantId = :tenantId', { tenantId })
      .andWhere('reminder.establishmentId = :establishmentId', {
        establishmentId: establishment.id,
      })
      .andWhere('reminder.status = :status', {
        status: CreditReminderStatus.SENT,
      })
      .andWhere('reminder.sentAt >= :since', { since })
      .getMany();
    const recentlyReminded = new Set(recent.map((row) => row.creditId));

    let sent = 0;
    let skipped = 0;
    let failed = 0;
    let candidates = 0;

    for (const [customerId, credits] of grouped) {
      const customer = byCustomer.get(customerId);
      if (!customer || !customer.phone) {
        skipped += 1;
        continue;
      }
      if (credits.some((credit) => recentlyReminded.has(credit.id))) {
        skipped += 1;
        continue;
      }

      candidates += 1;
      const remaining = credits.reduce(
        (sum, credit) => sum + toUnits(credit.total) - toUnits(credit.paidTotal),
        0n,
      );
      const oldest = credits.reduce((min, credit) =>
        (credit.dueDate ?? today) < (min.dueDate ?? today) ? credit : min,
      );
      const daysLate = oldest.dueDate
        ? daysBetween(oldest.dueDate, today)
        : 0;
      const message = this.reminderMessage({
        firstName: customer.name.split(' ')[0],
        amount: fromUnits(remaining),
        currency: tenant.currency,
        tenantName: tenant.name,
        daysLate,
      });

      if (options.dryRun) continue;

      try {
        await this.sms.send({ to: customer.phone, body: message });
        await this.reminders.save(
          credits.map((credit) =>
            this.reminders.create({
              tenantId,
              establishmentId: establishment.id,
              creditId: credit.id,
              channel: 'sms',
              status: CreditReminderStatus.SENT,
              recipient: customer.phone,
              message,
              sentAt: new Date(),
            }),
          ),
        );
        sent += 1;

        await this.audit.record({
          action: 'credit.reminder_sent',
          entityType: 'customer',
          entityId: customer.id,
          tenantId,
          establishmentId: establishment.id,
          actorId,
          newValues: {
            credits: credits.map((credit) => credit.number),
            amount: fromUnits(remaining),
            daysLate,
          },
        });
      } catch {
        failed += 1;
        await this.reminders.save(
          credits.map((credit) =>
            this.reminders.create({
              tenantId,
              establishmentId: establishment.id,
              creditId: credit.id,
              channel: 'sms',
              status: CreditReminderStatus.FAILED,
              recipient: customer.phone,
              message,
              sentAt: new Date(),
            }),
          ),
        );
      }
    }

    return {
      sent,
      skipped,
      failed,
      candidates,
      smsConfigured: true,
      message:        candidates === 0 && skipped > 0
          ? 'Les clients concernés ont déjà été relancés récemment ou n’ont pas de téléphone.'
          : null,
    };
  }

  // --- Interne -------------------------------------------------------------

  private reminderMessage(input: {
    firstName: string;
    amount: string;
    currency: string;
    tenantName: string;
    daysLate: number;
  }): string {
    const amount = formatReminderAmount(input.amount);
    return (
      `${input.tenantName} : ${input.firstName}, votre dette de ` +
      `${amount} ${input.currency} est échue depuis ${input.daysLate} jour(s). ` +
      `Merci de passer régler.`
    );
  }

  private async assertPhoneFree(
    tenantId: string,
    establishmentId: string,
    phone: string | undefined,
    ignoreId?: string,
  ): Promise<void> {
    if (!phone) return;
    const existing = await this.customers.findOne({
      where: { tenantId, establishmentId, phone },
    });
    if (existing && existing.id !== ignoreId) {
      throw new ConflictException(
        'Ce numéro est déjà rattaché à un autre client.',
      );
    }
  }

  private async balances(
    tenantId: string,
    establishment: Establishment,
    manager?: EntityManager,
  ): Promise<Map<string, { outstanding: string; late: boolean }>> {
    const repository = manager
      ? manager.getRepository(CreditSale)
      : this.credits;
    const rows = await repository.find({
      where: {
        tenantId,
        establishmentId: establishment.id,
        status: CreditStatus.OPEN,
      },
    });
    const today = dateInZone(establishment.timezone);
    const map = new Map<string, { outstanding: string; late: boolean }>();
    for (const credit of rows) {
      const current = map.get(credit.customerId) ?? {
        outstanding: '0.000000',
        late: false,
      };
      const remaining = fromUnits(
        toUnits(credit.total) - toUnits(credit.paidTotal),
      );
      map.set(credit.customerId, {
        outstanding: addMoney(current.outstanding, remaining),
        late: current.late || (credit.dueDate != null && credit.dueDate < today),
      });
    }
    return map;
  }

  private async assemble(
    credits: CreditSale[],
    establishment: Establishment,
    manager?: EntityManager,
  ): Promise<CreditResponseDto[]> {
    if (credits.length === 0) return [];
    const today = dateInZone(establishment.timezone);

    const paymentRepository = manager
      ? manager.getRepository(CreditPayment)
      : this.payments;
    const paymentRows = await paymentRepository.find({
      where: { creditId: In(credits.map((credit) => credit.id)) },
      order: { paidAt: 'ASC' },
    });
    const byCredit = new Map<string, CreditPaymentResponseDto[]>();
    for (const payment of paymentRows) {
      const list = byCredit.get(payment.creditId) ?? [];
      list.push({
        id: payment.id,
        amount: payment.amount,
        method: payment.method,
        paidAt: payment.paidAt,
      });
      byCredit.set(payment.creditId, list);
    }

    const customerRepository = manager
      ? manager.getRepository(Customer)
      : this.customers;
    const customers = await customerRepository.find({
      where: { id: In([...new Set(credits.map((credit) => credit.customerId))]) },
    });
    const names = new Map(
      customers.map((customer) => [customer.id, customer.name]),
    );

    return credits.map((credit) => {
      const remaining = fromUnits(
        toUnits(credit.total) - toUnits(credit.paidTotal),
      );
      const late =
        credit.status === CreditStatus.OPEN &&
        credit.dueDate != null &&
        credit.dueDate < today
          ? daysBetween(credit.dueDate, today)
          : null;
      return {
        id: credit.id,
        number: credit.number,
        saleId: credit.saleId,
        customerId: credit.customerId,
        customerName: names.get(credit.customerId) ?? 'Client',
        total: credit.total,
        paidTotal: credit.paidTotal,
        remaining,
        dueDate: credit.dueDate,
        daysLate: late,
        status: credit.status,
        note: credit.note,
        createdAt: credit.createdAt,
        payments: byCredit.get(credit.id) ?? [],
      };
    });
  }

  private toCustomerResponse(
    customer: Customer,
    balance: { outstanding: string; late: boolean },
  ): CustomerResponseDto {
    const available = fromUnits(
      toUnits(customer.creditLimit) - toUnits(balance.outstanding),
    );
    return {
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      creditLimit: customer.creditLimit,
      outstanding: balance.outstanding,
      available: greaterThan('0.000000', available) ? '0.000000' : available,
      hasLateCredit: balance.late,
      isActive: customer.isActive,
      note: customer.note,
      createdAt: customer.createdAt,
    };
  }
}

/** Montant lisible dans un SMS : francs entiers, sans décimales inutiles. */
function formatReminderAmount(value: string): string {
  const units = toUnits(value);
  const whole = units / 1_000_000n;
  return whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}
