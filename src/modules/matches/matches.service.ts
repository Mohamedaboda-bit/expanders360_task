import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Match[]> {
    return this.matchesRepository.find({
      relations: ['project', 'vendor'],
    });
  }

  async findByClientProjects(clientId: number): Promise<Match[]> {
    const projects = await this.projectsRepository.find({
      where: { client_id: clientId },
      select: ['id'],
    });
    
    const projectIds = projects.map(p => p.id);
    
    return this.matchesRepository.find({
      where: { project_id: { id: projectIds } as any },
      relations: ['project', 'vendor'],
      order: { score: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }
    
    return match;
  }

  async findOneByClient(id: number, clientId: number): Promise<Match> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    
    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    if (match.project.client_id !== clientId) {
      throw new NotFoundException(`Match with ID ${id} not found for this client`);
    }
    
    return match;
  }

  async findByProject(projectId: number): Promise<Match[]> {
    return this.matchesRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }

  async findByProjectAndClient(projectId: number, clientId: number): Promise<Match[]> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, client_id: clientId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found for this client`);
    }

    return this.matchesRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }

  async findByVendor(vendorId: number): Promise<Match[]> {
    return this.matchesRepository.find({
      where: { vendor_id: vendorId },
      relations: ['project'],
      order: { score: 'DESC' },
    });
  }

  async remove(id: number): Promise<void> {
    await this.matchesRepository.delete(id);
  }
}
