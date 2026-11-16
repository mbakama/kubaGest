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

export enum StockBucket {
  AVAILABLE = 'available',
  QUARANTINE = 'quarantine',
}

/**
 * Projection du stock par article et compartiment, en unité de base.
 *
 * La projection est mise à jour dans la transaction du mouvement ; la somme
 * du journal `stock_movements` doit toujours lui être égale.
 */
@Entity({ name: 'stock_balances' })
@Unique('uq_stock_balances_scope', ['tenantId', 'id'])
@Index('idx_stock_balances_tenant', [
  'tenantId',
  'warehouseId',
  'physicalProductId',
])
export class StockBalance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({ name: 'batch_id', type: 'uuid', nullable: true })
  batchId: string | null;

  @Column({ type: 'varchar', length: 20, default: StockBucket.AVAILABLE })
  bucket: StockBucket;

  @Column({
    name: 'quantity_base',
    type: 'bigint',
    default: 0,
    transformer: bigintNumber,
  })
  quantityBase: number;

  @Column({ type: 'bigint', default: 0, transformer: bigintNumber })
  version: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
