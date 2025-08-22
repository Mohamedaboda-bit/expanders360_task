"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveCurrencyCodeFromProjects1700000000000 = void 0;
class RemoveCurrencyCodeFromProjects1700000000000 {
    name = 'RemoveCurrencyCodeFromProjects1700000000000';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE projects DROP COLUMN currency_code`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE projects ADD COLUMN currency_code char(3) NULL`);
    }
}
exports.RemoveCurrencyCodeFromProjects1700000000000 = RemoveCurrencyCodeFromProjects1700000000000;
//# sourceMappingURL=0003-remove-currency-code-from-projects.js.map