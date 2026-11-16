import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Retire les structures de compatibilité catalogue/stock après la fondation V1.
 * Exécutée comme étape séparée pour les bases déjà passées par les migrations
 * incrémentales ; incluse aussi dans la baseline V1 pour les bases vierges.
 */
export class V1ModelCleanup1800005000000 implements MigrationInterface {
  name = 'V1ModelCleanup1800005000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Détacher la table legacy "products" avant de modifier les catégories.
      ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "fk_products_category";
      ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "fk_products_establishment";
      ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "fk_products_tenant";
      ALTER TABLE "sale_items" DROP CONSTRAINT IF EXISTS "fk_sale_items_packaging";
      ALTER TABLE "sale_items" DROP CONSTRAINT IF EXISTS "fk_sale_items_product";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_sale_item";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_product";
      ALTER TABLE "stock_balances" DROP CONSTRAINT IF EXISTS "fk_stock_balances_product";
      ALTER TABLE "product_barcodes" DROP CONSTRAINT IF EXISTS "fk_product_barcodes_packaging";
      ALTER TABLE "product_barcodes" DROP CONSTRAINT IF EXISTS "fk_product_barcodes_product";
      ALTER TABLE "product_packagings" DROP CONSTRAINT IF EXISTS "fk_product_packagings_product";
      ALTER TABLE "drug_details" DROP CONSTRAINT IF EXISTS "fk_drug_details_product";

      -- Catégories tenant-scoped, sans rattachement obligatoire à un magasin.
      DROP INDEX IF EXISTS "uq_product_categories_name";
      DROP INDEX IF EXISTS "idx_product_categories_tenant";
      ALTER TABLE "product_categories"
        DROP CONSTRAINT IF EXISTS "fk_product_categories_establishment";
      ALTER TABLE "product_categories"
        DROP CONSTRAINT IF EXISTS "uq_product_categories_scope";
      ALTER TABLE "product_categories" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "product_categories"
        DROP CONSTRAINT IF EXISTS "uq_product_categories_name";
      ALTER TABLE "product_categories"
        ADD CONSTRAINT "uq_product_categories_name"
        UNIQUE ("tenant_id", "name");

      -- Le produit physique devient l'unique produit de catalogue.
      ALTER TABLE "physical_products" DROP CONSTRAINT IF EXISTS "uq_physical_products_legacy";
      ALTER TABLE "physical_products" DROP COLUMN IF EXISTS "legacy_product_id";
      ALTER TABLE "establishment_products" DROP CONSTRAINT IF EXISTS "uq_establishment_products_legacy";
      ALTER TABLE "establishment_products" DROP COLUMN IF EXISTS "legacy_product_id";
      ALTER TABLE "establishment_products" ADD COLUMN IF NOT EXISTS "category_id" uuid NULL;
      ALTER TABLE "establishment_products" ADD COLUMN IF NOT EXISTS "local_name" varchar(200) NULL;
      ALTER TABLE "establishment_products" ADD COLUMN IF NOT EXISTS "reorder_level" bigint NOT NULL DEFAULT 0;
      ALTER TABLE "establishment_products" ADD COLUMN IF NOT EXISTS "allocation_policy" varchar(10) NOT NULL DEFAULT 'fifo';
      ALTER TABLE "establishment_products" ADD COLUMN IF NOT EXISTS "tax_rate" numeric(7,4) NOT NULL DEFAULT 0;
      ALTER TABLE "establishment_products"
        DROP CONSTRAINT IF EXISTS "fk_establishment_products_category";
      ALTER TABLE "establishment_products"
        ADD CONSTRAINT "fk_establishment_products_category"
        FOREIGN KEY ("tenant_id", "category_id")
        REFERENCES "product_categories" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "establishment_products"
        DROP CONSTRAINT IF EXISTS "chk_establishment_products_allocation";
      ALTER TABLE "establishment_products"
        ADD CONSTRAINT "chk_establishment_products_allocation"
        CHECK ("allocation_policy" IN ('fifo','fefo'));

      -- Conditionnements partagés, sans prix ni portée établissement.
      DROP INDEX IF EXISTS "uq_product_packagings_base";
      DROP INDEX IF EXISTS "idx_product_packagings_tenant";
      ALTER TABLE "product_barcodes" DROP CONSTRAINT IF EXISTS "fk_product_barcodes_packaging";
      ALTER TABLE "product_packagings" DROP CONSTRAINT IF EXISTS "fk_product_packagings_product";
      ALTER TABLE "product_packagings" DROP CONSTRAINT IF EXISTS "uq_product_packagings_scope";
      ALTER TABLE "product_packagings" DROP CONSTRAINT IF EXISTS "uq_product_packagings_label";
      ALTER TABLE "product_packagings" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "product_packagings" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "product_packagings" DROP COLUMN IF EXISTS "sale_price";
      ALTER TABLE "product_packagings" ALTER COLUMN "physical_product_id" SET NOT NULL;
      ALTER TABLE "product_packagings"
        DROP CONSTRAINT IF EXISTS "uq_product_packagings_name";
      ALTER TABLE "product_packagings"
        ADD CONSTRAINT "uq_product_packagings_name"
        UNIQUE ("tenant_id", "physical_product_id", "label");
      CREATE UNIQUE INDEX IF NOT EXISTS "uq_product_packagings_base"
        ON "product_packagings" ("tenant_id", "physical_product_id")
        WHERE "is_base" AND "is_active";

