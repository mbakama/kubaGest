import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Schéma initial multi-tenant (§10 et §24 du cahier des charges).
 *
 * Migration PostgreSQL : les environnements SQLite de développement/test
 * utilisent la synchronisation TypeORM (`DB_SYNCHRONIZE=true`).
 *
 * Chaque table métier porte `tenant_id` afin que l'isolation soit appliquée
 * côté serveur, jamais à partir d'un identifiant fourni par le client.
 */
export class InitialSchema1729700000000 implements MigrationInterface {
  name = 'InitialSchema1729700000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "name" varchar(150) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'trial',
        "plan" varchar(20) NOT NULL DEFAULT 'essential',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "establishments" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants" ("id") ON DELETE CASCADE,
        "name" varchar(150) NOT NULL,
        "activity_type" varchar(20) NOT NULL,
        "timezone" varchar(60) NOT NULL DEFAULT 'Africa/Kinshasa',
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_establishments_tenant" ON "establishments" ("tenant_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "is_platform_admin" boolean NOT NULL DEFAULT false,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "memberships" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants" ("id") ON DELETE CASCADE,
        "user_id" uuid NOT NULL REFERENCES "users" ("id") ON DELETE CASCADE,
        "role" varchar(20) NOT NULL,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "uq_memberships_tenant_user" UNIQUE ("tenant_id", "user_id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_memberships_user" ON "memberships" ("user_id")`,
    );

    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NULL REFERENCES "tenants" ("id") ON DELETE SET NULL,
        "actor_id" uuid NULL,
        "action" varchar(100) NOT NULL,
        "entity_type" varchar(60) NOT NULL,
        "entity_id" varchar(64) NULL,
        "old_values" text NULL,
        "new_values" text NULL,
        "occurred_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_audit_logs_tenant" ON "audit_logs" ("tenant_id")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "memberships"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "establishments"`);
    await queryRunner.query(`DROP TABLE "tenants"`);
  }
}
