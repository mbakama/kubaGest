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

export enum CreditStatus {
  OPEN = 'open',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

/**
 * Vente laissée à crédit.
 *
 * Le document porte le montant dû et le montant déjà réglé ; les règlements
 * sont des lignes séparées. Une vente soldée passe à `paid`, une annulation à
 * `cancelled` sans effacer la trace.
 */
@Entity({ name: 'credit_sales' })
@Unique('uq_credit_sales_scope', ['tenantId', 'establishmentId', 'id'])
@Unique('uq_credit_sales_number', ['tenantId', 'number'])
@Index('idx_credit_sales_customer', [
  'tenantId',
  'establishmentId',
  'customerId',
])
@Index('idx_credit_sales_status', ['tenantId', 'establishmentId', 'status'])
export class CreditSale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  /** Ticket d'origine, quand la dette vient du comptoir. */
  @Column({ name: 'sale_id', type: 'uuid', nullable: true })
  saleId: string | null;

  /** Numéro lisible du carnet, unique par commerce. */
  @Column({ type: 'varchar', length: 40 })
  number: string;

  /** Ce que le client doit sur cette vente, à la création. */
  @Column({
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  total: string;

  @Column({
    name: 'paid_total',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  paidTotal: string;

  /** Échéance convenue, `NULL` si le commerce n'en fixe pas. */
  @Column({ name: 'due_date', type: 'date', nullable: true })
  dueDate: string | null;

  @Column({ type: 'varchar', length: 16, default: CreditStatus.OPEN })
  status: CreditStatus;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
