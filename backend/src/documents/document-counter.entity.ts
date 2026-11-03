import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';

/**
 * Compteur de numéros de documents (ticket, crédit), unique par commerce,
 * type et période. Incrémenté par comparaison-et-échange dans la transaction
 * de l'opération : jamais `MAX(number) + 1`.
 */
@Entity({ name: 'document_counters' })
@Index('uq_document_counters_scope', [
  'tenantId',
  'documentKind',
  'period',
], { unique: true })
export class DocumentCounter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'document_kind', type: 'varchar', length: 30 })
  documentKind: string;

  /** Période de remise à zéro, par exemple `2026-10` ou `ALL`. */
  @Column({ type: 'varchar', length: 10, default: 'ALL' })
  period: string;

  @Column({
    name: 'last_value',
    type: 'bigint',
    default: 0,
    transformer: bigintNumber,
  })
  lastValue: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
