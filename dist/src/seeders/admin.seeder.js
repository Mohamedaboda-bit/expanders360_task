"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeeder = void 0;
const bcrypt = require("bcrypt");
class AdminSeeder {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async run() {
        const adminEmail = 'admin@expander360.com';
        const adminPassword = 'admin123456';
        const passwordHash = await bcrypt.hash(adminPassword, 10);
        await this.dataSource.query('INSERT IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)', [adminEmail, passwordHash, 'admin']);
        console.log('✅ Seeded admin user');
        console.log(`📧 Email: ${adminEmail}`);
        console.log(`🔑 Password: ${adminPassword}`);
        console.log('⚠️  Change this password in production!');
    }
}
exports.AdminSeeder = AdminSeeder;
//# sourceMappingURL=admin.seeder.js.map