import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveCurrencyCodeFromProjects1700000000001 implements MigrationInterface {
  name = 'RemoveCurrencyCodeFromProjects1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE projects DROP COLUMN currency_code`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE projects ADD COLUMN currency_code char(3) NULL`);
  }
}
