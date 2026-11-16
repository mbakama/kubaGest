import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';
import { StockBucket } from './stock-balance.entity.js';

export enum StockMovementKind {
  ENTRY = 'entry',
  SALE = 'sale',
  ADJUSTMENT = 'adjustment',
}

/**
 * Journal immuable des quantités. Chaque ligne décrit un seul sens de
 * mouvement : une vente écrit un delta négatif, une réception un delta
 * positif. Aucune mise à jour ni suppression après écriture.
 */
@Entity({ name: 'stock_movements' })
@Unique('uq_stock_movements_scope', ['tenantId', 'id'])
@Index('idx_stock_movements_product', [
  'tenantId',
  'warehouseId',
  'physicalProductId',
])
export class StockMovement {
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
    name: 'quantity_delta',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityDelta: number;

  @Column({
    name: 'unit_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
    transformer: numericString(6),
  })
  unitCost: string | null;

  @Column({
    name: 'total_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
    transformer: numericString(6),
  })
  totalCost: string | null;

  @Column({ type: 'varchar', length: 30 })
  kind: StockMovementKind;

  @Column({ name: 'source_type', type: 'varchar', length: 40, nullable: true })
  sourceType: string | null;

  @Column({ name: 'source_id', type: 'uuid', nullable: true })
  sourceId: string | null;

  @Column({ name: 'actor_membership_id', type: 'uuid', nullable: true })
  actorMembershipId: string | null;

  @Column({
    name: 'occurred_at',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
