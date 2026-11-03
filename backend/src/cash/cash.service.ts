import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { DataSource, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { addMoney, fromUnits, subtractMoney, toUnits } from '../common/money.js';
import { Tenant } from '../tenants/tenant.entity.js';
import { CashMovement, CashMovementKind } from './cash-movement.entity.js';
import { CashRegister } from './cash-register.entity.js';
import { CashSessionCurrency } from './cash-session-currency.entity.js';
import { CashSession, CashSessionStatus } from './cash-session.entity.js';

export type CashSessionView = {
  id: string;
  status: CashSessionStatus;
  registerName: string;
  openingAmount: string;
  movementsTotal: string;
  expectedAmount: string;
  openedAt: Date;
  closedAt: Date | null;
};

const DEFAULT_REGISTER = 'Caisse principale';

/**
 * Sessions de caisse et journal des espèces.
 *
 * Une vente en espèces exige une session ouverte. Au MVP, l'ouverture peut
 * être implicite au premier encaissement d'un caissier (fonds de 0) ; la
 * clôture explicite compare le comptage au solde attendu.
 */
@Injectable()
export class CashService {
  constructor(
    @InjectRepository(CashRegister)
    private readonly registers: Repository<CashRegister>,
    @InjectRepository(CashSession)
    private readonly sessions: Repository<CashSession>,
    @InjectRepository(CashSessionCurrency)
    private readonly currencies: Repository<CashSessionCurrency>,
    @InjectRepository(CashMovement)
    private readonly movements: Repository<CashMovement>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  async current(
    tenantId: string,
    establishmentId: string,
    cashierId: string,
  ): Promise<CashSessionView | null> {
    const session = await this.sessions.findOne({
      where: {
        tenantId,
        establishmentId,
        cashierId,
        status: CashSessionStatus.OPEN,
      },
    });
    return session ? this.view(session) : null;
  }

  async open(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    input: { openingAmount?: string; registerName?: string },
  ): Promise<CashSessionView> {
    const tenant = await this.tenants.findOne({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Commerce introuvable');
    const currency = tenant.currency;
    const existing = await this.sessions.findOne({
      where: {
        tenantId,
        establishmentId,
        cashierId: actorId,
        status: CashSessionStatus.OPEN,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Vous avez déjà une session de caisse ouverte.',
      );
    }

    const session = await this.dataSource.transaction(async (manager) => {
      const register = await this.register(
        manager,
        tenantId,
        establishmentId,
        input.registerName ?? DEFAULT_REGISTER,
      );

      const created = await manager.save(
        manager.create(CashSession, {
          tenantId,
          establishmentId,
          registerId: register.id,
          cashierId: actorId,
          status: CashSessionStatus.OPEN,
          openedBy: actorId,
          openedAt: new Date(),
          closedBy: null,
          closedAt: null,
          closingReason: null,
        }),
      );

      await manager.save(
        manager.create(CashSessionCurrency, {
          tenantId,
          establishmentId,
          sessionId: created.id,
          currency,
          openingAmount: input.openingAmount ?? '0.000000',
        }),
      );

      await this.audit.record(
        {
          action: 'cash_session.opened',
          entityType: 'cash_session',
          entityId: created.id,
          tenantId,
          establishmentId,
          actorId,
          newValues: {
            openingAmount: input.openingAmount ?? '0.000000',
            currency,
          },
        },
        manager,
      );

      return created;
    });

    return this.view(session);
  }

  async close(
    tenantId: string,
    establishmentId: string,
    actorId: string,
    sessionId: string,
    input: { countedAmount?: string; reason?: string } = {},
  ): Promise<CashSessionView> {
    await this.dataSource.transaction(async (manager) => {
      const session = await manager.findOne(CashSession, {
        where: { id: sessionId, tenantId, establishmentId },
      });

      if (!session) throw new NotFoundException('Session de caisse introuvable');
      if (session.status === CashSessionStatus.CLOSED) {
        throw new ConflictException('Cette session est déjà clôturée.');
      }

      const currencies = await manager.find(CashSessionCurrency, {
        where: { sessionId: session.id },
      });
      const movements = await manager.find(CashMovement, {
        where: { sessionId: session.id },
      });

      for (const row of currencies) {
        const total = movements
          .filter((movement) => movement.currency === row.currency)
          .reduce((sum, movement) => sum + toUnits(movement.amountDelta), 0n);
        const expected = addMoney(row.openingAmount, fromUnits(total));
        row.expectedAtClose = expected;
        if (input.countedAmount !== undefined && currencies.length === 1) {
          row.countedAtClose = input.countedAmount;
          row.differenceAtClose = subtractMoney(
            input.countedAmount,
            expected,
          );
        }
        await manager.save(row);
      }

      session.status = CashSessionStatus.CLOSED;
      session.closedBy = actorId;
      session.closedAt = new Date();
      session.closingReason = input.reason?.trim() || null;
      await manager.save(session);

      await this.audit.record(
        {
          action: 'cash_session.closed',
          entityType: 'cash_session',
          entityId: session.id,
          tenantId,
          establishmentId,
          actorId,
          reason: input.reason ?? null,
          newValues: { countedAmount: input.countedAmount ?? null },
        },
        manager,
      );
    });

    const closed = await this.sessions.findOneOrFail({
      where: { id: sessionId, tenantId, establishmentId },
    });
    return this.view(closed);
  }

  /** Session ouverte du caissier, ouverte à la volée pour le MVP. */
  async ensureSession(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    actorId: string,
    currency: string,
  ): Promise<CashSession> {
    const open = await manager.findOne(CashSession, {
      where: {
        tenantId,
        establishmentId,
        cashierId: actorId,
        status: CashSessionStatus.OPEN,
      },
    });

    if (open) {
      await this.ensureCurrency(manager, open, currency);
      return open;
    }

    const register = await this.register(
      manager,
      tenantId,
      establishmentId,
      DEFAULT_REGISTER,
    );

    let session: CashSession;
    try {
      session = await manager.save(
        manager.create(CashSession, {
          tenantId,
          establishmentId,
          registerId: register.id,
          cashierId: actorId,
          status: CashSessionStatus.OPEN,
          openedBy: actorId,
          openedAt: new Date(),
          closedBy: null,
          closedAt: null,
          closingReason: null,
        }),
      );
    } catch {
      // Une autre encaissement a ouvert la session au même instant.
      const concurrent = await manager.findOneOrFail(CashSession, {
        where: {
          tenantId,
          establishmentId,
          cashierId: actorId,
          status: CashSessionStatus.OPEN,
        },
      });
      await this.ensureCurrency(manager, concurrent, currency);
      return concurrent;
    }

    await this.ensureCurrency(manager, session, currency);

    await this.audit.record(
      {
        action: 'cash_session.auto_opened',
        entityType: 'cash_session',
        entityId: session.id,
        tenantId,
        establishmentId,
        actorId,
        newValues: { openingAmount: '0.000000', currency },
      },
      manager,
    );

    return session;
  }

  /** Écrit une entrée ou une sortie d'espèces liée à un règlement. */
  async recordMovement(
    manager: EntityManager,
    input: {
      tenantId: string;
      establishmentId: string;
      sessionId: string;
      currency: string;
      amountDelta: string;
      kind: CashMovementKind;
      paymentId?: string | null;
      creditPaymentId?: string | null;
      actorId: string | null;
    },
  ): Promise<void> {
    await manager.insert(CashMovement, {
      tenantId: input.tenantId,
      establishmentId: input.establishmentId,
      sessionId: input.sessionId,
      currency: input.currency,
      amountDelta: input.amountDelta,
      kind: input.kind,
      paymentId: input.paymentId ?? null,
      creditPaymentId: input.creditPaymentId ?? null,
      actorId: input.actorId,
      occurredAt: new Date(),
    });
  }

  async summaryFor(
    tenantId: string,
    establishmentId: string,
  ): Promise<{ status: 'none' | 'open' | 'closed'; expected: string }> {
    const open = await this.sessions.findOne({
      where: { tenantId, establishmentId, status: CashSessionStatus.OPEN },
      order: { openedAt: 'DESC' },
    });

    if (!open) return { status: 'none', expected: '0.000000' };

    const [rows, movements] = await Promise.all([
      this.currencies.find({ where: { sessionId: open.id } }),
      this.movements.find({ where: { sessionId: open.id } }),
    ]);

    const expected = rows.reduce((sum, row) => {
      const total = movements
        .filter((movement) => movement.currency === row.currency)
        .reduce((partial, movement) => partial + toUnits(movement.amountDelta), 0n);
      return sum + toUnits(row.openingAmount) + total;
    }, 0n);

    return {
      status: 'open',
      expected: fromUnits(expected),
    };
  }

  // --- Interne -------------------------------------------------------------

  private async view(session: CashSession): Promise<CashSessionView> {
    const [register, rows, movements] = await Promise.all([
      this.registers.findOne({ where: { id: session.registerId } }),
      this.currencies.find({ where: { sessionId: session.id } }),
      this.movements.find({ where: { sessionId: session.id } }),
    ]);
    const total = movements.reduce(
      (sum, movement) => sum + toUnits(movement.amountDelta),
      0n,
    );
    const movementsTotal = fromUnits(total);
    const expected = addMoney(
      ...rows.map((row) => row.openingAmount),
      movementsTotal,
    );

    return {
      id: session.id,
      status: session.status,
      registerName: register?.name ?? DEFAULT_REGISTER,
      openingAmount: rows[0]?.openingAmount ?? '0.000000',
      movementsTotal,
      expectedAmount: expected,
      openedAt: session.openedAt,
      closedAt: session.closedAt,
    };
  }

  private async register(
    manager: EntityManager,
    tenantId: string,
    establishmentId: string,
    name: string,
  ): Promise<CashRegister> {
    const existing = await manager.findOne(CashRegister, {
      where: { tenantId, establishmentId, name },
    });
    if (existing) return existing;

    try {
      return await manager.save(
        manager.create(CashRegister, {
          tenantId,
          establishmentId,
          name,
          isActive: true,
        }),
      );
    } catch {
      return manager.findOneOrFail(CashRegister, {
        where: { tenantId, establishmentId, name },
      });
    }
  }

  private async ensureCurrency(
    manager: EntityManager,
    session: CashSession,
    currency: string,
  ): Promise<void> {
    const row = await manager.findOne(CashSessionCurrency, {
      where: { sessionId: session.id, currency },
    });
    if (row) return;
    await manager.save(
      manager.create(CashSessionCurrency, {
        tenantId: session.tenantId,
        establishmentId: session.establishmentId,
        sessionId: session.id,
        currency,
        openingAmount: '0.000000',
      }),
    );
  }
}
