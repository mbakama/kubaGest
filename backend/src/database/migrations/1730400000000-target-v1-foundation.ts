import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Fondation additive du MLD cible V1.1.
 *
 * Cette migration conserve les tables et identifiants historiques. Les
 * colonnes de transition ajoutées aux ventes et au stock restent nullable
 * tant que les services n'écrivent pas encore systématiquement le nouveau
 * contexte entrepôt/produit physique.
 */
export class TargetV1Foundation1730400000000 implements MigrationInterface {
  name = 'TargetV1Foundation1730400000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "tenants" ADD COLUMN "slug" varchar(160) NULL;
      CREATE UNIQUE INDEX "uq_tenants_slug" ON "tenants" (lower("slug"))
        WHERE "slug" IS NOT NULL;

      ALTER TABLE "establishments" ADD COLUMN "code" varchar(40) NULL;
      ALTER TABLE "establishments" ADD COLUMN "phone" varchar(30) NULL;
      ALTER TABLE "establishments" ADD COLUMN "email" varchar(255) NULL;
      UPDATE "establishments"
        SET "code" = 'EST-' || upper(substr(replace("id"::text, '-', ''), 1, 8))
        WHERE "code" IS NULL;
      ALTER TABLE "establishments" ALTER COLUMN "code" SET NOT NULL;
      ALTER TABLE "establishments"
        DROP CONSTRAINT IF EXISTS "uq_establishments_tenant";
      CREATE UNIQUE INDEX "uq_establishments_tenant_code"
        ON "establishments" ("tenant_id", lower("code"));

      CREATE TABLE "warehouses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NULL,
        "code" varchar(40) NOT NULL,
        "name" varchar(150) NOT NULL,
        "kind" varchar(20) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_warehouses_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "chk_warehouses_kind" CHECK ("kind" IN ('central','secondary')),
        CONSTRAINT "chk_warehouses_owner" CHECK (
          ("kind" = 'central' AND "establishment_id" IS NULL) OR
          ("kind" = 'secondary' AND "establishment_id" IS NOT NULL)
        ),
        CONSTRAINT "fk_warehouses_tenant" FOREIGN KEY ("tenant_id")
          REFERENCES "tenants" ("id") ON DELETE RESTRICT,
        CONSTRAINT "fk_warehouses_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      );
      CREATE UNIQUE INDEX "uq_warehouses_tenant_code"
        ON "warehouses" ("tenant_id", lower("code"));
      CREATE UNIQUE INDEX "uq_warehouses_one_central"
        ON "warehouses" ("tenant_id")
        WHERE "kind" = 'central' AND "is_active";
      CREATE INDEX "idx_warehouses_establishment"
        ON "warehouses" ("tenant_id", "establishment_id");

      INSERT INTO "warehouses" ("tenant_id", "code", "name", "kind")
      SELECT "id", 'CENTRAL', 'Entrepôt central', 'central' FROM "tenants";
      INSERT INTO "warehouses"
        ("tenant_id", "establishment_id", "code", "name", "kind")
      SELECT "tenant_id", "id", 'EST-' || upper(substr(replace("id"::text, '-', ''), 1, 8)),
             'Entrepôt principal - ' || "name", 'secondary'
      FROM "establishments";

