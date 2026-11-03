import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lot ventes, caisse et stock du dictionnaire `docs/database/SCHEMA.md` (§5 à
 * §7), dans le périmètre tenable aujourd'hui : un seul compartiment de stock
 * (`available`), pas encore de lots ni de réceptions multiples.
 *
 * Crée la numérotation des documents, les caisses et leur journal, le stock
 * projeté et son journal, les tickets et leurs règlements. Relie enfin le
 * carnet de crédit au ticket qui l'a produit et ajoute les relances.
 */
export class SalesCashStock1730300000000 implements MigrationInterface {
  name = 'SalesCashStock1730300000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // --- document_counters ------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "document_counters" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "document_kind" varchar(30) NOT NULL,
        "period" varchar(10) NOT NULL DEFAULT 'ALL',
        "last_value" bigint NOT NULL DEFAULT 0,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_document_counters_value" CHECK ("last_value" >= 0)
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_document_counters_scope"
        ON "document_counters" ("tenant_id", "document_kind", "period")
    `);

    // --- cash_registers ---------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "cash_registers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "name" varchar(100) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_cash_registers_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "fk_cash_registers_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_cash_registers_name"
        ON "cash_registers" ("tenant_id", "establishment_id", lower("name"))
    `);

    // --- cash_sessions ----------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "cash_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "register_id" uuid NOT NULL,
        "cashier_id" uuid NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "opened_by" uuid NOT NULL,
        "opened_at" timestamptz NOT NULL DEFAULT now(),
        "closed_by" uuid NULL,
        "closed_at" timestamptz NULL,
        "closing_reason" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_cash_sessions_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_cash_sessions_status"
          CHECK ("status" IN ('open','closed')),
        CONSTRAINT "chk_cash_sessions_closed_at"
          CHECK ("closed_at" IS NULL OR "closed_at" >= "opened_at"),
        CONSTRAINT "fk_cash_sessions_register"
          FOREIGN KEY ("tenant_id", "establishment_id", "register_id")
          REFERENCES "cash_registers" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_cash_sessions_open_register"
        ON "cash_sessions" ("tenant_id", "establishment_id", "register_id")
        WHERE "status" = 'open'
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_cash_sessions_open_cashier"
        ON "cash_sessions" ("tenant_id", "establishment_id", "cashier_id")
        WHERE "status" = 'open'
    `);

    // --- cash_session_currencies -----------------------------------------
    await queryRunner.query(`
      CREATE TABLE "cash_session_currencies" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "session_id" uuid NOT NULL,
        "currency" varchar(3) NOT NULL,
        "opening_amount" numeric(20,6) NOT NULL DEFAULT 0,
        "expected_at_close" numeric(20,6) NULL,
        "counted_at_close" numeric(20,6) NULL,
        "difference_at_close" numeric(20,6) NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_cash_session_currencies_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_cash_session_currencies_currency"
          UNIQUE ("session_id", "currency"),
        CONSTRAINT "chk_cash_session_currencies_currency"
          CHECK ("currency" IN ('USD','CDF')),
        CONSTRAINT "chk_cash_session_currencies_opening"
          CHECK ("opening_amount" >= 0),
        CONSTRAINT "fk_cash_session_currencies_session"
          FOREIGN KEY ("tenant_id", "establishment_id", "session_id")
          REFERENCES "cash_sessions" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);

    // --- stock_balances ---------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "stock_balances" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "bucket" varchar(20) NOT NULL DEFAULT 'available',
        "quantity_base" bigint NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_stock_balances_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_stock_balances_article"
          UNIQUE ("tenant_id", "establishment_id", "product_id", "bucket"),
        CONSTRAINT "chk_stock_balances_bucket"
          CHECK ("bucket" IN ('available','quarantine')),
        CONSTRAINT "chk_stock_balances_quantity"
          CHECK ("quantity_base" >= 0),
        CONSTRAINT "fk_stock_balances_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);

    // --- sales ------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "sales" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "number" varchar(60) NOT NULL,
        "cashier_id" uuid NOT NULL,
        "session_id" uuid NULL,
        "status" varchar(25) NOT NULL DEFAULT 'posted',
        "reference_currency" varchar(3) NOT NULL,
        "channel" varchar(16) NOT NULL,
        "subtotal" numeric(20,6) NOT NULL,
        "discount_total" numeric(20,6) NOT NULL DEFAULT 0,
        "tax_total" numeric(20,6) NOT NULL DEFAULT 0,
        "total" numeric(20,6) NOT NULL,
        "rounding_adjustment" numeric(20,6) NOT NULL DEFAULT 0,
        "posted_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_sales_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_sales_number" UNIQUE ("tenant_id", "number"),
        CONSTRAINT "chk_sales_status"
          CHECK ("status" IN ('posted','partially_returned','returned','voided')),
        CONSTRAINT "chk_sales_channel"
          CHECK ("channel" IN ('cash','mobile','credit')),
        CONSTRAINT "chk_sales_amounts"
          CHECK (
            "subtotal" >= 0 AND "discount_total" >= 0 AND "tax_total" >= 0
            AND "total" >= 0
            AND "total" = "subtotal" - "discount_total" + "tax_total"
              + "rounding_adjustment"
          ),
        CONSTRAINT "fk_sales_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT,
        CONSTRAINT "fk_sales_session"
          FOREIGN KEY ("tenant_id", "establishment_id", "session_id")
          REFERENCES "cash_sessions" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_sales_posted"
        ON "sales" ("tenant_id", "establishment_id", "posted_at")
    `);

    // --- sale_items -------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "sale_items" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "sale_id" uuid NOT NULL,
        "line_number" integer NOT NULL,
        "product_id" uuid NOT NULL,
        "packaging_id" uuid NOT NULL,
        "sku_snapshot" varchar(80) NOT NULL,
        "name_snapshot" varchar(200) NOT NULL,
        "packaging_snapshot" varchar(60) NOT NULL,
        "factor_snapshot" bigint NOT NULL,
        "quantity_packages" bigint NOT NULL,
        "quantity_base" bigint NOT NULL,
        "unit_price" numeric(20,6) NOT NULL,
        "discount_amount" numeric(20,6) NOT NULL DEFAULT 0,
        "tax_rate" numeric(7,4) NOT NULL DEFAULT 0,
        "tax_amount" numeric(20,6) NOT NULL DEFAULT 0,
        "net_amount" numeric(20,6) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_sale_items_scope"
          UNIQUE ("tenant_id", "establishment_id", "sale_id", "id"),
        CONSTRAINT "uq_sale_items_identity"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_sale_items_line" UNIQUE ("sale_id", "line_number"),
        CONSTRAINT "chk_sale_items_factor" CHECK ("factor_snapshot" > 0),
        CONSTRAINT "chk_sale_items_packages" CHECK ("quantity_packages" > 0),
        CONSTRAINT "chk_sale_items_base" CHECK ("quantity_base" > 0),
        CONSTRAINT "chk_sale_items_amounts"
          CHECK (
            "unit_price" >= 0 AND "discount_amount" >= 0 AND "tax_amount" >= 0
            AND "net_amount" >= 0 AND "tax_rate" >= 0 AND "tax_rate" <= 100
          ),
        CONSTRAINT "fk_sale_items_sale"
          FOREIGN KEY ("tenant_id", "establishment_id", "sale_id")
          REFERENCES "sales" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT,
        CONSTRAINT "fk_sale_items_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT,
        CONSTRAINT "fk_sale_items_packaging"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id", "packaging_id")
          REFERENCES "product_packagings" ("tenant_id", "establishment_id", "product_id", "id")
          ON DELETE RESTRICT
      )
    `);

    // --- payments ---------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "sale_id" uuid NOT NULL,
        "session_id" uuid NULL,
        "direction" varchar(10) NOT NULL,
        "purpose" varchar(20) NOT NULL,
        "method" varchar(20) NOT NULL,
        "currency" varchar(3) NOT NULL,
        "amount" numeric(20,6) NOT NULL,
        "received_by" uuid NULL,
        "occurred_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_payments_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_payments_direction" CHECK ("direction" IN ('in','out')),
        CONSTRAINT "chk_payments_purpose"
          CHECK ("purpose" IN ('settlement','change','refund')),
        CONSTRAINT "chk_payments_method"
          CHECK ("method" IN ('cash','bank','mobile_money')),
        CONSTRAINT "chk_payments_amount" CHECK ("amount" > 0),
        CONSTRAINT "fk_payments_sale"
          FOREIGN KEY ("tenant_id", "establishment_id", "sale_id")
          REFERENCES "sales" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_payments_sale" ON "payments" ("tenant_id", "sale_id")
    `);

    // --- cash_movements ---------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "cash_movements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "session_id" uuid NOT NULL,
        "currency" varchar(3) NOT NULL,
        "amount_delta" numeric(20,6) NOT NULL,
        "kind" varchar(30) NOT NULL,
        "payment_id" uuid NULL,
        "credit_payment_id" uuid NULL,
        "actor_id" uuid NULL,
        "occurred_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_cash_movements_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_cash_movements_delta" CHECK ("amount_delta" <> 0),
        CONSTRAINT "chk_cash_movements_origin"
          CHECK (
            ("payment_id" IS NULL) <> ("credit_payment_id" IS NULL)
          ),
        CONSTRAINT "fk_cash_movements_session"
          FOREIGN KEY ("tenant_id", "establishment_id", "session_id")
          REFERENCES "cash_sessions" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_cash_movements_session"
        ON "cash_movements" ("tenant_id", "session_id")
    `);

    // --- stock_movements --------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "stock_movements" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "product_id" uuid NOT NULL,
        "bucket" varchar(20) NOT NULL DEFAULT 'available',
        "quantity_delta" bigint NOT NULL,
        "kind" varchar(30) NOT NULL,
        "sale_item_id" uuid NULL,
        "reference" text NULL,
        "actor_id" uuid NULL,
        "occurred_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_stock_movements_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_stock_movements_delta" CHECK ("quantity_delta" <> 0),        CONSTRAINT "chk_stock_movements_bucket"
          CHECK ("bucket" IN ('available','quarantine')),
        CONSTRAINT "chk_stock_movements_kind"
          CHECK ("kind" IN ('entry','sale','adjustment')),
        CONSTRAINT "fk_stock_movements_product"
          FOREIGN KEY ("tenant_id", "establishment_id", "product_id")
          REFERENCES "products" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT,
        CONSTRAINT "fk_stock_movements_sale_item"
          FOREIGN KEY ("tenant_id", "establishment_id", "sale_item_id")
          REFERENCES "sale_items" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_stock_movements_product"
        ON "stock_movements" ("tenant_id", "establishment_id", "product_id")
    `);

    // --- crédit : lien avec le ticket et relances --------------------------
    await queryRunner.query(`
      ALTER TABLE "credit_sales" ADD COLUMN "sale_id" uuid NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "credit_sales"
        ADD CONSTRAINT "fk_credit_sales_sale"
        FOREIGN KEY ("tenant_id", "establishment_id", "sale_id")
        REFERENCES "sales" ("tenant_id", "establishment_id", "id")
        ON DELETE RESTRICT
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_credit_sales_sale"
        ON "credit_sales" ("sale_id") WHERE "sale_id" IS NOT NULL
    `);

    await queryRunner.query(`
      CREATE TABLE "credit_reminders" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "credit_id" uuid NOT NULL,
        "channel" varchar(20) NOT NULL DEFAULT 'sms',
        "status" varchar(20) NOT NULL DEFAULT 'sent',
        "recipient" varchar(32) NULL,
        "message" text NOT NULL,
        "sent_at" timestamptz NOT NULL DEFAULT now(),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_credit_reminders_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_credit_reminders_channel"
          CHECK ("channel" IN ('sms')),
        CONSTRAINT "chk_credit_reminders_status"
          CHECK ("status" IN ('sent','failed')),
        CONSTRAINT "fk_credit_reminders_credit"
          FOREIGN KEY ("tenant_id", "establishment_id", "credit_id")
          REFERENCES "credit_sales" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_credit_reminders_credit"
        ON "credit_reminders" ("tenant_id", "credit_id", "sent_at")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "credit_reminders"`);
    await queryRunner.query(
      `ALTER TABLE "credit_sales" DROP CONSTRAINT IF EXISTS "fk_credit_sales_sale"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_credit_sales_sale"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_sales" DROP COLUMN IF EXISTS "sale_id"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_movements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_movements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sale_items"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "stock_balances"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_session_currencies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "cash_registers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "document_counters"`);
  }
}
