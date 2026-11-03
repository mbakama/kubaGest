import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';
import { AllocationPolicy, TrackingMode } from './catalog.enums.js';

/**
 * Article du catalogue (F02, F08 ; dictionnaire §4).
 *
 * - `sku` est unique par commerce (`UNIQUE(tenant_id, sku)`) ;
 * - `baseUnit` et `trackingMode` ne doivent plus changer dès qu'un mouvement
 *   de stock existe (contrôle de service, à activer avec le lot 3) ;
 * - une pharmacie exige `batch_expiry` et `fefo` pour ses médicaments.
 */
@Entity({ name: 'products' })
@Unique('uq_products_scope', ['tenantId', 'establishmentId', 'id'])
@Unique('uq_products_sku', ['tenantId', 'sku'])
@Index('idx_products_tenant', ['tenantId', 'establishmentId'])
@Index('idx_products_category', ['tenantId', 'establishmentId', 'categoryId'])
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ type: 'varchar', length: 80 })
  sku: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ name: 'base_unit', type: 'varchar', length: 30 })
  baseUnit: string;

  @Column({
    name: 'reorder_level',
    type: 'bigint',
    default: 0,
    transformer: bigintNumber,
  })
  reorderLevel: number;

  @Column({
    name: 'tracking_mode',
    type: 'varchar',
    length: 20,
    default: TrackingMode.NONE,
  })
  trackingMode: TrackingMode;

  @Column({
    name: 'allocation_policy',
    type: 'varchar',
    length: 10,
    default: AllocationPolicy.FIFO,
  })
  allocationPolicy: AllocationPolicy;

  @Column({
    name: 'tax_rate',
    type: 'numeric',
    precision: 7,
    scale: 4,
    default: 0,
    transformer: numericString(4),
  })
  taxRate: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
