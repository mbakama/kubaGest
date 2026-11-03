import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityType } from './activity-type.enum.js';

@Entity({ name: 'establishments' })
@Index('idx_establishments_tenant', ['tenantId'])
export class Establishment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ name: 'activity_type', type: 'varchar', length: 20 })
  activityType: ActivityType;

  /** Adresse du point de vente, distincte de l'adresse du compte tenant. */
  @Column({ type: 'text', nullable: true })
  address: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Fuseau utilisé pour les conventions de date (péremption, clôture).
   * Les dates sont stockées en UTC et affichées dans ce fuseau.
   */
  @Column({ type: 'varchar', length: 60, default: 'Africa/Kinshasa' })
  timezone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
