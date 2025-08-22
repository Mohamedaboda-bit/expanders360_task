"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialSchema00011699999999999 = void 0;
class InitialSchema00011699999999999 {
    name = 'InitialSchema00011699999999999';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS services (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS clients (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      company_name VARCHAR(255) NOT NULL,
      contact_email VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS projects (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      client_id BIGINT UNSIGNED NOT NULL,
      country_code CHAR(2) NOT NULL,
      budget DECIMAL(12,2) NULL,
      currency_code CHAR(3) NULL,
      status ENUM('active','paused','completed','cancelled') NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_projects_client FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_projects_client (client_id),
      INDEX idx_projects_country_status (country_code, status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS vendors (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      rating DECIMAL(3,2) NOT NULL DEFAULT 0.00,
      response_sla_hours INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_vendors_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS vendor_countries (
      vendor_id BIGINT UNSIGNED NOT NULL,
      country_code CHAR(2) NOT NULL,
      PRIMARY KEY (vendor_id, country_code),
      CONSTRAINT fk_vendor_countries_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE ON UPDATE CASCADE,
      INDEX idx_vendor_countries_country (country_code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS vendor_services (
      vendor_id BIGINT UNSIGNED NOT NULL,
      service_id BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (vendor_id, service_id),
      CONSTRAINT fk_vendor_services_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_vendor_services_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_vendor_services_service (service_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS project_services (
      project_id BIGINT UNSIGNED NOT NULL,
      service_id BIGINT UNSIGNED NOT NULL,
      PRIMARY KEY (project_id, service_id),
      CONSTRAINT fk_project_services_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_project_services_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT ON UPDATE CASCADE,
      INDEX idx_project_services_service (service_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS matches (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      project_id BIGINT UNSIGNED NOT NULL,
      vendor_id BIGINT UNSIGNED NOT NULL,
      score DECIMAL(6,2) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_matches_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE ON UPDATE CASCADE,
      CONSTRAINT fk_matches_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE ON UPDATE CASCADE,
      UNIQUE KEY uq_matches_project_vendor (project_id, vendor_id),
      INDEX idx_matches_project_created (project_id, created_at),
      INDEX idx_matches_vendor (vendor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE IF EXISTS matches`);
        await queryRunner.query(`DROP TABLE IF EXISTS project_services`);
        await queryRunner.query(`DROP TABLE IF EXISTS vendor_services`);
        await queryRunner.query(`DROP TABLE IF EXISTS vendor_countries`);
        await queryRunner.query(`DROP TABLE IF EXISTS vendors`);
        await queryRunner.query(`DROP TABLE IF EXISTS projects`);
        await queryRunner.query(`DROP TABLE IF EXISTS clients`);
        await queryRunner.query(`DROP TABLE IF EXISTS services`);
    }
}
exports.InitialSchema00011699999999999 = InitialSchema00011699999999999;
//# sourceMappingURL=0001-initialSchema.js.map