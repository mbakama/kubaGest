import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/** Convention de péremption d'un point de vente. */
export enum ExpiryBoundary {
  START_OF_DAY = 'start_of_day',
  END_OF_DAY = 'end_of_day',
}

/**
 * Configuration typée d'un point de vente (F07, dictionnaire §4).
 * Aucun paramétrage libre ne peut désactiver le blocage des lots périmés ni
 * la FEFO obligatoire en pharmacie.
 */
@Entity({ name: 'establishment_settings' })
@Unique('uq_establishment_settings_scope', ['tenantId', 'establishmentId'])
@Index('idx_establishment_settings_tenant', ['tenantId'])
export class EstablishmentSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({
    name: 'max_discount_percent',
    type: 'numeric',
    precision: 5,
    scale: 2,
    default: 0,
  })
  maxDiscountPercent: string;

  @Column({
    name: 'payment_tolerance',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
  })
  paymentTolerance: string;

  /**
   * Convention de péremption. `start_of_day` correspond au cahier des charges
   * (§23 : lot non vendable à partir de 00h00, date de péremption incluse).
   */
  @Column({
    name: 'expiry_boundary',
    type: 'varchar',
    length: 20,
    default: 'start_of_day',
  })
  expiryBoundary: ExpiryBoundary;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