      -- Codes-barres et médicaments référencent seulement le produit physique.
      DROP INDEX IF EXISTS "idx_product_barcodes_product";
      ALTER TABLE "product_barcodes" DROP CONSTRAINT IF EXISTS "fk_product_barcodes_product";
      ALTER TABLE "product_barcodes" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "product_barcodes" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "product_barcodes" ALTER COLUMN "physical_product_id" SET NOT NULL;
      ALTER TABLE "product_barcodes"
        DROP CONSTRAINT IF EXISTS "fk_product_barcodes_packaging_v1";
      ALTER TABLE "product_barcodes"
        ADD CONSTRAINT "fk_product_barcodes_packaging_v1"
        FOREIGN KEY ("tenant_id", "physical_product_id", "packaging_id")
        REFERENCES "product_packagings" ("tenant_id", "physical_product_id", "id")
        ON DELETE RESTRICT;

      ALTER TABLE "drug_details" DROP CONSTRAINT IF EXISTS "fk_drug_details_product";
      ALTER TABLE "drug_details" DROP CONSTRAINT IF EXISTS "uq_drug_details_scope";
      ALTER TABLE "drug_details" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "drug_details" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "drug_details" ALTER COLUMN "physical_product_id" SET NOT NULL;
      ALTER TABLE "drug_details"
        DROP CONSTRAINT IF EXISTS "uq_drug_details_product";
      ALTER TABLE "drug_details"
        ADD CONSTRAINT "uq_drug_details_product"
        UNIQUE ("tenant_id", "physical_product_id");

      -- Stock exclusivement par entrepôt et produit physique.
      DROP INDEX IF EXISTS "idx_stock_balances_tenant";
      ALTER TABLE "stock_balances" DROP CONSTRAINT IF EXISTS "fk_stock_balances_product";
      ALTER TABLE "stock_balances" DROP CONSTRAINT IF EXISTS "uq_stock_balances_scope";
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "stock_balances" ALTER COLUMN "warehouse_id" SET NOT NULL;
      ALTER TABLE "stock_balances" ALTER COLUMN "physical_product_id" SET NOT NULL;

      DROP INDEX IF EXISTS "idx_stock_movements_product";
      DROP INDEX IF EXISTS "idx_stock_movements_sale";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_sale_item";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_product";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "uq_stock_movements_scope";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "establishment_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "sale_item_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "reference";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "actor_id";
      ALTER TABLE "stock_movements" ALTER COLUMN "warehouse_id" SET NOT NULL;
      ALTER TABLE "stock_movements" ALTER COLUMN "physical_product_id" SET NOT NULL;

      -- Lignes de vente sur produit physique et coût snapshot.
      ALTER TABLE "sale_items" DROP CONSTRAINT IF EXISTS "fk_sale_items_packaging";
      ALTER TABLE "sale_items" DROP CONSTRAINT IF EXISTS "fk_sale_items_product";
      ALTER TABLE "sale_items" DROP COLUMN IF EXISTS "product_id";
      ALTER TABLE "sale_items" ALTER COLUMN "physical_product_id" SET NOT NULL;
      ALTER TABLE "sale_items" ALTER COLUMN "unit_cost" SET DEFAULT 0;
      UPDATE "sale_items" SET "unit_cost" = 0 WHERE "unit_cost" IS NULL;
      ALTER TABLE "sale_items" ALTER COLUMN "unit_cost" SET NOT NULL;
      ALTER TABLE "sale_items"
        DROP CONSTRAINT IF EXISTS "fk_sale_items_packaging_v1";
      ALTER TABLE "sale_items"
        ADD CONSTRAINT "fk_sale_items_packaging_v1"
        FOREIGN KEY ("tenant_id", "physical_product_id", "packaging_id")
        REFERENCES "product_packagings" ("tenant_id", "physical_product_id", "id")
        ON DELETE RESTRICT;

      ALTER TABLE "sales" ALTER COLUMN "warehouse_id" SET NOT NULL;

      DROP TABLE IF EXISTS "products";
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    void queryRunner;
    // Nettoyage unidirectionnel : pas de restauration des tables legacy.
  }
}
