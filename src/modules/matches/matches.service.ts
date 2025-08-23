import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { ApiResponseUtil } from '../../utils/api-response.util';
import { ApiResponse } from '../../types/api-response.types';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<ApiResponse<Match[]>> {
    const matches = await this.matchesRepository.find({
      relations: ['project', 'vendor'],
    });
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches');
    }
    
    return ApiResponseUtil.successWithCount(matches, 'All matches retrieved successfully');
  }

  async findByClientProjects(clientId: number): Promise<ApiResponse<Match[]>> {
    const projects = await this.projectsRepository.find({
      where: { client_id: clientId },
      select: ['id'],
    });
    
    const projectIds = projects.map(p => p.id);
    
    if (projectIds.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No projects found for client ${clientId}`);
    }
    
    const matches = await this.matchesRepository.find({
      where: { project_id: In(projectIds) },
      relations: ['project', 'vendor'],
      order: { score: 'DESC' },
    });
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No matches found for client ${clientId} projects`);
    }
    
    return ApiResponseUtil.successWithCount(matches, `Matches for client ${clientId} retrieved successfully`);
  }

  async findOne(id: number): Promise<ApiResponse<Match>> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    
    if (!match) {
      return ApiResponseUtil.notFound('Match', id);
    }
    
    return ApiResponseUtil.success(match, 'Match retrieved successfully');
  }

  async findOneByClient(id: number, clientId: number): Promise<ApiResponse<Match>> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    
    if (!match) {
      return ApiResponseUtil.notFound('Match', id);
    }

    if (match.project.client_id !== clientId) {
      return ApiResponseUtil.error(`Match with ID ${id} not found for this client`, 'FORBIDDEN');
    }
    
    return ApiResponseUtil.success(match, 'Match retrieved successfully');
  }

  async findByProject(projectId: number): Promise<ApiResponse<Match[]>> {
    const matches = await this.matchesRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No matches found for project ${projectId}`);
    }
    
    return ApiResponseUtil.successWithCount(matches, `Matches for project ${projectId} retrieved successfully`);
  }

  async findByProjectAndClient(projectId: number, clientId: number): Promise<ApiResponse<Match[]>> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId, client_id: clientId },
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', projectId);
    }

    const matches = await this.matchesRepository.find({
      where: { project_id: projectId },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No matches found for project ${projectId}`);
    }
    
    return ApiResponseUtil.successWithCount(matches, `Matches for project ${projectId} retrieved successfully`);
  }

  async findByVendor(vendorId: number): Promise<ApiResponse<Match[]>> {
    const matches = await this.matchesRepository.find({
      where: { vendor_id: vendorId },
      relations: ['project'],
      order: { score: 'DESC' },
    });
    
    if (matches.length === 0) {
      return ApiResponseUtil.emptyList('matches', `No matches found for vendor ${vendorId}`);
    }
    
    return ApiResponseUtil.successWithCount(matches, `Matches for vendor ${vendorId} retrieved successfully`);
  }

  async remove(id: number): Promise<ApiResponse<{ deletedMatchId: number; matchDetails: string }>> {
    const match = await this.matchesRepository.findOne({
      where: { id },
      relations: ['project', 'vendor'],
    });
    
    if (!match) {
      return ApiResponseUtil.notFound('Match', id);
    }
    
    await this.matchesRepository.delete(id);
    
    const matchDetails = `Project: ${match.project_id}, Vendor: ${match.vendor_id}, Score: ${match.score}`;
    
    return ApiResponseUtil.success(
      { 
        deletedMatchId: id, 
        matchDetails 
      },
      `Match with ID ${id} has been successfully deleted`
    );
  }
}
