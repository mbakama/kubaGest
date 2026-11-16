import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { numericString } from '../common/decimal.js';

@Entity({ name: 'product_prices' })
@Index('idx_product_prices_lookup', [
  'tenantId',
  'establishmentId',
  'physicalProductId',
  'packagingId',
])
export class ProductPrice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({ name: 'packaging_id', type: 'uuid' })
  packagingId: string;

  @Column({
    name: 'sale_price',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  salePrice: string;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({
    name: 'valid_from',
    type: Date,
    default: () => 'CURRENT_TIMESTAMP',
  })
  validFrom: Date;

  @Column({ name: 'valid_to', type: Date, nullable: true })
  validTo: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
