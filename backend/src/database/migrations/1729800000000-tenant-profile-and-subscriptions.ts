import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Profil du tenant (F01 : devise de référence et adresse facultative) et
 * abonnements (F07 : formule, statut, échéance).
 *
 * Les tenants existants reçoivent un abonnement reprenant leur formule et
 * leur statut actuels, afin qu'aucun tenant ne reste sans échéance suivie.
 */
export class TenantProfileAndSubscriptions1729800000000 implements MigrationInterface {
  name = 'TenantProfileAndSubscriptions1729800000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD "currency" varchar(3) NOT NULL DEFAULT 'CDF'`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenants" ADD "address" varchar(255) NULL`,
    );

    await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        "tenant_id" uuid NOT NULL REFERENCES "tenants" ("id") ON DELETE CASCADE,
        "plan" varchar(20) NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'trial',
        "start_at" timestamptz NOT NULL DEFAULT now(),
        "end_at" timestamptz NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now()
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "idx_subscriptions_tenant" ON "subscriptions" ("tenant_id")`,
    );

    await queryRunner.query(`
      INSERT INTO "subscriptions" ("tenant_id", "plan", "status", "start_at", "created_at", "updated_at")
      SELECT "id", "plan", "status", "created_at", "created_at", "updated_at" FROM "tenants"
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_subscriptions_tenant"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "currency"`);
  }
}
