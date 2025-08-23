import { DataSource } from 'typeorm';
import { Project } from '../entities/project.entity';
import { Client } from '../entities/client.entity';
import { Service } from '../entities/service.entity';
import { Country } from '../entities/country.entity';

export class ProjectsSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const clients = await this.dataSource.getRepository(Client).find({
      relations: ['user']
    });
    const services = await this.dataSource.getRepository(Service).find();
    const countries = await this.dataSource.getRepository(Country).find();

    console.log('📋 Seeding projects...');

    for (const client of clients) {
      const numProjects = Math.floor(Math.random() * 3) + 2;
      
      for (let i = 0; i < numProjects; i++) {
        const project = new Project();
        project.client = client;
        project.country = countries[Math.floor(Math.random() * countries.length)];
        project.country_code = project.country.country_code;
        project.client_id = client.id;
        project.budget = Math.floor(Math.random() * 90000) + 10000;
        project.status = 'active';

        const numServices = Math.floor(Math.random() * 2) + 2; // 2-3 services
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