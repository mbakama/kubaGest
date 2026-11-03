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

/**
 * Client du comptoir, identifié pour le crédit.
 *
 * Aucune donnée médicale ni ordonnance n'est conservée : seul le nom, le
 * téléphone et le plafond d'encours servent au carnet de crédit.
 */
@Entity({ name: 'customers' })
@Unique('uq_customers_scope', ['tenantId', 'establishmentId', 'id'])
@Index('idx_customers_tenant', ['tenantId', 'establishmentId'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ type: 'varchar', length: 160 })
  name: string;

  /** Format E.164, facultatif. */
  @Column({ type: 'varchar', length: 32, nullable: true })
  phone: string | null;

  /**
   * Plafond d'encours autorisé. `0` signifie que le crédit n'est pas ouvert
   * pour ce client.
   */
  @Column({
    name: 'credit_limit',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  creditLimit: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  note: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
