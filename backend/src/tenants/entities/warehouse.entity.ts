import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum WarehouseKind {
  CENTRAL = 'central',
  SECONDARY = 'secondary',
}

@Entity({ name: 'warehouses' })
@Unique('uq_warehouses_scope', ['tenantId', 'id'])
@Index('uq_warehouses_tenant_code', ['tenantId', 'code'], { unique: true })
@Index('idx_warehouses_establishment', ['tenantId', 'establishmentId'])
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid', nullable: true })
  establishmentId: string | null;

  @Column({ type: 'varchar', length: 40 })
  code: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  kind: WarehouseKind;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
