import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { MembershipRole } from './membership-role.enum.js';

/**
 * Rattachement d'un compte utilisateur à un tenant, avec son rôle.
 * Un utilisateur peut appartenir à plusieurs tenants ; le contexte actif est
 * porté par le jeton et jamais fourni par le client.
 */
@Entity({ name: 'memberships' })
@Unique('uq_memberships_tenant_user', ['tenantId', 'userId'])
@Index('idx_memberships_user', ['userId'])
export class Membership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 20 })
  role: MembershipRole;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
