import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { numericString } from '../common/decimal.js';
import { PurchaseCurrency, PurchaseStatus } from './purchasing.enums.js';

@Entity({ name: 'purchases' })
@Unique('uq_purchases_scope', ['tenantId', 'id'])
@Unique('uq_purchases_reference', ['tenantId', 'reference'])
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'supplier_id', type: 'uuid' })
  supplierId: string;

  @Column({ name: 'destination_warehouse_id', type: 'uuid' })
  destinationWarehouseId: string;

  @Column({ type: 'varchar', length: 60 })
  reference: string;

  @Column({ type: 'varchar', length: 24, default: PurchaseStatus.DRAFT })
  status: PurchaseStatus;

  @Column({ type: 'varchar', length: 3 })
  currency: PurchaseCurrency;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  totalAmount: string;

  @Column({ name: 'created_by', type: 'uuid' })
  createdByMembershipId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
