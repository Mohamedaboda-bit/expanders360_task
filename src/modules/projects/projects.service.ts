import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Service } from '../../entities/service.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Country } from '../../entities/country.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['client', 'services'],
    });
  }

  async findByClient(clientId: number): Promise<Project[]> {
    return this.projectsRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'services'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client', 'services'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async findOneByClient(id: number, clientId: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, client_id: clientId },
      relations: ['client', 'services'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found for this client`);
    }
    
    return project;
  }

  async create(projectData: CreateProjectDto ): Promise<Project | null> {
    await this.validateProjectInputs(projectData.service_ids, projectData.country_code);
    const project = this.projectsRepository.create(projectData as CreateProjectDto) ;
    const savedProject = await this.projectsRepository.save(project) ;

    if (projectData.service_ids && projectData.service_ids.length > 0) {
      await this.projectsRepository
        .createQueryBuilder()
        .relation(Project, 'services')
        .of(savedProject.id)
        .add(projectData.service_ids);
    }
    
    return await this.projectsRepository.findOne({
      where:{id :savedProject.id},
      relations:["services"]
    })

  }

  async update(id: number, projectData: any): Promise<Project> {
    if (projectData.service_ids || projectData.country_code) {
      await this.validateProjectInputs(projectData.service_ids, projectData.country_code);
    }
    await this.projectsRepository.update(id, projectData);
    return this.findOne(id);
  }

  async updateByClient(id: number, projectData: Partial<Project>, clientId: number): Promise<Project> {
    const project = await this.findOneByClient(id, clientId);
    await this.projectsRepository.update(id, projectData);
    return this.findOneByClient(id, clientId);
  }

  async remove(id: number): Promise<void> {
    await this.projectsRepository.delete(id);
  }

  async removeByClient(id: number, clientId: number): Promise<void> {
    await this.findOneByClient(id, clientId);
    await this.projectsRepository.delete(id);
  }

  async rebuildMatches(projectId: number): Promise<Match[]> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['services'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    const vendors = await this.vendorsRepository.find({
      relations: ['services', 'countries'],
    });

    const matches: Match[] = [];

    for (const vendor of vendors) {
      const score = this.calculateMatchScore(project, vendor);
      if (score > 0) {
        const match = this.matchesRepository.create({
          project_id: projectId,
          vendor_id: vendor.id,
          score,
        });
        matches.push(match);
      }
    }

    await this.matchesRepository.save(matches);
    return matches;
  }

  async rebuildMatchesByClient(projectId: number, clientId: number): Promise<Match[]> {
    await this.findOneByClient(projectId, clientId);
    return this.rebuildMatches(projectId);
  }

  private calculateMatchScore(project: Project, vendor: Vendor): number {
    const vendorCountryCodes = vendor.countries.map(c => c.country_code);
    if (!vendorCountryCodes.includes(project.country_code)) {
      return 0;
    }

    const projectServiceIds = project.services.map(s => s.id);
    const vendorServiceIds = vendor.services.map(s => s.id);
    const serviceOverlap = projectServiceIds.filter(id => vendorServiceIds.includes(id)).length;

    if (serviceOverlap === 0) {
      return 0;
    }

    const slaWeight = Math.max(0, 24 - vendor.response_sla_hours) / 24;
    return serviceOverlap * 2 + vendor.rating + slaWeight;
  }

  private async validateProjectInputs(serviceIds: number[], countryCode: string) {
    if (!serviceIds || serviceIds.length === 0) {
      throw new BadRequestException('service_ids must be a non-empty array');
    }

    const foundServices = await this.servicesRepository.find({ where: { id: In(serviceIds) } });
    if (foundServices.length !== serviceIds.length) {
      const foundIds = foundServices.map(s => s.id);
      const missing = serviceIds.filter(id => !foundIds.includes(id));
      throw new BadRequestException(`Invalid service_ids: ${missing.join(', ')}`);
    }

    if (!countryCode || countryCode.trim().length === 0) {
      throw new BadRequestException('country_code must be provided');
    }

    const country = await this.countriesRepository.findOne({ where: { country_code: countryCode } });
    if (!country) {
      throw new BadRequestException(`Invalid country_code: ${countryCode}`);
    }
  }
}
