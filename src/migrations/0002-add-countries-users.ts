import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountriesUsers00021699999999999 implements MigrationInterface {
  name = 'AddCountriesUsers00021699999999999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE IF NOT EXISTS countries (
      country_code CHAR(2) PRIMARY KEY,
      country_name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS users (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('client','admin') NOT NULL DEFAULT 'client',
      client_id BIGINT UNSIGNED NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_users_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL ON UPDATE CASCADE,
      INDEX idx_users_email (email),
      INDEX idx_users_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);

    await queryRunner.query(`ALTER TABLE projects 
      ADD CONSTRAINT fk_projects_country 
      FOREIGN KEY (country_code) REFERENCES countries(country_code) ON DELETE RESTRICT ON UPDATE CASCADE`);

    await queryRunner.query(`ALTER TABLE vendor_countries 
      ADD CONSTRAINT fk_vendor_countries_country 
      FOREIGN KEY (country_code) REFERENCES countries(country_code) ON DELETE RESTRICT ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE vendor_countries DROP FOREIGN KEY fk_vendor_countries_country`);
    await queryRunner.query(`ALTER TABLE projects DROP FOREIGN KEY fk_projects_country`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
    await queryRunner.query(`DROP TABLE IF EXISTS countries`);
  }
}
