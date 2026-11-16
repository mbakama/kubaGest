import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UserSex1800100000000 implements MigrationInterface {
  name = 'UserSex1800100000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "sex" varchar(6) NULL`);
    await queryRunner.query(`
      DO $$ BEGIN
        ALTER TABLE "users" ADD CONSTRAINT "chk_users_sex" CHECK ("sex" IN ('male', 'female'));
      EXCEPTION
        WHEN duplicate_object THEN NULL;
      END $$;
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "chk_users_sex"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "sex"`);
  }
}
