import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { AuditService } from '../audit/audit.service.js';
import { ListTenantsQueryDto } from './dto/list-tenants-query.dto.js';
import {
  EstablishmentResponseDto,
  PlatformTenantResponseDto,
  SubscriptionResponseDto,
  TenantDetailResponseDto,
} from './dto/tenant-response.dto.js';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto.js';
import { UpdateTenantDto } from './dto/update-tenant.dto.js';
import { Establishment } from './establishment.entity.js';
import { Plan } from './plan.entity.js';
import { Subscription } from './subscription.entity.js';
import { TenantPlan } from './tenant.enums.js';
import { Tenant } from './tenant.entity.js';

function toEstablishment(entity: Establishment): EstablishmentResponseDto {
  return {
    id: entity.id,
    name: entity.name,
    activityType: entity.activityType,
    timezone: entity.timezone,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}

function toSubscription(
  entity: Subscription | null,
): SubscriptionResponseDto | null {
  return entity
    ? {
        plan: entity.plan?.code ?? '',
        status: entity.status,
        startAt: entity.startsAt,
        endAt: entity.endsAt,
      }
    : null;
}

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
    @InjectRepository(Establishment)
    private readonly establishments: Repository<Establishment>,
    @InjectRepository(Subscription)
    private readonly subscriptions: Repository<Subscription>,
    @InjectRepository(Plan)
    private readonly plans: Repository<Plan>,
    private readonly dataSource: DataSource,
    private readonly audit: AuditService,
  ) {}

  /**
   * Profil du tenant déduit du jeton. Aucun identifiant de tenant fourni par
   * le client n'est accepté sur cette route (§9, §28.5).
   */
  async getCurrent(tenantId: string): Promise<TenantDetailResponseDto> {
    const tenant = await this.tenants.findOne({ where: { id: tenantId } });

    if (!tenant) {
      throw new NotFoundException('Établissement introuvable');
    }

    const [establishments, subscription] = await Promise.all([
      this.establishments.find({
        where: { tenantId },
        order: { createdAt: 'ASC' },
      }),
      this.findCurrentSubscription(tenantId),
    ]);

    return {
      id: tenant.id,
      name: tenant.name,
      currency: tenant.currency,
      address: tenant.address,
      status: tenant.status,
      plan: subscription?.plan?.code ?? null,
      createdAt: tenant.createdAt,
      updatedAt: tenant.updatedAt,
      establishments: establishments.map(toEstablishment),
      subscription: toSubscription(subscription),
    };
  }

  listEstablishments(tenantId: string): Promise<EstablishmentResponseDto[]> {
    return this.establishments
      .find({ where: { tenantId }, order: { createdAt: 'ASC' } })
      .then((establishments) => establishments.map(toEstablishment));
  }

  /** Mise à jour du profil par le propriétaire (F01, F07). */
  async updateCurrent(
    tenantId: string,
    actorId: string,
    dto: UpdateTenantDto,
  ): Promise<TenantDetailResponseDto> {
    if (
      dto.name === undefined &&
      dto.currency === undefined &&
      dto.address === undefined
    ) {
      throw new BadRequestException('Aucune modification fournie');
    }

    await this.dataSource.transaction(async (manager) => {
      const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });

      if (!tenant) {
        throw new NotFoundException('Établissement introuvable');
      }

      const oldValues = {
        name: tenant.name,
        currency: tenant.currency,
        address: tenant.address,
      };

      if (dto.name !== undefined) {
        tenant.name = dto.name.trim();
      }
      if (dto.currency !== undefined) {
        tenant.currency = dto.currency;
      }
      if (dto.address !== undefined) {
        // Chaîne vide ou espaces : l'adresse est effacée.
        tenant.address = dto.address.trim() || null;
      }

      await manager.save(tenant);

      await this.audit.record(
        {
          action: 'tenant.updated',
          entityType: 'tenant',
          entityId: tenant.id,
          tenantId: tenant.id,
          actorId,
          oldValues,
          newValues: {
            name: tenant.name,
            currency: tenant.currency,
            address: tenant.address,
          },
        },
        manager,
      );
    });

    return this.getCurrent(tenantId);
  }

  /**
   * Gestion des abonnements et du statut par le super administrateur
   * plateforme (§3). Ces routes n'exposent aucune donnée métier du tenant.
   */
  async listForPlatform(
    query: ListTenantsQueryDto,
  ): Promise<PlatformTenantResponseDto[]> {
    const tenants = await this.tenants.find({
      where: query.status ? { status: query.status } : {},
      order: { createdAt: 'DESC' },
    });

    if (tenants.length === 0) {
      return [];
    }

    const subscriptions = await this.subscriptions.find({
      where: { tenantId: In(tenants.map((tenant) => tenant.id)) },
      relations: { plan: true },
      order: { startsAt: 'DESC' },
    });
    const latestByTenant = new Map<string, Subscription>();
    for (const subscription of subscriptions) {
      if (!latestByTenant.has(subscription.tenantId)) {
        latestByTenant.set(subscription.tenantId, subscription);
      }
    }

    return tenants.flatMap((tenant) => {
      const subscription = latestByTenant.get(tenant.id) ?? null;
      // Le filtre de formule porte sur l'abonnement, pas sur le tenant.
      if (query.plan && subscription?.plan?.code !== query.plan) {
        return [];
      }

      return [
        {
          id: tenant.id,
          name: tenant.name,
          currency: tenant.currency,
          address: tenant.address,
          status: tenant.status,
          plan: subscription?.plan?.code ?? null,
          createdAt: tenant.createdAt,
          updatedAt: tenant.updatedAt,
          subscription: toSubscription(subscription),
        },
      ];
    });
  }

  async updateSubscription(
    tenantId: string,
    actorId: string,
    dto: UpdateSubscriptionDto,
  ): Promise<PlatformTenantResponseDto> {
    if (
      dto.plan === undefined &&
      dto.status === undefined &&
      dto.endAt === undefined
    ) {
      throw new BadRequestException('Aucune modification fournie');
    }

    return this.dataSource.transaction(async (manager) => {
      const tenant = await manager.findOne(Tenant, { where: { id: tenantId } });

      if (!tenant) {
        throw new NotFoundException('Établissement introuvable');
      }

      let subscription = await manager.findOne(Subscription, {
        where: { tenantId },
        relations: { plan: true },
        order: { startsAt: 'DESC' },
      });

      const targetPlan = await this.resolvePlan(
        manager,
        dto.plan ?? subscription?.plan?.code ?? TenantPlan.ESSENTIAL,
      );

      const oldValues = {
        plan: subscription?.plan?.code ?? null,
        status: tenant.status,
        endAt: subscription?.endsAt ?? null,
      };

      tenant.status = dto.status ?? tenant.status;
      await manager.save(tenant);

      if (!subscription) {
        subscription = manager.create(Subscription, {
          tenantId,
          planId: targetPlan.id,
          status: tenant.status,
          currency: tenant.currency,
        });
      }

      subscription.planId = targetPlan.id;
      subscription.plan = targetPlan;
      subscription.status = dto.status ?? subscription.status;
      if (dto.endAt !== undefined) {
        subscription.endsAt = dto.endAt ? new Date(dto.endAt) : null;
      }
      await manager.save(subscription);

      await this.audit.record(
        {
          action: 'tenant.subscription.updated',
          entityType: 'tenant',
          entityId: tenant.id,
          tenantId: tenant.id,
          actorId,
          oldValues,
          newValues: {
            plan: targetPlan.code,
            status: subscription.status,
            endAt: subscription.endsAt,
          },
        },
        manager,
      );

      return {
        id: tenant.id,
        name: tenant.name,
        currency: tenant.currency,
        address: tenant.address,
        status: tenant.status,
        plan: targetPlan.code,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
        subscription: toSubscription(subscription),
      };
    });
  }

  private async resolvePlan(
    manager: EntityManager,
    code: string,
  ): Promise<Plan> {
    const plan = await manager.findOne(Plan, { where: { code } });

    if (!plan) {
      throw new BadRequestException(`Formule inconnue : ${code}`);
    }

    return plan;
  }

  private findCurrentSubscription(
    tenantId: string,
  ): Promise<Subscription | null> {
    return this.subscriptions.findOne({
      where: { tenantId },
      relations: { plan: true },
      order: { startsAt: 'DESC' },
    });
  }
}
