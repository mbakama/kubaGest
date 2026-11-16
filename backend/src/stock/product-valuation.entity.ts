import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';

/** Valorisation CUMP par article et entrepôt (quantité, coût moyen, valeur totale). */
@Entity({ name: 'product_valuations' })
@Unique('uq_product_valuations', ['tenantId', 'warehouseId', 'physicalProductId'])
@Index('idx_product_valuations_tenant', ['tenantId', 'warehouseId', 'physicalProductId'])
export class ProductValuation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({ type: 'bigint', default: 0, transformer: bigintNumber })
  quantity: number;

  @Column({
    name: 'average_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  averageCost: string;

  @Column({
    name: 'total_value',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  totalValue: string;

  @Column({ type: 'bigint', default: 0, transformer: bigintNumber })
  version: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
