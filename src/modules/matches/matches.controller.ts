import { Controller, Get, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UserRole } from '../../entities/user.entity';

@Controller('matches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findAll(@CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.matchesService.findByClientProjects(user.clientId);
    }
    return this.matchesService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.matchesService.findOneByClient(id, user.clientId);
    }
    return this.matchesService.findOne(id);
  }

  @Get('project/:projectId')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  findByProject(@Param('projectId', ParseIntPipe) projectId: number, @CurrentUser() user: any) {
    if (user.role === UserRole.CLIENT) {
      return this.matchesService.findByProjectAndClient(projectId, user.clientId);
    }
    return this.matchesService.findByProject(projectId);
  }

  @Get('vendor/:vendorId')
  @Roles(UserRole.ADMIN)
  findByVendor(@Param('vendorId', ParseIntPipe) vendorId: number) {
    return this.matchesService.findByVendor(vendorId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.matchesService.remove(id);
  }
}