      CREATE TABLE "membership_warehouses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "membership_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_membership_warehouses"
          UNIQUE ("tenant_id", "membership_id", "warehouse_id"),
        CONSTRAINT "fk_membership_warehouses_membership"
          FOREIGN KEY ("tenant_id", "membership_id")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_membership_warehouses_warehouse"
          FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "physical_products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "legacy_product_id" uuid NULL,
        "sku" varchar(80) NOT NULL,
        "name" varchar(200) NOT NULL,
        "description" text NULL,
        "base_unit" varchar(30) NOT NULL,
        "tracking_mode" varchar(20) NOT NULL DEFAULT 'none',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_physical_products_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_physical_products_sku" UNIQUE ("tenant_id", "sku"),
        CONSTRAINT "uq_physical_products_legacy" UNIQUE ("legacy_product_id"),
        CONSTRAINT "chk_physical_products_tracking"
          CHECK ("tracking_mode" IN ('none','batch','batch_expiry')),
        CONSTRAINT "fk_physical_products_tenant" FOREIGN KEY ("tenant_id")
          REFERENCES "tenants" ("id") ON DELETE RESTRICT
      );
      INSERT INTO "physical_products"
        ("tenant_id", "legacy_product_id", "sku", "name", "base_unit",
         "tracking_mode", "is_active", "created_at", "updated_at")
      SELECT "tenant_id", "id", "sku", "name", "base_unit",
             "tracking_mode", "is_active", "created_at", "updated_at"
      FROM "products";

      CREATE TABLE "establishment_products" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "legacy_product_id" uuid NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_establishment_products_scope"
          UNIQUE ("tenant_id", "establishment_id", "physical_product_id"),
        CONSTRAINT "uq_establishment_products_legacy" UNIQUE ("legacy_product_id"),
        CONSTRAINT "fk_establishment_products_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_establishment_products_product"
          FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );
      INSERT INTO "establishment_products"
        ("tenant_id", "establishment_id", "physical_product_id",
         "legacy_product_id", "is_active", "created_at", "updated_at")
      SELECT p."tenant_id", p."establishment_id", pp."id", p."id",
             p."is_active", p."created_at", p."updated_at"
      FROM "products" p
      JOIN "physical_products" pp ON pp."legacy_product_id" = p."id";

      ALTER TABLE "product_categories"
        ALTER COLUMN "establishment_id" DROP NOT NULL;
      ALTER TABLE "product_categories" ADD COLUMN "parent_id" uuid NULL;
      ALTER TABLE "product_categories"
        ADD CONSTRAINT "uq_product_categories_tenant_id" UNIQUE ("tenant_id", "id");
      ALTER TABLE "product_categories"
        ADD CONSTRAINT "fk_product_categories_parent"
        FOREIGN KEY ("tenant_id", "parent_id")
        REFERENCES "product_categories" ("tenant_id", "id") ON DELETE RESTRICT;

      ALTER TABLE "product_packagings"
        ADD COLUMN "physical_product_id" uuid NULL;
      UPDATE "product_packagings" p
        SET "physical_product_id" = pp."id"
      FROM "physical_products" pp
      WHERE pp."legacy_product_id" = p."product_id";
      ALTER TABLE "product_packagings"
        ADD CONSTRAINT "fk_product_packagings_physical_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "product_packagings"
        ADD CONSTRAINT "uq_product_packagings_physical_scope"
        UNIQUE ("tenant_id", "physical_product_id", "id");

      ALTER TABLE "product_barcodes"
        ADD COLUMN "physical_product_id" uuid NULL;
      UPDATE "product_barcodes" b
        SET "physical_product_id" = pp."id"
      FROM "physical_products" pp
      WHERE pp."legacy_product_id" = b."product_id";
      ALTER TABLE "product_barcodes"
        ADD CONSTRAINT "fk_product_barcodes_physical_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;

      ALTER TABLE "drug_details"
        ADD COLUMN "physical_product_id" uuid NULL;
      UPDATE "drug_details" d
        SET "physical_product_id" = pp."id"
      FROM "physical_products" pp
      WHERE pp."legacy_product_id" = d."product_id";
      ALTER TABLE "drug_details"
        ADD CONSTRAINT "fk_drug_details_physical_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;

      CREATE TABLE "product_prices" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "packaging_id" uuid NOT NULL,
        "sale_price" numeric(20,6) NOT NULL,
        "currency" varchar(3) NOT NULL,
        "valid_from" timestamptz NOT NULL DEFAULT now(),
        "valid_to" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_product_prices_amount" CHECK ("sale_price" >= 0),
        CONSTRAINT "chk_product_prices_currency" CHECK ("currency" IN ('USD','CDF')),
        CONSTRAINT "chk_product_prices_period" CHECK ("valid_to" IS NULL OR "valid_to" > "valid_from"),
        CONSTRAINT "fk_product_prices_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_product_prices_packaging"
          FOREIGN KEY ("tenant_id", "physical_product_id", "packaging_id")
          REFERENCES "product_packagings"
            ("tenant_id", "physical_product_id", "id") ON DELETE RESTRICT
      );
      CREATE UNIQUE INDEX "uq_product_prices_current"
        ON "product_prices"
          ("tenant_id", "establishment_id", "physical_product_id", "packaging_id")
        WHERE "valid_to" IS NULL;
      INSERT INTO "product_prices"
        ("tenant_id", "establishment_id", "physical_product_id", "packaging_id",
         "sale_price", "currency", "valid_from")
      SELECT p."tenant_id", p."establishment_id", pp."id", p."id",
             p."sale_price", t."currency", p."created_at"
      FROM "product_packagings" p
      JOIN "physical_products" pp ON pp."legacy_product_id" = p."product_id"
      JOIN "tenants" t ON t."id" = p."tenant_id";

      CREATE TABLE "suppliers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "name" varchar(180) NOT NULL,
        "phone" varchar(30) NULL,
        "email" varchar(255) NULL,
        "address" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_suppliers_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "fk_suppliers_tenant" FOREIGN KEY ("tenant_id")
          REFERENCES "tenants" ("id") ON DELETE RESTRICT
      );

      CREATE TABLE "purchases" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "supplier_id" uuid NOT NULL,
        "destination_warehouse_id" uuid NOT NULL,
        "reference" varchar(60) NOT NULL,
        "status" varchar(24) NOT NULL DEFAULT 'draft',
        "currency" varchar(3) NOT NULL,
        "total_amount" numeric(20,6) NOT NULL DEFAULT 0,
        "created_by" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_purchases_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_purchases_reference" UNIQUE ("tenant_id", "reference"),
        CONSTRAINT "chk_purchases_status"
          CHECK ("status" IN ('draft','approved','partially_received','received','cancelled')),
        CONSTRAINT "chk_purchases_currency" CHECK ("currency" IN ('USD','CDF')),
        CONSTRAINT "chk_purchases_total" CHECK ("total_amount" >= 0),
        CONSTRAINT "fk_purchases_supplier" FOREIGN KEY ("tenant_id", "supplier_id")
          REFERENCES "suppliers" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_purchases_warehouse" FOREIGN KEY ("tenant_id", "destination_warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_purchases_actor" FOREIGN KEY ("tenant_id", "created_by")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "purchase_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "purchase_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "quantity_ordered" bigint NOT NULL,
        "unit_cost" numeric(20,6) NOT NULL,
        "total_cost" numeric(20,6) NOT NULL,
        CONSTRAINT "chk_purchase_items_quantity" CHECK ("quantity_ordered" > 0),
        CONSTRAINT "chk_purchase_items_cost" CHECK ("unit_cost" >= 0 AND "total_cost" >= 0),
        CONSTRAINT "fk_purchase_items_purchase" FOREIGN KEY ("tenant_id", "purchase_id")
          REFERENCES "purchases" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_purchase_items_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "product_batches" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "batch_number" varchar(100) NOT NULL,
        "expiration_date" date NULL,
        "quantity" bigint NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_product_batches_scope"
          UNIQUE NULLS NOT DISTINCT
            ("tenant_id", "warehouse_id", "physical_product_id", "batch_number", "expiration_date"),
        CONSTRAINT "uq_product_batches_identity"
          UNIQUE ("tenant_id", "warehouse_id", "physical_product_id", "id"),
        CONSTRAINT "chk_product_batches_quantity" CHECK ("quantity" >= 0),
        CONSTRAINT "fk_product_batches_warehouse" FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_product_batches_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "goods_receipts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "purchase_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "reference" varchar(60) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "received_by" uuid NULL,
        "received_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_goods_receipts_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_goods_receipts_reference" UNIQUE ("tenant_id", "reference"),
        CONSTRAINT "chk_goods_receipts_status" CHECK ("status" IN ('draft','posted','cancelled')),
        CONSTRAINT "fk_goods_receipts_purchase" FOREIGN KEY ("tenant_id", "purchase_id")
          REFERENCES "purchases" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_goods_receipts_warehouse" FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_goods_receipts_actor" FOREIGN KEY ("tenant_id", "received_by")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "goods_receipt_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "goods_receipt_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "quantity_received" bigint NOT NULL,
        "unit_cost" numeric(20,6) NOT NULL,
        "batch_id" uuid NULL,
        CONSTRAINT "chk_goods_receipt_items_quantity" CHECK ("quantity_received" > 0),
        CONSTRAINT "chk_goods_receipt_items_cost" CHECK ("unit_cost" >= 0),
        CONSTRAINT "fk_goods_receipt_items_receipt" FOREIGN KEY ("tenant_id", "goods_receipt_id")
          REFERENCES "goods_receipts" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_goods_receipt_items_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "product_valuations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "quantity" bigint NOT NULL DEFAULT 0,
        "average_cost" numeric(20,6) NOT NULL DEFAULT 0,
        "total_value" numeric(20,6) NOT NULL DEFAULT 0,
        "version" bigint NOT NULL DEFAULT 0,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_product_valuations"
          UNIQUE ("tenant_id", "warehouse_id", "physical_product_id"),
        CONSTRAINT "chk_product_valuations_values"
          CHECK ("quantity" >= 0 AND "average_cost" >= 0 AND "total_value" >= 0),
        CONSTRAINT "fk_product_valuations_warehouse" FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_product_valuations_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "stock_transfers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "source_warehouse_id" uuid NOT NULL,
        "destination_warehouse_id" uuid NOT NULL,
        "reference" varchar(60) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "created_by" uuid NOT NULL,
        "validated_by" uuid NULL,
        "transferred_at" timestamptz NULL,
        "received_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_stock_transfers_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_stock_transfers_reference" UNIQUE ("tenant_id", "reference"),
        CONSTRAINT "chk_stock_transfers_distinct" CHECK ("source_warehouse_id" <> "destination_warehouse_id"),
        CONSTRAINT "chk_stock_transfers_status"
          CHECK ("status" IN ('draft','approved','shipped','received','cancelled')),
        CONSTRAINT "fk_stock_transfers_source" FOREIGN KEY ("tenant_id", "source_warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_stock_transfers_destination" FOREIGN KEY ("tenant_id", "destination_warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "stock_transfer_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "transfer_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "quantity_requested" bigint NOT NULL,
        "quantity_sent" bigint NOT NULL DEFAULT 0,
        "quantity_received" bigint NOT NULL DEFAULT 0,
        "unit_cost" numeric(20,6) NOT NULL DEFAULT 0,
        CONSTRAINT "chk_stock_transfer_items_quantities"
          CHECK ("quantity_requested" > 0 AND "quantity_sent" >= 0 AND "quantity_received" >= 0
            AND "quantity_sent" <= "quantity_requested"
            AND "quantity_received" <= "quantity_sent"),
        CONSTRAINT "fk_stock_transfer_items_transfer" FOREIGN KEY ("tenant_id", "transfer_id")
          REFERENCES "stock_transfers" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_stock_transfer_items_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "inventory_counts" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "reference" varchar(60) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "created_by" uuid NOT NULL,
        "validated_by" uuid NULL,
        "counted_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_inventory_counts_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_inventory_counts_reference" UNIQUE ("tenant_id", "reference"),
        CONSTRAINT "chk_inventory_counts_status"
          CHECK ("status" IN ('draft','counting','validated','cancelled')),
        CONSTRAINT "fk_inventory_counts_warehouse"
          FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_inventory_counts_creator"
          FOREIGN KEY ("tenant_id", "created_by")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_inventory_counts_validator"
          FOREIGN KEY ("tenant_id", "validated_by")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "inventory_count_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "count_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "batch_id" uuid NULL,
        "expected_quantity" bigint NOT NULL,
        "counted_quantity" bigint NULL,
        "difference_quantity" bigint NULL,
        "unit_cost" numeric(20,6) NULL,
        CONSTRAINT "uq_inventory_count_items"
          UNIQUE NULLS NOT DISTINCT
            ("tenant_id", "count_id", "physical_product_id", "batch_id"),
        CONSTRAINT "chk_inventory_count_items_expected" CHECK ("expected_quantity" >= 0),
        CONSTRAINT "chk_inventory_count_items_counted"
          CHECK ("counted_quantity" IS NULL OR "counted_quantity" >= 0),
        CONSTRAINT "fk_inventory_count_items_count"
          FOREIGN KEY ("tenant_id", "count_id")
          REFERENCES "inventory_counts" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_inventory_count_items_product"
          FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "expenses" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "amount" numeric(20,6) NOT NULL,
        "currency" varchar(3) NOT NULL,
        "description" text NOT NULL,
        "created_by" uuid NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_expenses_amount" CHECK ("amount" > 0),
        CONSTRAINT "chk_expenses_currency" CHECK ("currency" IN ('USD','CDF')),
        CONSTRAINT "fk_expenses_establishment" FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_expenses_actor" FOREIGN KEY ("tenant_id", "created_by")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "authorized_terminals" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "device_identifier" varchar(255) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'pending',
        "last_sync_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_authorized_terminals_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "uq_authorized_terminals_device" UNIQUE ("tenant_id", "device_identifier"),
        CONSTRAINT "chk_authorized_terminals_status" CHECK ("status" IN ('pending','active','revoked')),
        CONSTRAINT "fk_authorized_terminals_establishment" FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_authorized_terminals_warehouse" FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "stock_allocations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "terminal_id" uuid NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'active',
        "expires_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_stock_allocations_scope" UNIQUE ("tenant_id", "id"),
        CONSTRAINT "chk_stock_allocations_status" CHECK ("status" IN ('active','consumed','expired','revoked')),
        CONSTRAINT "fk_stock_allocations_warehouse" FOREIGN KEY ("tenant_id", "warehouse_id")
          REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_stock_allocations_terminal" FOREIGN KEY ("tenant_id", "terminal_id")
          REFERENCES "authorized_terminals" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "stock_allocation_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "allocation_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "allocated_quantity" bigint NOT NULL,
        "consumed_quantity" bigint NOT NULL DEFAULT 0,
        CONSTRAINT "uq_stock_allocation_items"
          UNIQUE ("tenant_id", "allocation_id", "physical_product_id"),
        CONSTRAINT "chk_stock_allocation_items_quantities"
          CHECK ("allocated_quantity" > 0 AND "consumed_quantity" >= 0
            AND "consumed_quantity" <= "allocated_quantity"),
        CONSTRAINT "fk_stock_allocation_items_allocation" FOREIGN KEY ("tenant_id", "allocation_id")
          REFERENCES "stock_allocations" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_stock_allocation_items_product" FOREIGN KEY ("tenant_id", "physical_product_id")
          REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT
      );

      CREATE TABLE "sync_operations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "terminal_id" uuid NOT NULL,
        "operation_uuid" uuid NOT NULL,
        "operation_type" varchar(80) NOT NULL,
        "payload" jsonb NOT NULL,
        "payload_hash" varchar(64) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'processing',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "processed_at" timestamptz NULL,
        CONSTRAINT "uq_sync_operations_idempotency"
          UNIQUE ("tenant_id", "terminal_id", "operation_uuid"),
        CONSTRAINT "chk_sync_operations_status"
          CHECK ("status" IN ('processing','completed','rejected')),
        CONSTRAINT "fk_sync_operations_terminal" FOREIGN KEY ("tenant_id", "terminal_id")
          REFERENCES "authorized_terminals" ("tenant_id", "id") ON DELETE RESTRICT
      );

      ALTER TABLE "sales" ADD COLUMN "warehouse_id" uuid NULL;
      ALTER TABLE "sales" ADD COLUMN "terminal_id" uuid NULL;
      ALTER TABLE "sales" ADD CONSTRAINT "fk_sales_v1_warehouse"
        FOREIGN KEY ("tenant_id", "warehouse_id")
        REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "sales" ADD CONSTRAINT "fk_sales_v1_terminal"
        FOREIGN KEY ("tenant_id", "terminal_id")
        REFERENCES "authorized_terminals" ("tenant_id", "id") ON DELETE RESTRICT;

      ALTER TABLE "sale_items" ADD COLUMN "physical_product_id" uuid NULL;
      ALTER TABLE "sale_items" ADD COLUMN "unit_cost" numeric(20,6) NULL;
      UPDATE "sale_items" si
        SET "physical_product_id" = pp."id"
      FROM "physical_products" pp
      WHERE pp."legacy_product_id" = si."product_id";
      ALTER TABLE "sale_items" ADD CONSTRAINT "fk_sale_items_v1_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;

      CREATE TABLE "sale_line_batch_allocations" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "sale_item_id" uuid NOT NULL,
        "warehouse_id" uuid NOT NULL,
        "physical_product_id" uuid NOT NULL,
        "batch_id" uuid NOT NULL,
        "quantity" bigint NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_sale_line_batch_allocations"
          UNIQUE ("tenant_id", "establishment_id", "sale_item_id", "batch_id"),
        CONSTRAINT "chk_sale_line_batch_allocations_quantity" CHECK ("quantity" > 0),
        CONSTRAINT "fk_sale_line_batch_allocations_item"
          FOREIGN KEY ("tenant_id", "establishment_id", "sale_item_id")
          REFERENCES "sale_items" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT,
        CONSTRAINT "fk_sale_line_batch_allocations_batch"
          FOREIGN KEY ("tenant_id", "warehouse_id", "physical_product_id", "batch_id")
          REFERENCES "product_batches"
            ("tenant_id", "warehouse_id", "physical_product_id", "id")
          ON DELETE RESTRICT
      );

      ALTER TABLE "stock_balances" ADD COLUMN "warehouse_id" uuid NULL;
      ALTER TABLE "stock_balances" ADD COLUMN "physical_product_id" uuid NULL;
      ALTER TABLE "stock_balances" ADD COLUMN "batch_id" uuid NULL;
      ALTER TABLE "stock_balances" ADD COLUMN "version" bigint NOT NULL DEFAULT 0;
      UPDATE "stock_balances" sb SET
        "warehouse_id" = w."id",
        "physical_product_id" = pp."id"
      FROM "warehouses" w, "physical_products" pp
      WHERE w."tenant_id" = sb."tenant_id"
        AND w."establishment_id" = sb."establishment_id"
        AND w."kind" = 'secondary'
        AND pp."legacy_product_id" = sb."product_id";
      ALTER TABLE "stock_balances" ADD CONSTRAINT "fk_stock_balances_v1_warehouse"
        FOREIGN KEY ("tenant_id", "warehouse_id")
        REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "stock_balances" ADD CONSTRAINT "fk_stock_balances_v1_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "stock_balances"
        DROP CONSTRAINT IF EXISTS "uq_stock_balances_article";
      CREATE UNIQUE INDEX "uq_stock_balances_v1"
        ON "stock_balances"
          ("tenant_id", "warehouse_id", "physical_product_id", "bucket", coalesce("batch_id", '00000000-0000-0000-0000-000000000000'::uuid))
        WHERE "warehouse_id" IS NOT NULL AND "physical_product_id" IS NOT NULL;

      ALTER TABLE "stock_movements" ADD COLUMN "warehouse_id" uuid NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "physical_product_id" uuid NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "batch_id" uuid NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "unit_cost" numeric(20,6) NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "total_cost" numeric(20,6) NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "source_type" varchar(40) NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "source_id" uuid NULL;
      ALTER TABLE "stock_movements" ADD COLUMN "actor_membership_id" uuid NULL;
      UPDATE "stock_movements" sm SET
        "warehouse_id" = w."id",
        "physical_product_id" = pp."id"
      FROM "warehouses" w, "physical_products" pp
      WHERE w."tenant_id" = sm."tenant_id"
        AND w."establishment_id" = sm."establishment_id"
        AND w."kind" = 'secondary'
        AND pp."legacy_product_id" = sm."product_id";
      ALTER TABLE "stock_movements" ADD CONSTRAINT "fk_stock_movements_v1_warehouse"
        FOREIGN KEY ("tenant_id", "warehouse_id")
        REFERENCES "warehouses" ("tenant_id", "id") ON DELETE RESTRICT;
      ALTER TABLE "stock_movements" ADD CONSTRAINT "fk_stock_movements_v1_product"
        FOREIGN KEY ("tenant_id", "physical_product_id")
        REFERENCES "physical_products" ("tenant_id", "id") ON DELETE RESTRICT;
      CREATE INDEX "idx_stock_movements_v1_product"
        ON "stock_movements" ("tenant_id", "warehouse_id", "physical_product_id", "occurred_at");

      CREATE OR REPLACE FUNCTION "prevent_immutable_journal_change"()
      RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        RAISE EXCEPTION 'journal rows are immutable';
      END;
      $$;
      CREATE TRIGGER "trg_stock_movements_immutable"
        BEFORE UPDATE OR DELETE ON "stock_movements"
        FOR EACH ROW EXECUTE FUNCTION "prevent_immutable_journal_change"();
      CREATE TRIGGER "trg_audit_logs_immutable"
        BEFORE UPDATE OR DELETE ON "audit_logs"
        FOR EACH ROW EXECUTE FUNCTION "prevent_immutable_journal_change"();
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TRIGGER IF EXISTS "trg_audit_logs_immutable" ON "audit_logs";
      DROP TRIGGER IF EXISTS "trg_stock_movements_immutable" ON "stock_movements";
      DROP FUNCTION IF EXISTS "prevent_immutable_journal_change"();
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_v1_product";
      ALTER TABLE "stock_movements" DROP CONSTRAINT IF EXISTS "fk_stock_movements_v1_warehouse";
      DROP INDEX IF EXISTS "idx_stock_movements_v1_product";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "actor_membership_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "source_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "source_type";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "total_cost";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "unit_cost";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "batch_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "physical_product_id";
      ALTER TABLE "stock_movements" DROP COLUMN IF EXISTS "warehouse_id";
      DROP INDEX IF EXISTS "uq_stock_balances_v1";
      ALTER TABLE "stock_balances" DROP CONSTRAINT IF EXISTS "fk_stock_balances_v1_product";
      ALTER TABLE "stock_balances" DROP CONSTRAINT IF EXISTS "fk_stock_balances_v1_warehouse";
      ALTER TABLE "stock_balances" ADD CONSTRAINT "uq_stock_balances_article"
        UNIQUE ("tenant_id", "establishment_id", "product_id", "bucket");
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "version";
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "batch_id";
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "physical_product_id";
      ALTER TABLE "stock_balances" DROP COLUMN IF EXISTS "warehouse_id";
      ALTER TABLE "sales" DROP CONSTRAINT IF EXISTS "fk_sales_v1_terminal";
      ALTER TABLE "sales" DROP CONSTRAINT IF EXISTS "fk_sales_v1_warehouse";
      ALTER TABLE "sales" DROP COLUMN IF EXISTS "terminal_id";
      ALTER TABLE "sales" DROP COLUMN IF EXISTS "warehouse_id";
      DROP TABLE IF EXISTS "sale_line_batch_allocations";
      ALTER TABLE "sale_items" DROP CONSTRAINT IF EXISTS "fk_sale_items_v1_product";
      ALTER TABLE "sale_items" DROP COLUMN IF EXISTS "unit_cost";
      ALTER TABLE "sale_items" DROP COLUMN IF EXISTS "physical_product_id";
      DROP TABLE IF EXISTS "sync_operations";
      DROP TABLE IF EXISTS "stock_allocation_items";
      DROP TABLE IF EXISTS "stock_allocations";
      DROP TABLE IF EXISTS "authorized_terminals";
      DROP TABLE IF EXISTS "expenses";
      DROP TABLE IF EXISTS "inventory_count_items";
      DROP TABLE IF EXISTS "inventory_counts";
      DROP TABLE IF EXISTS "stock_transfer_items";
      DROP TABLE IF EXISTS "stock_transfers";
      DROP TABLE IF EXISTS "product_valuations";
      DROP TABLE IF EXISTS "goods_receipt_items";
      DROP TABLE IF EXISTS "goods_receipts";
      DROP TABLE IF EXISTS "product_batches";
      DROP TABLE IF EXISTS "purchase_items";
      DROP TABLE IF EXISTS "purchases";
      DROP TABLE IF EXISTS "suppliers";
      DROP TABLE IF EXISTS "product_prices";
      ALTER TABLE "drug_details"
        DROP CONSTRAINT IF EXISTS "fk_drug_details_physical_product";
      ALTER TABLE "drug_details" DROP COLUMN IF EXISTS "physical_product_id";
      ALTER TABLE "product_barcodes"
        DROP CONSTRAINT IF EXISTS "fk_product_barcodes_physical_product";
      ALTER TABLE "product_barcodes" DROP COLUMN IF EXISTS "physical_product_id";
      ALTER TABLE "product_packagings"
        DROP CONSTRAINT IF EXISTS "uq_product_packagings_physical_scope";
      ALTER TABLE "product_packagings"
        DROP CONSTRAINT IF EXISTS "fk_product_packagings_physical_product";
      ALTER TABLE "product_packagings"
        DROP COLUMN IF EXISTS "physical_product_id";
      ALTER TABLE "product_categories"
        DROP CONSTRAINT IF EXISTS "fk_product_categories_parent";
      ALTER TABLE "product_categories"
        DROP CONSTRAINT IF EXISTS "uq_product_categories_tenant_id";
      ALTER TABLE "product_categories" DROP COLUMN IF EXISTS "parent_id";
      ALTER TABLE "product_categories"
        ALTER COLUMN "establishment_id" SET NOT NULL;
      DROP TABLE IF EXISTS "establishment_products";
      DROP TABLE IF EXISTS "physical_products";
      DROP TABLE IF EXISTS "membership_warehouses";
      DROP TABLE IF EXISTS "warehouses";
      DROP INDEX IF EXISTS "uq_establishments_tenant_code";
      ALTER TABLE "establishments" DROP COLUMN IF EXISTS "email";
      ALTER TABLE "establishments" DROP COLUMN IF EXISTS "phone";
      ALTER TABLE "establishments" DROP COLUMN IF EXISTS "code";
      DROP INDEX IF EXISTS "uq_tenants_slug";
      ALTER TABLE "tenants" DROP COLUMN IF EXISTS "slug";
    `);
  }
}
