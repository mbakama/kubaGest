import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

export enum CreditReminderStatus {
  SENT = 'sent',
  FAILED = 'failed',
}

/**
 * Trace d'une relance de crédit échue.
 *
 * Une relance n'est pas un document comptable : elle rappelle une dette
 * existante. Le statut et le message sont conservés pour éviter de relancer
 * deux fois de suite le même client.
 */
@Entity({ name: 'credit_reminders' })
@Unique('uq_credit_reminders_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_credit_reminders_credit', ['tenantId', 'creditId', 'sentAt'])
export class CreditReminder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'credit_id', type: 'uuid' })
  creditId: string;

  @Column({ type: 'varchar', length: 20, default: 'sms' })
  channel: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: CreditReminderStatus.SENT,
  })
  status: CreditReminderStatus;

  @Column({ type: 'varchar', length: 32, nullable: true })
  recipient: string | null;

  @Column({ type: 'text' })
  message: string;

  @Column({ name: 'sent_at', type: Date, default: () => 'CURRENT_TIMESTAMP' })
  sentAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
