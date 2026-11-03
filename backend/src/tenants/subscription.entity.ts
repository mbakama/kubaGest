import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Plan } from './plan.entity.js';
import { TenantStatus } from './tenant.enums.js';

/**
 * Période d'abonnement d'un tenant (F07, dictionnaire §3). La formule est
 * référencée par `plan_id` : le prix et le statut ne sont jamais déduits d'un
 * champ libre sur le tenant.
 *
 * `starts_at`/`ends_at` portent les périodes ; un chevauchement par tenant est
 * exclu en base PostgreSQL (contrainte d'exclusion GiST).
 */
@Entity({ name: 'subscriptions' })
@Index('idx_subscriptions_tenant', ['tenantId'])
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'plan_id', type: 'uuid' })
  planId: string;

  /** Formule contractuelle ; chargée avec l'abonnement. */
  @ManyToOne(() => Plan, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'plan_id' })
  plan: Plan;

  @Column({ type: 'varchar', length: 20, default: TenantStatus.TRIAL })
  status: TenantStatus;

  @CreateDateColumn({ name: 'starts_at' })
  startsAt: Date;

  /**
   * Fin de période ; nulle tant qu'aucune échéance n'est contractée.
   * `type: Date` laisse chaque pilote choisir son type natif (SQLite en
   * développement, PostgreSQL en production, colonne `timestamptz`).
   */
  @Column({ name: 'ends_at', type: Date, nullable: true })
  endsAt: Date | null;

  /** Prix contractuel figé pour la période (facultatif). */
  @Column({
    name: 'agreed_price',
    type: 'numeric',
    precision: 20,
    scale: 6,
    nullable: true,
  })
  agreedPrice: string | null;

  @Column({ type: 'varchar', length: 3, default: 'CDF' })
  currency: string;

  @Column({ name: 'employee_limit', type: 'integer', nullable: true })
  employeeLimit: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
