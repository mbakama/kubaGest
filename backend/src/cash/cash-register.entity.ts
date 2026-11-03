import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/** Caisse du point de vente : le poste, distinct de la session du caissier. */
@Entity({ name: 'cash_registers' })
@Unique('uq_cash_registers_scope', ['tenantId', 'establishmentId', 'id'])
@Unique('uq_cash_registers_name', ['tenantId', 'establishmentId', 'name'])
@Index('idx_cash_registers_tenant', ['tenantId', 'establishmentId'])
export class CashRegister {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
