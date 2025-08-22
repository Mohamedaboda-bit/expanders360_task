import { Controller, Post, Get, Body, Query, Param, ParseIntPipe } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  uploadDocument(@Body() documentData: any) {
    return this.documentsService.uploadDocument(documentData);
  }

  @Get('search')
  searchDocuments(
    @Query('q') query: string,
    @Query('tags') tags?: string,
    @Query('projectId') projectId?: string,
  ) {
    const tagArray = tags ? tags.split(',') : undefined;
    const projectIdNum = projectId ? parseInt(projectId) : undefined;
    return this.documentsService.searchDocuments(query, tagArray, projectIdNum);
  }

  @Get('project/:projectId')
  getDocumentsByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.documentsService.getDocumentsByProject(projectId);
  }
}
