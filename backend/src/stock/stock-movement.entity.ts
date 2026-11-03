import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
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
@Unique('uq_stock_movements_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_stock_movements_product', [
  'tenantId',
  'establishmentId',
  'productId',
])
@Index('idx_stock_movements_sale', ['tenantId', 'saleItemId'])
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 20, default: StockBucket.AVAILABLE })
  bucket: StockBucket;

  @Column({
    name: 'quantity_delta',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityDelta: number;

  @Column({ type: 'varchar', length: 30 })
  kind: StockMovementKind;

  @Column({ name: 'sale_item_id', type: 'uuid', nullable: true })
  saleItemId: string | null;

  @Column({ type: 'text', nullable: true })
  reference: string | null;

  @Column({ name: 'actor_id', type: 'uuid', nullable: true })
  actorId: string | null;

  @Column({
    name: 'occurred_at',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
