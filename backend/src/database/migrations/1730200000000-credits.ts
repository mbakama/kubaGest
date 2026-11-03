import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Carnet de crédit du comptoir (`docs/database/SCHEMA.md`, extension du MVP).
 *
 * Le schéma d'origine excluait le crédit : toute vente était réglée. Cette
 * migration ouvre un carnet explicite — client, plafond d'encours, vente à
 * crédit, échéance et règlements — sans toucher aux tables de vente.
 */
export class Credits1730200000000 implements MigrationInterface {
  name = 'Credits1730200000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // --- customers ---------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "name" varchar(160) NOT NULL,
        "phone" varchar(32) NULL,
        "credit_limit" numeric(20,6) NOT NULL DEFAULT 0,
        "is_active" boolean NOT NULL DEFAULT true,
        "note" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_customers_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_customers_credit_limit" CHECK ("credit_limit" >= 0),
        CONSTRAINT "fk_customers_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_customers_tenant"
        ON "customers" ("tenant_id", "establishment_id")
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX "uq_customers_phone"
        ON "customers" ("tenant_id", "establishment_id", "phone")
        WHERE "phone" IS NOT NULL
    `);

    // --- credit_sales ------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "credit_sales" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "customer_id" uuid NOT NULL,
        "number" varchar(40) NOT NULL,
        "total" numeric(20,6) NOT NULL,
        "paid_total" numeric(20,6) NOT NULL DEFAULT 0,
        "due_date" date NULL,
        "status" varchar(16) NOT NULL DEFAULT 'open',
        "note" text NULL,
        "created_by" uuid NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_credit_sales_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "uq_credit_sales_number" UNIQUE ("tenant_id", "number"),
        CONSTRAINT "chk_credit_sales_total" CHECK ("total" > 0),
        CONSTRAINT "chk_credit_sales_paid"
          CHECK ("paid_total" >= 0 AND "paid_total" <= "total"),
        CONSTRAINT "chk_credit_sales_status"
          CHECK ("status" IN ('open','paid','cancelled')),
        CONSTRAINT "fk_credit_sales_customer"
          FOREIGN KEY ("tenant_id", "establishment_id", "customer_id")
          REFERENCES "customers" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_credit_sales_customer"
        ON "credit_sales" ("tenant_id", "establishment_id", "customer_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_credit_sales_status"
        ON "credit_sales" ("tenant_id", "establishment_id", "status")
    `);

    // --- credit_payments ---------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "credit_payments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "credit_id" uuid NOT NULL,
        "amount" numeric(20,6) NOT NULL,
        "method" varchar(16) NOT NULL DEFAULT 'cash',
        "paid_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_credit_payments_scope"
          UNIQUE ("tenant_id", "establishment_id", "id"),
        CONSTRAINT "chk_credit_payments_amount" CHECK ("amount" > 0),
        CONSTRAINT "chk_credit_payments_method"
          CHECK ("method" IN ('cash','mobile')),
        CONSTRAINT "fk_credit_payments_credit"
          FOREIGN KEY ("tenant_id", "establishment_id", "credit_id")
          REFERENCES "credit_sales" ("tenant_id", "establishment_id", "id")
          ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_credit_payments_credit"
        ON "credit_payments" ("tenant_id", "credit_id")
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "credit_payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "credit_sales"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "customers"`);
  }
}
