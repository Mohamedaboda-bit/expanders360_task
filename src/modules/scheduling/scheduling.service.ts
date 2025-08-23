import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThanOrEqual } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Vendor, VendorSLAStatus } from '../../entities/vendor.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class SchedulingService {
  private readonly logger = new Logger(SchedulingService.name);

  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    private projectsService: ProjectsService,
  ) {}

  @Cron('0 0 0 * * *')
  async refreshActiveProjectMatches() {
    this.logger.log('🔄 Starting daily match refresh cycle...');
    const startTime = Date.now();

    try {
      const activeProjects = await this.projectsRepository.find({
        where: { status: 'active' },
        relations: ['client'],
      });

      this.logger.log(`Found ${activeProjects.length} active projects to process`);

      for (const project of activeProjects) {
        this.logger.log(
          `Processing project ${project.id} for client ${project.client.company_name}`
        );
        
        const result = await this.projectsService.rebuildMatches(project.id);
        if (result.success) {
          this.logger.log(
            `✅ Generated ${result.data.length} matches for project ${project.id}`
          );
        } else {
          this.logger.warn(
            `⚠️ Failed to generate matches for project ${project.id}: ${result.message}`
          );
        }
      }

      const duration = (Date.now() - startTime) / 1000;
      this.logger.log(
        `✅ Completed match refresh cycle in ${duration.toFixed(2)} seconds`
      );
    } catch (error) {
      this.logger.error('❌ Error in match refresh cycle:', error.stack);
    }
  }

  @Cron('0 */15 * * * *')
  async checkVendorSLAs() {
    this.logger.log('🕒 Starting vendor SLA check...');
    const startTime = Date.now();

    try {
      const slaThreshold = 24;
      
      const expiredVendors = await this.vendorsRepository.find({
        where: {
          response_sla_hours: MoreThan(slaThreshold),
          sla_status: VendorSLAStatus.ACTIVE,
        },
      });

      if (expiredVendors.length > 0) {
        await this.vendorsRepository.update(
          expiredVendors.map(v => v.id),
          { sla_status: VendorSLAStatus.EXPIRED }
        );
        this.logger.warn(
          `⚠️ Marked ${expiredVendors.length} vendors as SLA expired`
        );
      }

      const reactivationResult = await this.vendorsRepository.update(
        {
          response_sla_hours: LessThanOrEqual(slaThreshold),
          sla_status: VendorSLAStatus.EXPIRED,
        },
        { sla_status: VendorSLAStatus.ACTIVE }
      );

      if (reactivationResult.affected && reactivationResult.affected > 0) {
        this.logger.log(
          `✅ Reactivated ${reactivationResult.affected} vendors that are now within SLA threshold`
        );
      }

      const duration = (Date.now() - startTime) / 1000;
      this.logger.log(
        `✅ Completed SLA check in ${duration.toFixed(2)} seconds`
      );
    } catch (error) {
      this.logger.error('❌ Error in SLA check:', error.stack);
    }
  }
}
