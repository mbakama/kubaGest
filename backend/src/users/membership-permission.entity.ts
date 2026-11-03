import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Dérogation explicite accordée à un rattachement (dictionnaire §3) : remise
 * exceptionnelle, ajustement de stock, annulation, remboursement… Les droits
 * effectifs combinent le rôle et ces dérogations, sans contourner l'isolation
 * tenant. Chaque changement est audité.
 */
@Entity({ name: 'membership_permissions' })
@Unique('uq_membership_permissions_scope', [
  'tenantId',
  'membershipId',
  'permissionCode',
])
@Index('idx_membership_permissions_tenant', ['tenantId', 'membershipId'])
export class MembershipPermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'membership_id', type: 'uuid' })
  membershipId: string;

  @Column({ name: 'permission_code', type: 'varchar', length: 80 })
  permissionCode: string;

  @Column({ type: 'boolean', default: true })
  allowed: boolean;

  @Column({ name: 'granted_by', type: 'uuid', nullable: true })
  grantedBy: string | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
