import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Complément médicament (F08) : le nom commercial reste `products.name`.
 * Aucune ordonnance ni donnée patient n'est stockée (§11).
 */
@Entity({ name: 'drug_details' })
@Unique('uq_drug_details_scope', ['tenantId', 'establishmentId', 'productId'])
export class DrugDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'active_ingredient', type: 'varchar', length: 200 })
  activeIngredient: string;

  @Column({ type: 'varchar', length: 100 })
  strength: string;

  @Column({ name: 'dosage_form', type: 'varchar', length: 100 })
  dosageForm: string;

  @Column({
    name: 'prescription_required',
    type: 'boolean',
    nullable: true,
  })
  prescriptionRequired: boolean | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
