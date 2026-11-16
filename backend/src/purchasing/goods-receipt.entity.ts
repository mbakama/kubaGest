import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { GoodsReceiptStatus } from './purchasing.enums.js';

@Entity({ name: 'goods_receipts' })
@Unique('uq_goods_receipts_scope', ['tenantId', 'id'])
@Unique('uq_goods_receipts_reference', ['tenantId', 'reference'])
export class GoodsReceipt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'purchase_id', type: 'uuid' })
  purchaseId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ type: 'varchar', length: 60 })
  reference: string;

  @Column({ type: 'varchar', length: 20, default: GoodsReceiptStatus.DRAFT })
  status: GoodsReceiptStatus;

  @Column({ name: 'received_by', type: 'uuid', nullable: true })
  receivedByMembershipId: string | null;

  @Column({ name: 'received_at', type: Date, nullable: true })
  receivedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
