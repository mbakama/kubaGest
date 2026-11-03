import type { MigrationInterface, QueryRunner } from 'typeorm';

/** Ajoute les informations personnelles affichées dans la session utilisateur. */
export class UserProfile1730100000000 implements MigrationInterface {
  name = 'UserProfile1730100000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "first_name" varchar(80) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "last_name" varchar(80) NULL`,
    );
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar_key" text NULL`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar_key"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
  }
}
