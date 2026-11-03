import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { bigintNumber } from '../common/bigint.transformer.js';
import { numericString } from '../common/decimal.js';

/**
 * Conditionnement d'un article : pièce, plaquette, boîte, carton… (F09).
 * Toutes les conversions vont directement vers l'unité de base
 * (`factorToBase`) : aucune chaîne de conversions.
 *
 * Le service garantit exactement un conditionnement de base actif, avec un
 * facteur de 1 ; la base l'assure par index unique partiel sur `is_base`.
 */
@Entity({ name: 'product_packagings' })
@Unique('uq_product_packagings_scope', [
  'tenantId',
  'establishmentId',
  'productId',
  'id',
])
@Unique('uq_product_packagings_label', [
  'tenantId',
  'establishmentId',
  'productId',
  'label',
])
@Index('idx_product_packagings_tenant', [
  'tenantId',
  'establishmentId',
  'productId',
])
export class ProductPackaging {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'tenant_id', type: 'uuid' })
  tenantId: string;

  @Column({ name: 'establishment_id', type: 'uuid' })
  establishmentId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'varchar', length: 60 })
  label: string;

  @Column({
    name: 'factor_to_base',
    type: 'bigint',
    transformer: bigintNumber,
  })
  factorToBase: number;

  /** Prix de vente dans la devise de référence. */
  @Column({
    name: 'sale_price',
    type: 'numeric',
    precision: 20,
    scale: 6,
    transformer: numericString(6),
  })
  salePrice: string;

  @Column({ name: 'is_base', type: 'boolean', default: false })
  isBase: boolean;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
