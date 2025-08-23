import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Repository } from 'typeorm';
import { DocumentEntity, DocumentDocument } from './schemas/document.schema';
import { Project } from '../../entities/project.entity';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { SearchDocumentDto } from './dto/searchDocument.dto';
import { ApiResponseUtil } from '../../utils/api-response.util';
import { ApiResponse } from '../../types/api-response.types';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(DocumentEntity.name)
    private documentModel: Model<DocumentDocument>,
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async uploadDocument(documentData: CreateDocumentDto, clientId?: number): Promise<ApiResponse<DocumentEntity>> {
    const project = await this.projectsRepository.findOne({
      where: { id: documentData.projectId },
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', documentData.projectId);
    }

    if (clientId && project.client_id !== clientId) {
      return ApiResponseUtil.error(
        `Project ${documentData.projectId} does not belong to this client`,
        'FORBIDDEN'
      );
    }

    const document = new this.documentModel({
      title: documentData.title,
      content: documentData.content,
      tags: documentData.tags || [],
      projectId: documentData.projectId,
      metadata: documentData.metadata || {},
    });

    const savedDocument = await document.save();
    return ApiResponseUtil.created(savedDocument, 'Document');
  }

  async searchDocuments(
    searchDto: SearchDocumentDto,
    clientId?: number
  ): Promise<ApiResponse<DocumentEntity[]>> {
    const { query, tags, projectId, limit = 10, offset = 0 } = searchDto;

    const conditions: any = {};

    if (clientId) {
      const clientProjects = await this.projectsRepository.find({
        where: { client_id: clientId },
        select: ['id'],
      });
      
      if (clientProjects.length === 0) {
        return ApiResponseUtil.emptyList('documents', 'No projects found for this client');
      }
      
      const clientProjectIds = clientProjects.map(p => p.id);
      conditions.projectId = { $in: clientProjectIds };
    }

    if (projectId) {
      if (clientId) {
        const project = await this.projectsRepository.findOne({
          where: { id: projectId, client_id: clientId },
        });
        
        if (!project) {
          return ApiResponseUtil.error(
            `Project ${projectId} not found or does not belong to this client`,
            'FORBIDDEN'
          );
        }
      }
      conditions.projectId = projectId;
    }

    if (tags && tags.length > 0) {
      conditions.tags = { $in: tags };
    }

    let searchQuery = this.documentModel.find(conditions);

    if (query && query.trim()) {
      searchQuery = this.documentModel.find({
        $and: [
          conditions,
          {
            $text: { $search: query.trim() }
          }
        ]
      });
    }

    searchQuery = searchQuery.limit(limit).skip(offset).sort({ createdAt: -1 });

    const documents = await searchQuery.exec();

    if (documents.length === 0) {
      return ApiResponseUtil.emptyList('documents', 'No documents found matching the criteria');
    }

    return ApiResponseUtil.successWithCount(documents, 'Documents retrieved successfully');
  }

  async getDocumentsByProject(
    projectId: number,
    clientId?: number
  ): Promise<ApiResponse<DocumentEntity[]>> {
    const project = await this.projectsRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      return ApiResponseUtil.notFound('Project', projectId);
    }

    if (clientId && project.client_id !== clientId) {
      return ApiResponseUtil.error(
        `Project ${projectId} does not belong to this client`,
        'FORBIDDEN'
      );
    }

    const documents = await this.documentModel
      .find({ projectId })
      .sort({ createdAt: -1 })
      .exec();

    if (documents.length === 0) {
      return ApiResponseUtil.emptyList('documents', `No documents found for project ${projectId}`);
    }

    return ApiResponseUtil.successWithCount(documents, `Documents for project ${projectId} retrieved successfully`);
  }

  async findOne(id: string, clientId?: number): Promise<ApiResponse<DocumentEntity>> {
    const document = await this.documentModel.findById(id).exec();

    if (!document) {
      return ApiResponseUtil.notFound('Document', id);
    }

    if (clientId) {
      const project = await this.projectsRepository.findOne({
        where: { id: document.projectId, client_id: clientId },
      });

      if (!project) {
        return ApiResponseUtil.error(
          `Document does not belong to this client`,
          'FORBIDDEN'
        );
      }
    }

    return ApiResponseUtil.success(document, 'Document retrieved successfully');
  }

  async remove(id: string, clientId?: number): Promise<ApiResponse<{ deletedDocumentId: string }>> {
    const document = await this.documentModel.findById(id).exec();

    if (!document) {
      return ApiResponseUtil.notFound('Document', id);
    }

    if (clientId) {
      const project = await this.projectsRepository.findOne({
        where: { id: document.projectId, client_id: clientId },
      });

      if (!project) {
        return ApiResponseUtil.error(
          `Document does not belong to this client`,
          'FORBIDDEN'
        );
      }
    }

    await this.documentModel.findByIdAndDelete(id).exec();

    return ApiResponseUtil.success(
      { deletedDocumentId: id },
      `Document "${document.title}" has been successfully deleted`
    );
  }

  async getDocumentsCountByProject(projectId: number): Promise<number> {
    return await this.documentModel.countDocuments({ projectId }).exec();
  }
}
