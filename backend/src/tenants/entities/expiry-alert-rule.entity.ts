import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Seuils d'alerte de péremption par établissement (F14). J-90/J-60/J-30 sont
 * des valeurs initiales modifiables.
 */
@Entity({ name: 'expiry_alert_rules' })
@Unique('uq_expiry_alert_rules_scope', [
  'tenantId',
  'establishmentId',
  'daysBefore',
])
@Index('idx_expiry_alert_rules_tenant', ['tenantId', 'establishmentId'])
export class ExpiryAlertRule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'days_before', type: 'integer' })
  daysBefore: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
