import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { numericString } from '../common/decimal.js';

export enum CashMovementKind {
  SALE = 'sale',
  CHANGE = 'change',
  CREDIT_PAYMENT = 'credit_payment',
}

/**
 * Journal immuable des espèces. Le montant reçu et la monnaie rendue sont
 * deux écritures distinctes ; la caisse attendue est le fonds d'ouverture
 * augmenté de la somme de ces deltas.
 */
@Entity({ name: 'cash_movements' })
@Unique('uq_cash_movements_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_cash_movements_session', ['tenantId', 'sessionId'])
export class CashMovement {
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
    name: 'amount_delta',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  amountDelta: string;

  @Column({ type: 'varchar', length: 30 })
  kind: CashMovementKind;

  @Column({ name: 'payment_id', type: 'uuid', nullable: true })
  paymentId: string | null;

  @Column({ name: 'credit_payment_id', type: 'uuid', nullable: true })
  creditPaymentId: string | null;

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
