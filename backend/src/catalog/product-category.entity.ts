import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Catégorie d'articles (F02, dictionnaire §4). Le nom est unique par
 * établissement après normalisation (index `lower(name)`).
 */
@Entity({ name: 'product_categories' })
@Unique('uq_product_categories_scope', [
  'tenantId',
  'establishmentId',
  'id',
])
@Index('idx_product_categories_tenant', ['tenantId', 'establishmentId'])
export class ProductCategory {
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
