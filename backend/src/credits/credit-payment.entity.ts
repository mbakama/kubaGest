import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { numericString } from '../common/decimal.js';

export enum CreditPaymentMethod {
  CASH = 'cash',
  MOBILE = 'mobile',
}

/** Règlement d'une vente à crédit, total ou partiel. */
@Entity({ name: 'credit_payments' })
@Unique('uq_credit_payments_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_credit_payments_credit', ['tenantId', 'creditId'])
export class CreditPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'credit_id', type: 'uuid' })
  creditId: string;

  @Column({
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  amount: string;

  @Column({ type: 'varchar', length: 16, default: CreditPaymentMethod.CASH })
  method: CreditPaymentMethod;

  @Column({ name: 'paid_at', type: Date, default: () => 'CURRENT_TIMESTAMP' })
  paidAt: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
