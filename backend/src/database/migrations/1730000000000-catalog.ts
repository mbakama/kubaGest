import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lot 2 du dictionnaire `docs/database/SCHEMA.md` (§10) : catalogue,
 * médicaments, conditionnements et codes-barres.
 *
 * Les clés candidates `(tenant_id, establishment_id, …)` sont posées dès la
 * création, afin que les FK composites des lots suivants puissent les cibler
 * sans reprise de données.
 */
export class Catalog1730000000000 implements MigrationInterface {
  name = 'Catalog1730000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // --- product_categories ------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "product_categories" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_product_categories_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "fk_product_categories_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_product_categories_name"
        ON "product_categories" (
          "tenant_id", "establishment_id", lower("name")
        )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_product_categories_tenant"
        ON "product_categories" ("tenant_id", "establishment_id")
    `);

    // --- products ----------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "category_id" uuid NULL,
        "sku" varchar(80) NOT NULL,
        "name" varchar(200) NOT NULL,
        "base_unit" varchar(30) NOT NULL,
        "reorder_level" bigint NOT NULL DEFAULT 0,
        "tracking_mode" varchar(20) NOT NULL DEFAULT 'none',
        "allocation_policy" varchar(10) NOT NULL DEFAULT 'fifo',
        "tax_rate" numeric(7,4) NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_products_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_products_sku" UNIQUE ("tenant_id", "sku"),
        CONSTRAINT "chk_products_reorder_level" CHECK ("reorder_level" >= 0),
        CONSTRAINT "chk_products_tracking_mode"
          CHECK ("tracking_mode" IN ('none','batch','batch_expiry')),
        CONSTRAINT "chk_products_allocation_policy"
          CHECK ("allocation_policy" IN ('fifo','fefo')),
        CONSTRAINT "chk_products_tax_rate"
          CHECK ("tax_rate" >= 0 AND "tax_rate" <= 100),
        CONSTRAINT "fk_products_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_products_category"
          FOREIGN KEY ("tenant_id", "establishment_id", "category_id")
          REFERENCES "product_categories"
            ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_products_tenant"
        ON "products" ("tenant_id", "establishment_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_products_category"
        ON "products" ("tenant_id", "establishment_id", "category_id")
    `);

    // --- drug_details ------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "drug_details" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "active_ingredient" varchar(200) NOT NULL,
        "strength" varchar(100) NOT NULL,
        "dosage_form" varchar(100) NOT NULL,
        "prescription_required" boolean NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_drug_details_scope"
          UNIQUE ("tenant_id", "establishment_id", "product_id"),
        CONSTRAINT "fk_drug_details_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);

    // --- product_packagings ------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "product_packagings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "label" varchar(60) NOT NULL,
        "factor_to_base" bigint NOT NULL,
        "sale_price" numeric(20,6) NOT NULL,
        "is_base" boolean NOT NULL DEFAULT false,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_product_packagings_scope"
          UNIQUE ("tenant_id", "establishment_id", "product_id", "id"),
        CONSTRAINT "uq_product_packagings_label"
          UNIQUE ("tenant_id", "establishment_id", "product_id", "label"),
        CONSTRAINT "chk_product_packagings_factor"
          CHECK ("factor_to_base" > 0),
        CONSTRAINT "chk_product_packagings_price"
          CHECK ("sale_price" >= 0),
        CONSTRAINT "chk_product_packagings_base_factor"
          CHECK (NOT "is_base" OR "factor_to_base" = 1),
        CONSTRAINT "fk_product_packagings_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    // Au plus un conditionnement de base par article.
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_product_packagings_base"
        ON "product_packagings"
          ("tenant_id", "establishment_id", "product_id")
        WHERE "is_base"
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_product_packagings_tenant"
        ON "product_packagings"
          ("tenant_id", "establishment_id", "product_id")
    `);

    // --- product_barcodes --------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "product_barcodes" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "packaging_id" uuid NOT NULL,
        "code" varchar(100) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_product_barcodes_code" UNIQUE ("tenant_id", "code"),
        CONSTRAINT "fk_product_barcodes_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT,
        CONSTRAINT "fk_product_barcodes_packaging"
          FOREIGN KEY (
            "tenant_id", "establishment_id", "product_id", "packaging_id"
          )
          REFERENCES "product_packagings"
            ("tenant_id", "establishment_id", "product_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_product_barcodes_product"
        ON "product_barcodes" ("tenant_id", "establishment_id", "product_id")
    `);

    // --- updated_at garanti par trigger (convention U) ---------------------
    await queryRunner.query(`
      DO $$
      DECLARE
        target text;
      BEGIN
        FOREACH target IN ARRAY ARRAY[
          'product_categories','products','drug_details','product_packagings'
        ]
        LOOP
          EXECUTE format(
            'CREATE TRIGGER %I BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at()',
            'trg_' || target || '_updated_at', target
          );
        END LOOP;
      END;
      $$
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        target text;
      BEGIN
        FOREACH target IN ARRAY ARRAY[
          'product_categories','products','drug_details','product_packagings'
        ]
        LOOP
          EXECUTE format(
            'DROP TRIGGER IF EXISTS %I ON %I',
            'trg_' || target || '_updated_at', target
          );
        END LOOP;
      END;
      $$
    `);

    await queryRunner.query(`DROP TABLE "product_barcodes"`);
    await queryRunner.query(`DROP TABLE "product_packagings"`);
    await queryRunner.query(`DROP TABLE "drug_details"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "product_categories"`);
  }
}
