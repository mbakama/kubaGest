import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';

/**
 * Ligne de ticket. Les libellés, le facteur et le prix sont figés au moment
 * de la vente : une modification ultérieure du catalogue ne réécrit pas
 * l'historique.
 */
@Entity({ name: 'sale_items' })
@Unique('uq_sale_items_scope', [
  'tenantId',
  'establishmentId',
  'saleId',
  'id',
])
@Unique('uq_sale_items_identity', ['tenantId', 'establishmentId', 'id'])
@Unique('uq_sale_items_line', ['saleId', 'lineNumber'])
@Index('idx_sale_items_sale', ['tenantId', 'saleId'])
export class SaleItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  saleId: string;

  @Column({ name: 'line_number', type: 'integer' })
  lineNumber: number;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'packaging_id', type: 'uuid' })
  packagingId: string;

  @Column({ name: 'sku_snapshot', type: 'varchar', length: 80 })
  skuSnapshot: string;

  @Column({ name: 'name_snapshot', type: 'varchar', length: 200 })
  nameSnapshot: string;

  @Column({ name: 'packaging_snapshot', type: 'varchar', length: 60 })
  packagingSnapshot: string;

  @Column({
    name: 'factor_snapshot',
    type: 'bigint',
    transformer: bigintNumber,
  })
  factorSnapshot: number;

  @Column({
    name: 'quantity_packages',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityPackages: number;

  @Column({
    name: 'quantity_base',
    type: 'bigint',
    transformer: bigintNumber,
  })
  quantityBase: number;

  @Column({
    name: 'unit_price',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  unitPrice: string;

  @Column({
    name: 'discount_amount',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  discountAmount: string;

  @Column({
    name: 'tax_rate',
    type: 'numeric',
    precision: 7,
    scale: 4,
    default: 0,
    transformer: numericString(4),
  })
  taxRate: string;

  @Column({
    name: 'tax_amount',
    type: 'numeric',
    precision: 20,
    scale: 6,
    default: 0,
    transformer: numericString(6),
  })
  taxAmount: string;

  @Column({
    name: 'net_amount',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  netAmount: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
