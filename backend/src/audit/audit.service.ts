import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager } from 'typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity.js';

export type AuditEntry = {
  action: string;
  entityType: string;
  entityId?: string | null;
  tenantId?: string | null;
  establishmentId?: string | null;
  /** Compte global à l'origine de l'action. */
  actorId?: string | null;
  /** Rattachement tenant utilisé par l'auteur, si applicable. */
  actorMembershipId?: string | null;
  reason?: string | null;
  requestId?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
};

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly logs: Repository<AuditLog>,
  ) {}

  /**
   * Enregistre une entrée d'audit. Fournir `manager` permet d'écrire dans la
   * même transaction que l'opération auditée : si l'action échoue, la trace
   * n'existe pas non plus.
   */
  async record(entry: AuditEntry, manager?: EntityManager): Promise<void> {
    const repository = manager ? manager.getRepository(AuditLog) : this.logs;

    await repository.insert({
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      tenantId: entry.tenantId ?? null,
      establishmentId: entry.establishmentId ?? null,
      actorUserId: entry.actorId ?? null,
      actorMembershipId: entry.actorMembershipId ?? null,
      reason: entry.reason ?? null,
      requestId: entry.requestId ?? null,
      // Colonne `jsonb` : TypeORM sérialise l'objet, mais son type d'insertion
      // ne reconnaît pas un objet libre.
      oldValues: (entry.oldValues ?? null) as never,
      newValues: (entry.newValues ?? null) as never,
    });
  }
}
