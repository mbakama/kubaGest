import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { numericString } from '../common/decimal.js';

export enum PaymentDirection {
  IN = 'in',
  OUT = 'out',
}

export enum PaymentPurpose {
  SETTLEMENT = 'settlement',
  CHANGE = 'change',
  REFUND = 'refund',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK = 'bank',
  MOBILE_MONEY = 'mobile_money',
}

/**
 * Flux de règlement d'un ticket. Le montant reçu et la monnaie rendue sont
 * deux lignes distinctes : le net affecté à la vente reste lisible.
 */
@Entity({ name: 'payments' })
@Unique('uq_payments_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_payments_sale', ['tenantId', 'saleId'])
export class SalePayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  saleId: string;

  @Column({ name: 'session_id', type: 'uuid', nullable: true })
  sessionId: string | null;

  @Column({ type: 'varchar', length: 10 })
  direction: PaymentDirection;

  @Column({ type: 'varchar', length: 20 })
  purpose: PaymentPurpose;

  @Column({ type: 'varchar', length: 20 })
  method: PaymentMethod;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  amount: string;

  @Column({ name: 'received_by', type: 'uuid', nullable: true })
  receivedBy: string | null;

  @Column({
    name: 'occurred_at',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  occurredAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
