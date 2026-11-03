import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Lot 1 du dictionnaire `docs/database/SCHEMA.md` (§10) : renforcement du
 * socle, formules commerciales, périodes d'abonnement, paramètres
 * d'établissement, taux de change, sessions d'authentification, invitations
 * et dérogations de permissions.
 *
 * Migration additive : les migrations déjà appliquées ne sont pas réécrites et
 * les identifiants existants sont conservés. `tenants.plan` est retiré au
 * profit de `subscriptions.plan_id`, après reprise des valeurs existantes.
 */
export class SocleAccountsPlansSettings1729900000000 implements MigrationInterface {
  name = 'SocleAccountsPlansSettings1729900000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    // Contraintes d'exclusion temporelle et opérateurs d'égalité sur uuid.
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS btree_gist`);

    // --- tenants -----------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE "tenants"
        ADD CONSTRAINT "chk_tenants_status"
        CHECK ("status" IN ('trial','active','suspended','closed'))
    `);

    // --- establishments ----------------------------------------------------
    await queryRunner.query(
      `ALTER TABLE "establishments" ADD "address" text NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "establishments"
        ADD "is_active" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(`
      ALTER TABLE "establishments"
        ADD CONSTRAINT "chk_establishments_activity"
        CHECK ("activity_type" IN ('boutique','alimentation','pharmacie'))
    `);
    // MVP : un seul point de vente par commerce.
    await queryRunner.query(`
      ALTER TABLE "establishments"
        ADD CONSTRAINT "uq_establishments_tenant" UNIQUE ("tenant_id")
    `);
    // Clé candidate pour les FK composites (tenant_id, establishment_id, …).
    await queryRunner.query(`
      ALTER TABLE "establishments"
        ADD CONSTRAINT "uq_establishments_tenant_id" UNIQUE ("tenant_id", "id")
    `);

    // --- users -------------------------------------------------------------
    await queryRunner.query(`ALTER TABLE "users" ADD "phone" varchar(30) NULL`);
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD "is_active" boolean NOT NULL DEFAULT true
    `);
    await queryRunner.query(
      `ALTER TABLE "users" ADD "password_changed_at" timestamptz NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "uq_users_email_lower" ON "users" (lower("email"))`,
    );

    // --- memberships -------------------------------------------------------
    await queryRunner.query(`
      ALTER TABLE "memberships"
        ADD CONSTRAINT "chk_memberships_role"
        CHECK ("role" IN ('owner','cashier','stock_manager'))
    `);
    await queryRunner.query(`
      ALTER TABLE "memberships"
        ADD CONSTRAINT "uq_memberships_tenant_id" UNIQUE ("tenant_id", "id")
    `);

    // --- plans -------------------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "plans" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "code" varchar(40) NOT NULL UNIQUE,
        "name" varchar(100) NOT NULL,
        "monthly_price" numeric(20,6) NOT NULL DEFAULT 0,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "max_employees" integer NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_plans_price" CHECK ("monthly_price" >= 0),
        CONSTRAINT "chk_plans_max_employees"
          CHECK ("max_employees" IS NULL OR "max_employees" >= 0)
      )
    `);
    // Tarifs contractuels à confirmer : aucun prix commercial n'est imposé.
    await queryRunner.query(`
      INSERT INTO "plans" ("code", "name", "monthly_price", "currency")
      VALUES
        ('essential', 'Essentiel', 0, 'USD'),
        ('control', 'Contrôle', 0, 'USD')
      ON CONFLICT ("code") DO NOTHING
    `);

    // --- subscriptions -----------------------------------------------------
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "plan_id" uuid NULL`,
    );
    await queryRunner.query(`
      UPDATE "subscriptions" s
      SET "plan_id" = p."id"
      FROM "plans" p
      WHERE p."code" = s."plan"
    `);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ALTER COLUMN "plan_id" SET NOT NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD CONSTRAINT "fk_subscriptions_plan"
        FOREIGN KEY ("plan_id") REFERENCES "plans" ("id") ON DELETE RESTRICT
    `);
    await queryRunner.query(`ALTER TABLE "subscriptions" DROP COLUMN "plan"`);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" RENAME COLUMN "start_at" TO "starts_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" RENAME COLUMN "end_at" TO "ends_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "agreed_price" numeric(20,6) NULL`,
    );
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD "currency" varchar(3) NOT NULL DEFAULT 'CDF'
    `);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "employee_limit" integer NULL`,
    );
    await queryRunner.query(`
      UPDATE "subscriptions" s
      SET "currency" = t."currency"
      FROM "tenants" t
      WHERE t."id" = s."tenant_id"
    `);
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD CONSTRAINT "chk_subscriptions_currency"
        CHECK ("currency" IN ('USD','CDF'))
    `);
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD CONSTRAINT "chk_subscriptions_status"
        CHECK ("status" IN ('trial','active','suspended','expired','cancelled'))
    `);
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD CONSTRAINT "chk_subscriptions_period"
        CHECK ("ends_at" IS NULL OR "ends_at" > "starts_at")
    `);
    // Une seule période active à la fois par tenant (chevauchement interdit).
    await queryRunner.query(`
      ALTER TABLE "subscriptions"
        ADD CONSTRAINT "excl_subscriptions_period"
        EXCLUDE USING gist (
          "tenant_id" WITH =,
          tstzrange("starts_at", "ends_at", '[)') WITH &&
        )
    `);

    // La formule ne vit plus sur le tenant : source unique = subscriptions.
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "plan"`);

    // --- establishment_settings -------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "establishment_settings" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "max_discount_percent" numeric(5,2) NOT NULL DEFAULT 0,
        "payment_tolerance" numeric(20,6) NOT NULL DEFAULT 0,
        "expiry_boundary" varchar(20) NOT NULL DEFAULT 'start_of_day',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_establishment_settings_scope"
          UNIQUE ("tenant_id", "establishment_id"),
        CONSTRAINT "chk_establishment_settings_discount"
          CHECK ("max_discount_percent" >= 0 AND "max_discount_percent" <= 100),
        CONSTRAINT "chk_establishment_settings_tolerance"
          CHECK ("payment_tolerance" >= 0),
        CONSTRAINT "chk_establishment_settings_expiry"
          CHECK ("expiry_boundary" IN ('start_of_day','end_of_day')),
        CONSTRAINT "fk_establishment_settings_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_establishment_settings_tenant"
        ON "establishment_settings" ("tenant_id")
    `);

    // --- expiry_alert_rules ------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "expiry_alert_rules" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "days_before" integer NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_expiry_alert_rules_scope"
          UNIQUE ("tenant_id", "establishment_id", "days_before"),
        CONSTRAINT "chk_expiry_alert_rules_days" CHECK ("days_before" >= 0),
        CONSTRAINT "fk_expiry_alert_rules_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_expiry_alert_rules_tenant"
        ON "expiry_alert_rules" ("tenant_id", "establishment_id")
    `);

    // --- exchange_rates ----------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "exchange_rates" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "establishment_id" uuid NOT NULL,
        "cdf_per_usd" numeric(20,10) NOT NULL,
        "effective_at" timestamptz NOT NULL DEFAULT now(),
        "created_by" uuid NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_exchange_rates_scope"
          UNIQUE ("tenant_id", "establishment_id", "effective_at"),
        CONSTRAINT "chk_exchange_rates_positive" CHECK ("cdf_per_usd" > 0),
        CONSTRAINT "fk_exchange_rates_establishment"
          FOREIGN KEY ("tenant_id", "establishment_id")
          REFERENCES "establishments" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_exchange_rates_tenant"
        ON "exchange_rates" ("tenant_id", "establishment_id")
    `);

    // --- membership_permissions -------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "membership_permissions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL,
        "membership_id" uuid NOT NULL,
        "permission_code" varchar(80) NOT NULL,
        "allowed" boolean NOT NULL DEFAULT true,
        "granted_by" uuid NULL,
        "reason" text NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_membership_permissions_scope"
          UNIQUE ("tenant_id", "membership_id", "permission_code"),
        CONSTRAINT "fk_membership_permissions_membership"
          FOREIGN KEY ("tenant_id", "membership_id")
          REFERENCES "memberships" ("tenant_id", "id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_membership_permissions_tenant"
        ON "membership_permissions" ("tenant_id", "membership_id")
    `);

    // --- auth_sessions -----------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "auth_sessions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "refresh_token_hash" text NOT NULL UNIQUE,
        "client_type" varchar(20) NOT NULL,
        "expires_at" timestamptz NOT NULL,
        "last_seen_at" timestamptz NULL,
        "revoked_at" timestamptz NULL,
        "replaced_by_id" uuid NULL REFERENCES "auth_sessions" ("id")
          ON DELETE SET NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_auth_sessions_client"
          CHECK ("client_type" IN ('desktop','mobile','web'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_auth_sessions_user" ON "auth_sessions" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_auth_sessions_expiry" ON "auth_sessions" ("expires_at")
    `);

    // --- access_tokens -----------------------------------------------------
    await queryRunner.query(`
      CREATE TABLE "access_tokens" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "tenant_id" uuid NULL REFERENCES "tenants" ("id") ON DELETE CASCADE,
        "purpose" varchar(20) NOT NULL,
        "token_hash" text NOT NULL UNIQUE,
        "expires_at" timestamptz NOT NULL,
        "consumed_at" timestamptz NULL,
        "created_by" uuid NULL REFERENCES "users" ("id") ON DELETE SET NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "chk_access_tokens_purpose"
          CHECK ("purpose" IN ('invitation','password_reset'))
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_access_tokens_user" ON "access_tokens" ("user_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_access_tokens_expiry" ON "access_tokens" ("expires_at")
    `);

    // --- audit_logs --------------------------------------------------------
    // Les métadonnées passent de texte JSON à `jsonb` (aucune perte : les
    // valeurs écrites jusqu'ici étaient déjà du JSON sérialisé).
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
        ALTER COLUMN "old_values" TYPE jsonb
        USING NULLIF("old_values", '')::jsonb
    `);
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
        ALTER COLUMN "new_values" TYPE jsonb
        USING NULLIF("new_values", '')::jsonb
    `);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" RENAME COLUMN "actor_id" TO "actor_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "establishment_id" uuid NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "actor_membership_id" uuid NULL`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" ADD "reason" text NULL`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD "request_id" uuid NULL`,
    );
    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_tenant_occurred"
        ON "audit_logs" ("tenant_id", "occurred_at")
    `);
    await queryRunner.query(`
      CREATE INDEX "idx_audit_logs_entity"
        ON "audit_logs" ("tenant_id", "entity_type", "entity_id")
    `);

    // --- updated_at garanti par trigger (dictionnaire §2, convention U) ---
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger
      LANGUAGE plpgsql AS $$
      BEGIN
        NEW."updated_at" = now();
        RETURN NEW;
      END;
      $$
    `);
    await queryRunner.query(`
      DO $$
      DECLARE
        target text;
      BEGIN
        FOREACH target IN ARRAY ARRAY[
          'tenants','establishments','users','memberships','subscriptions',
          'plans','establishment_settings','expiry_alert_rules',
          'membership_permissions'
        ]
        LOOP
          EXECUTE format(
            'DROP TRIGGER IF EXISTS %I ON %I',
            'trg_' || target || '_updated_at', target
          );
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
          'tenants','establishments','users','memberships','subscriptions',
          'plans','establishment_settings','expiry_alert_rules',
          'membership_permissions'
        ]
        LOOP
          EXECUTE format('DROP TRIGGER IF EXISTS %I ON %I', 'trg_' || target || '_updated_at', target);
        END LOOP;
      END;
      $$
    `);
    await queryRunner.query(`DROP FUNCTION IF EXISTS set_updated_at()`);

    await queryRunner.query(`DROP INDEX "idx_audit_logs_entity"`);
    await queryRunner.query(`DROP INDEX "idx_audit_logs_tenant_occurred"`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" RENAME COLUMN "actor_user_id" TO "actor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "establishment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "actor_membership_id"`,
    );
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP COLUMN "reason"`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" DROP COLUMN "request_id"`,
    );
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
        ALTER COLUMN "old_values" TYPE text
        USING "old_values"::text
    `);
    await queryRunner.query(`
      ALTER TABLE "audit_logs"
        ALTER COLUMN "new_values" TYPE text
        USING "new_values"::text
    `);

    await queryRunner.query(`DROP TABLE "access_tokens"`);
    await queryRunner.query(`DROP TABLE "auth_sessions"`);
    await queryRunner.query(`DROP TABLE "membership_permissions"`);
    await queryRunner.query(`DROP TABLE "exchange_rates"`);
    await queryRunner.query(`DROP TABLE "expiry_alert_rules"`);
    await queryRunner.query(`DROP TABLE "establishment_settings"`);

    await queryRunner.query(
      `ALTER TABLE "tenants" ADD "plan" varchar(20) NOT NULL DEFAULT 'essential'`,
    );
    await queryRunner.query(`
      UPDATE "tenants" t
      SET "plan" = p."code"
      FROM "subscriptions" s
      JOIN "plans" p ON p."id" = s."plan_id"
      WHERE s."tenant_id" = t."id"
    `);

    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "excl_subscriptions_period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "chk_subscriptions_period"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "chk_subscriptions_status"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "chk_subscriptions_currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "employee_limit"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "currency"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "agreed_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" ADD "plan" varchar(20) NOT NULL DEFAULT 'essential'`,
    );
    await queryRunner.query(`
      UPDATE "subscriptions" s
      SET "plan" = p."code"
      FROM "plans" p
      WHERE p."id" = s."plan_id"
    `);
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP CONSTRAINT "fk_subscriptions_plan"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" DROP COLUMN "plan_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" RENAME COLUMN "starts_at" TO "start_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "subscriptions" RENAME COLUMN "ends_at" TO "end_at"`,
    );

    await queryRunner.query(`DROP TABLE "plans"`);

    await queryRunner.query(
      `ALTER TABLE "memberships" DROP CONSTRAINT "uq_memberships_tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "memberships" DROP CONSTRAINT "chk_memberships_role"`,
    );

    await queryRunner.query(`DROP INDEX "uq_users_email_lower"`);
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "password_changed_at"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);

    await queryRunner.query(
      `ALTER TABLE "establishments" DROP CONSTRAINT "uq_establishments_tenant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "establishments" DROP CONSTRAINT "uq_establishments_tenant"`,
    );
    await queryRunner.query(
      `ALTER TABLE "establishments" DROP CONSTRAINT "chk_establishments_activity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "establishments" DROP COLUMN "is_active"`,
    );
    await queryRunner.query(
      `ALTER TABLE "establishments" DROP COLUMN "address"`,
    );

    await queryRunner.query(
      `ALTER TABLE "tenants" DROP CONSTRAINT "chk_tenants_status"`,
    );
  }
}
