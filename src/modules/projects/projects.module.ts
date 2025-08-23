import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../../entities/project.entity';
import { Service } from '../../entities/service.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Country } from '../../entities/country.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Service, Vendor, Match, Country]),
    NotificationsModule,
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
