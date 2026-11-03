import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum CashSessionStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}

/**
 * Session de caisse d'un caissier sur un poste.
 *
 * Une vente en espèces exige une session ouverte. Après clôture, la session
 * ne reçoit plus d'écriture : une correction passe par une nouvelle session.
 */
@Entity({ name: 'cash_sessions' })
@Unique('uq_cash_sessions_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_cash_sessions_status', ['tenantId', 'establishmentId', 'status'])
@Index('uq_cash_sessions_open_register', [
  'tenantId',
  'establishmentId',
  'registerId',
], { unique: true, where: `"status" = 'open'` })
@Index('uq_cash_sessions_open_cashier', [
  'tenantId',
  'establishmentId',
  'cashierId',
], { unique: true, where: `"status" = 'open'` })
export class CashSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'register_id', type: 'uuid' })
  registerId: string;

  /** Rattaché à un compte utilisateur, comme le MVP l'a fait jusqu'ici. */
  @Column({ name: 'cashier_id', type: 'uuid' })
  cashierId: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: CashSessionStatus.OPEN,
  })
  status: CashSessionStatus;

  @Column({ name: 'opened_by', type: 'uuid' })
  openedBy: string;

  @Column({
    name: 'opened_at',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  openedAt: Date;

  @Column({ name: 'closed_by', type: 'uuid', nullable: true })
  closedBy: string | null;

  @Column({ name: 'closed_at', type: Date, nullable: true })
  closedAt: Date | null;

  @Column({ name: 'closing_reason', type: 'text', nullable: true })
  closingReason: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
