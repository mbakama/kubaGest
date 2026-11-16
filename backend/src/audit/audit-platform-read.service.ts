import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity.js';
import type { PlatformDashboardActivityDto } from '../tenants/dto/platform-dashboard-response.dto.js';
import { Tenant } from '../tenants/entities/tenant.entity.js';
import { AuditReadService } from './audit-read.service.js';
import type { AuditLog } from './audit-log.entity.js';
import { resolveAuditActionLabel } from './audit-visibility.js';

@Injectable()
export class AuditPlatformReadService {
  constructor(
    private readonly auditRead: AuditReadService,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenants: Repository<Tenant>,
  ) {}

  async listActivity(limit = 100): Promise<PlatformDashboardActivityDto[]> {
    const rows = await this.auditRead.listForPlatform(limit);
    if (rows.length === 0) {
      return [];
    }
    return this.mapRows(rows);
  }

  async listRecentForDashboard(limit = 10): Promise<PlatformDashboardActivityDto[]> {
    return this.listActivity(limit);
  }

  private async mapRows(
    rows: AuditLog[],
  ): Promise<PlatformDashboardActivityDto[]> {
    const tenantIds = [
      ...new Set(
        rows
          .map((row) => row.tenantId ?? row.entityId)
          .filter((id): id is string => Boolean(id)),
      ),
    ];
    const tenantNames = new Map<string, string>();
    if (tenantIds.length > 0) {
      const found = await this.tenants.find({
        where: { id: In(tenantIds) },
        select: { id: true, name: true },
      });
      for (const tenant of found) {
        tenantNames.set(tenant.id, tenant.name);
      }
    }

    const actorIds = [
      ...new Set(rows.map((row) => row.actorUserId).filter((id): id is string => Boolean(id))),
    ];
    const actors = new Map<string, User>();
    if (actorIds.length > 0) {
      const found = await this.users.find({
        where: { id: In(actorIds) },
        select: { id: true, firstName: true, lastName: true, email: true },
      });
      for (const actor of found) actors.set(actor.id, actor);
    }

    return rows.map((row) => {
      const tenantId = row.tenantId ?? row.entityId;
      const actor = row.actorUserId ? actors.get(row.actorUserId) : undefined;
      const fullName = [actor?.firstName, actor?.lastName].filter(Boolean).join(' ');
      const identity = {
        id: row.id,
        actorName: fullName || actor?.email || null,
        actorEmail: actor?.email ?? null,
        tenantId: row.tenantId,
      };
      const fallbackName =
        typeof row.newValues?.name === 'string'
          ? row.newValues.name
          : 'Espace';
      const detail = tenantId
        ? (tenantNames.get(tenantId) ?? fallbackName)
        : fallbackName;

      return {
        ...identity,
        kind: row.action,
        title: resolveAuditActionLabel(row.action),
        detail,
        occurredAt: row.occurredAt,
      };
    });
  }

}