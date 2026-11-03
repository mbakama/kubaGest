import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

/**
 * Historique du taux USD/CDF (F07, dictionnaire §4). Sens unique : 1 USD vaut
 * `cdfPerUsd` CDF. Les taux passés ne sont jamais écrasés ; chaque transaction
 * fige celui qu'elle a utilisé.
 */
@Entity({ name: 'exchange_rates' })
@Unique('uq_exchange_rates_scope', [
  'tenantId',
  'establishmentId',
  'effectiveAt',
])
@Index('idx_exchange_rates_tenant', ['tenantId', 'establishmentId'])
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'cdf_per_usd', type: 'numeric', precision: 20, scale: 10 })
  cdfPerUsd: string;

  @Column({ name: 'effective_at', type: Date })
  effectiveAt: Date;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
