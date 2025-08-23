import { Controller, Get, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../../entities/user.entity';
import { ApiResponse } from '../../types/api-response.types';
import { TopVendorResult } from '../../types/analytics.types';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('top-vendors')
  @Roles(UserRole.ADMIN)
  getTopVendorsByCountry(): Promise<ApiResponse<TopVendorResult[]>> {
    return this.analyticsService.getTopVendorsByCountry();
  }
}
