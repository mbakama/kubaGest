import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';
import { AllocationPolicy } from './catalog.enums.js';

@Entity({ name: 'establishment_products' })
@Unique('uq_establishment_products_scope', [
  'tenantId',
  'establishmentId',
  'physicalProductId',
])
export class EstablishmentProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string | null;

  @Column({ name: 'local_name', type: 'varchar', length: 200, nullable: true })
  localName: string | null;

  @Column({
    name: 'reorder_level',
    type: 'bigint',
    default: 0,
    transformer: bigintNumber,
  })
  reorderLevel: number;

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
