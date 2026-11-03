import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TenantStatus } from './tenant.enums.js';

@Entity({ name: 'tenants' })
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20, default: TenantStatus.TRIAL })
  status: TenantStatus;

  /**
   * Devise de référence du tenant (ISO 4217). Les montants sont stockés en
   * DECIMAL et les taux USD/CDF figés à la transaction (F07, §10).
   */
  @Column({ type: 'varchar', length: 3, default: 'CDF' })
  currency: string;

  /** Adresse facultative de l'établissement (F01). */
  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
