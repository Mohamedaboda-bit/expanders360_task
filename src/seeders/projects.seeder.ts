import { DataSource } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Client } from '../entities/client.entity';
import { Service } from '../entities/service.entity';
import { Country } from '../entities/country.entity';
import { Vendor } from '../entities/vendor.entity';

export class ProjectsSeeder {
  constructor(private dataSource: DataSource) {}

  private calculateMatchScore(project: Project, vendor: Vendor): number {
    if (vendor.sla_status === 'expired') {
      return 0;
    }

    const vendorCountryCodes = vendor.countries.map((c) => c.country_code);
    if (!vendorCountryCodes.includes(project.country_code)) {
      return 0;
    }

    const projectServiceIds = project.services.map((s) => s.id);
    const vendorServiceIds = vendor.services.map((s) => s.id);
    const serviceOverlap = projectServiceIds.filter((id) =>
      vendorServiceIds.includes(id),
    ).length;

    if (serviceOverlap === 0) {
      return 0;
    }

    const slaWeight = Math.max(0, 24 - vendor.response_sla_hours) / 24;
    const rating = Number(vendor.rating);
    const overlapScore = serviceOverlap * 2;
    const finalScore = Number(overlapScore + rating + slaWeight);
      
    return finalScore;
  }

  async run() {
    console.log('📋 Loading required data...');
    
    const [clients, services, countries] = await Promise.all([
      this.dataSource.getRepository(Client).find({
        relations: ['user']
      }),
      this.dataSource.getRepository(Service).find(),
      this.dataSource.getRepository(Country).find()
    ]);

    console.log('📋 Creating projects...');

    for (const client of clients) {
      const numProjects = Math.floor(Math.random() * 3) + 2; // 2-4 projects per client
      
      for (let i = 0; i < numProjects; i++) {
        const project = new Project();
        project.client = client;
        project.country = countries[Math.floor(Math.random() * countries.length)];
        project.country_code = project.country.country_code;
        project.client_id = client.id;
        project.budget = Math.floor(Math.random() * 90000) + 10000;
        project.status = 'active';

        // Select 2-3 random services
        const numServices = Math.floor(Math.random() * 2) + 2;
        const selectedServices = new Set<Service>();
        while (selectedServices.size < numServices) {
          const randomService = services[Math.floor(Math.random() * services.length)];
          selectedServices.add(randomService);
        }
        project.services = Array.from(selectedServices);
        
        const savedProject = await this.dataSource.getRepository(Project).save(project);
        console.log(`Created project ${savedProject.id} with ${project.services.length} services in ${project.country_code}`);
      }
    }

    console.log('✅ Projects seeded successfully');
  }
}