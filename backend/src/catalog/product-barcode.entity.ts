import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * Code-barres d'un conditionnement (F02). Un code identifie un seul
 * conditionnement dans le commerce ; plusieurs codes peuvent identifier le
 * même conditionnement. Stocké en texte pour conserver les zéros initiaux.
 */
@Entity({ name: 'product_barcodes' })
@Index('idx_product_barcodes_tenant', ['tenantId', 'code'], { unique: true })
@Index('idx_product_barcodes_product', ['tenantId', 'physicalProductId'])
export class ProductBarcode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'physical_product_id', type: 'uuid' })
  physicalProductId: string;

  @Column({ name: 'packaging_id', type: 'uuid' })
  packagingId: string;

  @Column({ type: 'varchar', length: 100 })
  code: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
