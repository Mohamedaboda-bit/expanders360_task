import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Service } from '../../entities/service.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Country } from '../../entities/country.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { ApiResponseUtil } from '../../utils/api-response.util';
import { ApiResponse } from '../../types/api-response.types';

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
  ) { }

  async findAll(): Promise<ApiResponse<Project[]>> {
    const projects = await this.projectsRepository.find({
      relations: ['client', 'services'],
    });
    
    if (projects.length === 0) {
      return ApiResponseUtil.emptyList('projects');
    }
    
    return ApiResponseUtil.successWithCount(projects, 'All projects retrieved successfully');
  }

  async findByClient(clientId: number): Promise<ApiResponse<Project[]>> {
    const projects = await this.projectsRepository.find({
      where: { client_id: clientId },
      relations: ['client', 'services'],
    });
    
    if (projects.length === 0) {
      return ApiResponseUtil.emptyList('projects', `No projects found for client ${clientId}`);
    }
    
    return ApiResponseUtil.successWithCount(projects, `Projects for client ${clientId} retrieved successfully`);
  }

  async findOne(id: number): Promise<ApiResponse<Project>> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client', 'services'],
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', id);
    }

    return ApiResponseUtil.success(project, 'Project retrieved successfully');
  }

  async findOneByClient(id: number, clientId: number): Promise<ApiResponse<Project>> {
    const project = await this.projectsRepository.findOne({
      where: { id, client_id: clientId },
      relations: ['client', 'services'],
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', id);
    }

    return ApiResponseUtil.success(project, 'Project retrieved successfully');
  }

  async create(projectData: CreateProjectDto): Promise<ApiResponse<Project>> {
    await this.validateProjectInputs(
      projectData.service_ids,
      projectData.country_code,
    );
    
    const services = await this.servicesRepository.find({
      where: projectData.service_ids.map((id: number) => ({ id })),
    });
    const project = this.projectsRepository.create({
      ...projectData,
      country_code: projectData.country_code?.toUpperCase(),
      services,
    });

    const savedProject = await this.projectsRepository.save(project);
    const createdProject = await this.projectsRepository.findOne({
      where: { id: savedProject.id },
      relations: ['services'],
    });
    
    if (!createdProject) {
      return ApiResponseUtil.error('Failed to create project', 'CREATION_FAILED');
    }
    
    return ApiResponseUtil.created(createdProject, 'Project');
  }

  async update(id: number, projectData: UpdateProjectDto): Promise<ApiResponse<Project>> {
    // First check if the project exists
    const existingProject = await this.projectsRepository.findOne({
      where: { id },
    });

    if (!existingProject) {
      return ApiResponseUtil.notFound('Project', id);
    }

    if (projectData.service_ids || projectData.country_code) {
      await this.validateProjectInputs(
        projectData.service_ids,
        projectData.country_code,
      );
    }
    
    const { service_ids, ...scalarFields } = projectData;
    if (scalarFields.country_code) {
      scalarFields.country_code = scalarFields.country_code.toUpperCase();
    }
    
    await this.projectsRepository.update(id, scalarFields);
    
    if (service_ids) {
      await this.projectsRepository
        .createQueryBuilder()
        .relation(Project, 'services')
        .of(id)
        .remove(await this.projectsRepository
          .createQueryBuilder()
          .relation(Project, 'services')
          .of(id)
          .loadMany());
      await this.projectsRepository
        .createQueryBuilder()
        .relation(Project, 'services')
        .of(id)
        .add(service_ids);
    }
    
    const updatedProject = await this.findOne(id);
    if (!updatedProject.success) {
      return updatedProject;
    }
    return ApiResponseUtil.updated(updatedProject.data, 'Project');
  }

  async updateByClient(
    id: number,
    projectData: UpdateProjectDto,
    clientId: number,
  ): Promise<ApiResponse<Project>> {
    // First check if the project exists for this client
    const existingProject = await this.projectsRepository.findOne({
      where: { id, client_id: clientId },
    });

    if (!existingProject) {
      return ApiResponseUtil.notFound('Project', id);
    }

    if (projectData.service_ids || projectData.country_code) {
      await this.validateProjectInputs(
        projectData.service_ids,
        projectData.country_code,
      );
    }
    
    const { service_ids, ...scalarFields } = projectData;
    if (scalarFields.country_code) {
      scalarFields.country_code = scalarFields.country_code.toUpperCase();
    }
    
    await this.projectsRepository.update(id, scalarFields);
    
    if (service_ids) {
      await this.projectsRepository
        .createQueryBuilder()
        .relation(Project, 'services')
        .of(id)
        .remove(await this.projectsRepository
          .createQueryBuilder()
          .relation(Project, 'services')
          .of(id)
          .loadMany());
      await this.projectsRepository
        .createQueryBuilder()
        .relation(Project, 'services')
        .of(id)
        .add(service_ids);
    }
    
    const updatedProject = await this.findOneByClient(id, clientId);
    if (!updatedProject.success) {
      return updatedProject;
    }
    return ApiResponseUtil.updated(updatedProject.data, 'Project');
  }

  async remove(id: number): Promise<ApiResponse<{ deletedProjectId: number }>> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });
    
    if (!project) {
      return ApiResponseUtil.notFound('Project', id);
    }
    
    await this.projectsRepository.delete(id);
    
    return ApiResponseUtil.success({ deletedProjectId: id }, `Project with ID ${id} has been successfully deleted`);
  }

  async removeByClient(id: number, clientId: number): Promise<ApiResponse<{ deletedProjectId: number }>> {
    const project = await this.projectsRepository.findOne({
      where: { id, client_id: clientId },
      relations: ['client'],
    });
    
    if (!project) {
      return ApiResponseUtil.notFound('Project', id);
    }
    
    await this.projectsRepository.delete(id);
    
    return ApiResponseUtil.success({ deletedProjectId: id }, `Project with ID ${id} has been successfully deleted`);
  }

  async rebuildMatches(projectId: number): Promise<ApiResponse<Match[]>> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
      relations: ['services'],
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', projectId);
    }

    const vendors = await this.vendorsRepository.find({
      relations: ['services', 'countries'],
    });

    await this.matchesRepository.delete({ project_id: projectId });

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
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No matches found for project ${projectId}`);
    }
    
    return ApiResponseUtil.successWithCount(matches, `Matches rebuilt successfully for project ${projectId}`);
  }

  async rebuildMatchesByClient(
    projectId: number,
    clientId: number,
  ): Promise<ApiResponse<Match[]>> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, client_id: clientId },
    });
    
    if (!project) {
      return ApiResponseUtil.notFound('Project', projectId);
    }
    
    return this.rebuildMatches(projectId);
  }

  private calculateMatchScore(project: Project, vendor: Vendor): number {
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
    // console.log(`service over lap is ${serviceOverlap}`)
    const slaWeight = Math.max(0, 24 - vendor.response_sla_hours) / 24;
    const rating = Number(vendor.rating);
    const overlapScore = serviceOverlap * 2;
    const finalScore = Number(overlapScore + rating + slaWeight);
    
    console.log(`Vendor: ${vendor.name}, Overlap: ${serviceOverlap}, OverlapScore: ${overlapScore}, Rating: ${rating}, SLA: ${slaWeight}, Final: ${finalScore}`);
    
    return finalScore;
  }

  private async validateProjectInputs(
    serviceIds: number[],
    countryCode: string,
  ) {
    if (serviceIds) {
      const foundServices = await this.servicesRepository.find({
        where: serviceIds.map((id: number) => ({ id })),
      });
      if (foundServices.length !== serviceIds.length) {
        const foundIds = foundServices.map((s) => s.id);
        const missing = serviceIds.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Invalid service_ids: ${missing.join(', ')}`,
        );
      }
    }
    if (countryCode) {
      const country = await this.countriesRepository.findOne({
        where: { country_code: countryCode },
      });
      if (!country) {
        throw new BadRequestException(`Invalid country_code: ${countryCode}`);
      }
    }
  }
}
