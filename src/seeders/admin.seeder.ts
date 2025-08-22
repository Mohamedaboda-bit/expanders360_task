import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class AdminSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const adminEmail = 'admin@expander360.com';
    const adminPassword = 'admin123456';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await this.dataSource.query(
      'INSERT IGNORE INTO users (email, password_hash, role) VALUES (?, ?, ?)',
      [adminEmail, passwordHash, 'admin']
    );

    console.log('✅ Seeded admin user');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log('⚠️  Change this password in production!');
  }
}
