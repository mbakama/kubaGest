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

/** Fonds d'ouverture et comptage de clôture, par devise de la session. */
@Entity({ name: 'cash_session_currencies' })
@Unique('uq_cash_session_currencies_scope', [
  'tenantId',
  'establishmentId',
  'id',
])
@Unique('uq_cash_session_currencies_currency', ['sessionId', 'currency'])
@Index('idx_cash_session_currencies_session', ['tenantId', 'sessionId'])
export class CashSessionCurrency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'session_id', type: 'uuid' })
  sessionId: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({
    name: 'opening_amount',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  openingAmount: string;

  @Column({
    name: 'expected_at_close',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
    transformer: numericString(6),
  })
  expectedAtClose: string | null;

  @Column({
    name: 'counted_at_close',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
    transformer: numericString(6),
  })
  countedAtClose: string | null;

  @Column({
    name: 'difference_at_close',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
    transformer: numericString(6),
  })
  differenceAtClose: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
