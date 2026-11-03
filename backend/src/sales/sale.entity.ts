import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { numericString } from '../common/decimal.js';

export enum SaleStatus {
  POSTED = 'posted',
  PARTIALLY_RETURNED = 'partially_returned',
  RETURNED = 'returned',
  VOIDED = 'voided',
}

export enum SaleChannel {
  CASH = 'cash',
  MOBILE = 'mobile',
  CREDIT = 'credit',
}

/**
 * Ticket validé au comptoir.
 *
 * `total = subtotal − discount_total + tax_total + rounding_adjustment`. Le
 * document et ses effets (lignes, mouvements, paiements, crédit) sont créés
 * dans la même transaction ; les montants d'origine ne changent plus.
 */
@Entity({ name: 'sales' })
@Unique('uq_sales_scope', ['tenantId', 'establishmentId', 'id'])
@Unique('uq_sales_number', ['tenantId', 'number'])
@Index('idx_sales_posted', ['tenantId', 'establishmentId', 'postedAt'])
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ type: 'varchar', length: 60 })
  number: string;

  @Column({ name: 'cashier_id', type: 'uuid' })
  cashierId: string;

  /** Session de caisse exigée pour les espèces ; nulle sinon. */
  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId: string | null;

  @Column({
    type: 'varchar',
    length: 25,
    default: SaleStatus.POSTED,
  })
  status: SaleStatus;

  @Column({ name: 'reference_currency', type: 'varchar', length: 3 })
  referenceCurrency: string;

  /** Moyen de règlement retenu au comptoir. */
  @Column({ type: 'varchar', length: 16 })
  channel: SaleChannel;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  subtotal: string;

  @Column({
    name: 'discount_total',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  discountTotal: string;

  @Column({
    name: 'tax_total',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  taxTotal: string;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  total: string;

  @Column({
    name: 'rounding_adjustment',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  roundingAdjustment: string;

  @Column({
    name: 'posted_at',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  postedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
