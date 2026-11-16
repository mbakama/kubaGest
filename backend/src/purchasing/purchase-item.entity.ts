import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';

@Entity({ name: 'purchase_items' })
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'purchase_id', type: 'uuid' })
  purchaseId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({
    name: 'quantity_ordered',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityOrdered: number;

  @Column({
    name: 'unit_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  unitCost: string;

  @Column({
    name: 'total_cost',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  totalCost: string;
}
