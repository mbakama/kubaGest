import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';

@Entity({ name: 'goods_receipt_items' })
export class GoodsReceiptItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'goods_receipt_id', type: 'uuid' })
  goodsReceiptId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({
    name: 'quantity_received',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityReceived: number;

  @Column({
    name: 'unit_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  unitCost: string;

  @Column({ name: 'batch_id', type: 'uuid', nullable: true })
  batchId: string | null;
}
