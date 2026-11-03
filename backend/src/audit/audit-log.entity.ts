import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Journal d'audit (§9, §12 et §24 du cahier des charges) : toute action
 * sensible est tracée avec auteur, cible, motif et valeurs avant/après.
 * Les lignes ne sont jamais modifiées ni supprimées.
 *
 * `actor_user_id` identifie le compte global ; `actor_membership_id` le
 * rattachement tenant utilisé. Les métadonnées sont filtrées : aucun mot de
 * passe, jeton ou secret.
 */
@Entity({ name: 'audit_logs' })
@Index('idx_audit_logs_tenant', ['tenantId'])
@Index('idx_audit_logs_tenant_occurred', ['tenantId', 'occurredAt'])
@Index('idx_audit_logs_entity', ['tenantId', 'entityType', 'entityId'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid', nullable: true })
  tenantId: string | null;

  @Column({ name: 'establishment_id', type: 'uuid', nullable: true })
  establishmentId: string | null;

  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId: string | null;

  @Column({ name: 'actor_membership_id', type: 'uuid', nullable: true })
  actorMembershipId: string | null;

  @Column({ type: 'varchar', length: 100 })
  action: string;

  @Column({ name: 'entity_type', type: 'varchar', length: 60 })
  entityType: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 64, nullable: true })
  entityId: string | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ name: 'old_values', type: 'jsonb', nullable: true })
  oldValues: Record<string, unknown> | null;

  @Column({ name: 'new_values', type: 'jsonb', nullable: true })
  newValues: Record<string, unknown> | null;

  /** Corrélation avec la requête HTTP d'origine. */
  @Column({ name: 'request_id', type: 'uuid', nullable: true })
  requestId: string | null;

  @CreateDateColumn({ name: 'occurred_at' })
  occurredAt: Date;
}
