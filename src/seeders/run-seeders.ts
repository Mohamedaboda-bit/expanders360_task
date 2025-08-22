import  AppDataSource  from '../../typeorm.config';
import { CountriesSeeder } from './countries.seeder';
import { ServicesSeeder } from './services.seeder';
import { AdminSeeder } from './admin.seeder';

async function runSeeders() {
  try {
    await AppDataSource.initialize();
    console.log('🚀 Starting database seeding...\n');

    const countriesSeeder = new CountriesSeeder(AppDataSource);
    await countriesSeeder.run();

    const servicesSeeder = new ServicesSeeder(AppDataSource);
    await servicesSeeder.run();

    const adminSeeder = new AdminSeeder(AppDataSource);
    await adminSeeder.run();

    console.log('\n🎉 All seeders completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

runSeeders();
