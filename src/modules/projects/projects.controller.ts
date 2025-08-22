import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from '../../entities/project.entity';
import { Match } from '../../entities/match.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      createProjectDto['client_id'] = user.clientId;
    }
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findAll(@CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.projectsService.findByClient(user.clientId);
    }
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.projectsService.findOneByClient(id, user.clientId);
    }
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: UpdateProjectDto, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.projectsService.updateByClient(id, updateProjectDto, user.clientId);
    }
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.projectsService.removeByClient(id, user.clientId);
    }
    return this.projectsService.remove(id);
  }

  @Post(':id/matches/rebuild')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  rebuildMatches(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any): Promise<Match[]> {
    if (user.role === UserRole.CLIENT) {
      return this.projectsService.rebuildMatchesByClient(id, user.clientId);
    }
    return this.projectsService.rebuildMatches(id);
  }
}
