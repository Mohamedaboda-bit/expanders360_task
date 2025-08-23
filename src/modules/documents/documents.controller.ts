import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Query, 
  Param, 
  ParseIntPipe, 
  Delete,
  UseGuards,
  ParseIntPipe as ParseIntPipeDecorator
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/createDocument.dto';
import { SearchDocumentDto } from './dto/searchDocument.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { ApiResponse } from '../../types/api-response.types';
import { DocumentEntity } from './schemas/document.schema';

@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async uploadDocument(
    @Body() createDocumentDto: CreateDocumentDto,
    @CurrentUser() user: any
  ): Promise<ApiResponse<DocumentEntity>> {
    const clientId = user.role === UserRole.CLIENT ? user.clientId : undefined;
    return this.documentsService.uploadDocument(createDocumentDto, clientId);
  }

  @Get('search')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async searchDocuments(
    @Query() searchDto: SearchDocumentDto,
    @CurrentUser() user: any
  ): Promise<ApiResponse<DocumentEntity[]>> {
    const clientId = user.role === UserRole.CLIENT ? user.clientId : undefined;
    return this.documentsService.searchDocuments(searchDto, clientId);
  }

  @Get('project/:projectId')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async getDocumentsByProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @CurrentUser() user: any
  ): Promise<ApiResponse<DocumentEntity[]>> {
    const clientId = user.role === UserRole.CLIENT ? user.clientId : undefined;
    return this.documentsService.getDocumentsByProject(projectId, clientId);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async findOne(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponse<DocumentEntity>> {
    const clientId = user.role === UserRole.CLIENT ? user.clientId : undefined;
    return this.documentsService.findOne(id, clientId);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponse<{ deletedDocumentId: string }>> {
    const clientId = user.role === UserRole.CLIENT ? user.clientId : undefined;
    return this.documentsService.remove(id, clientId);
  }
}
