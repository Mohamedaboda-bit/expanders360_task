import AppDataSource from '../../typeorm.config';
import { CountriesSeeder } from './countries.seeder';
import { ServicesSeeder } from './services.seeder';
import { VendorsSeeder } from './vendors.seeder';
import { AdminSeeder } from './admin.seeder';
import { DocumentsSeeder } from './documents.seeder';
import { ClientsSeeder } from './clients.seeder';
import { ProjectsSeeder } from './projects.seeder';

async function runSeeders() {
  try {
    await AppDataSource.initialize();
    console.log('📊 Connected to database');

    const countriesSeeder = new CountriesSeeder(AppDataSource);
    await countriesSeeder.run();

    const servicesSeeder = new ServicesSeeder(AppDataSource);
    await servicesSeeder.run();

    const clientsSeeder = new ClientsSeeder(AppDataSource);
    await clientsSeeder.run();

    const adminSeeder = new AdminSeeder(AppDataSource);
    await adminSeeder.run();

    const projectsSeeder = new ProjectsSeeder(AppDataSource);
    await projectsSeeder.run();

    const vendorsSeeder = new VendorsSeeder(AppDataSource);
    await vendorsSeeder.run();

    const documentsSeeder = new DocumentsSeeder(AppDataSource);
    await documentsSeeder.run();

    console.log('✅ All seeders completed successfully');
  } catch (error) {
    console.error('❌ Error running seeders:', error);
  } finally {
    await AppDataSource.destroy();
    process.exit(0);
  }
}

runSeeders();
