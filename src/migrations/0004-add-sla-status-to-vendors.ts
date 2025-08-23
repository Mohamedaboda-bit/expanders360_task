import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlaStatusToVendors1700000000002 implements MigrationInterface {
  name = 'AddSlaStatusToVendors1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE vendors ADD COLUMN sla_status ENUM('active', 'expired') NOT NULL DEFAULT 'active'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vendors DROP COLUMN sla_status`);
  }
}
