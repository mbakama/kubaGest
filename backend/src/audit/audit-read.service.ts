import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import type { AuditLogViewDto } from './dto/audit-log-view.dto.js';
import { AuditLog } from './audit-log.entity.js';
import {
  PLATFORM_AUDIT_ACTIONS,
  TENANT_AUDIT_ACTIONS,
  resolveAuditActionLabel,
  resolveAuditEntityLabel,
} from './audit-visibility.js';

const DEFAULT_TENANT_LIMIT = 100;
const DEFAULT_PLATFORM_LIMIT = 100;

@Injectable()
export class AuditReadService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly logs: Repository<AuditLog>,
  ) {}

  async listForTenant(
    tenantId: string,
    limit = DEFAULT_TENANT_LIMIT,
  ): Promise<AuditLogViewDto[]> {
    const rows = await this.logs.find({
      where: {
        tenantId,
        action: In([...TENANT_AUDIT_ACTIONS]),
      },
      order: { occurredAt: 'DESC' },
      take: limit,
    });
    return rows.map((row) => this.toView(row));
  }

  private toView(row: AuditLog): AuditLogViewDto {
    return {
      id: row.id,
      action: row.action,
      actionLabel: resolveAuditActionLabel(row.action),
      entityType: row.entityType,
      entityLabel: resolveAuditEntityLabel(row.entityType),
      entityId: row.entityId,
      actorUserId: row.actorUserId,
      actorMembershipId: row.actorMembershipId,
      reason: row.reason,
      oldValues: row.oldValues,
      newValues: row.newValues,
      occurredAt: row.occurredAt,
    };
  }

  listForPlatform(limit = DEFAULT_PLATFORM_LIMIT): Promise<AuditLog[]> {
    return this.logs.find({
      where: {
        action: In([...PLATFORM_AUDIT_ACTIONS]),
      },
      order: { occurredAt: 'DESC' },
      take: limit,
    });
  }
}