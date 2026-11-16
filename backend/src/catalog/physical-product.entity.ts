import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { TrackingMode } from './catalog.enums.js';

@Entity({ name: 'physical_products' })
@Unique('uq_physical_products_scope', ['tenantId', 'id'])
@Unique('uq_physical_products_sku', ['tenantId', 'sku'])
export class PhysicalProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ type: 'varchar', length: 80 })
  sku: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'base_unit', type: 'varchar', length: 30 })
  baseUnit: string;

  @Column({
    name: 'tracking_mode',
    type: 'varchar',
    length: 20,
    default: TrackingMode.NONE,
  })
  trackingMode: TrackingMode;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
