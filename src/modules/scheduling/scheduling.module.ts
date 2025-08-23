import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulingService } from './scheduling.service';
import { Project } from '../../entities/project.entity';
import { Vendor } from '../../entities/vendor.entity';
import { ProjectsModule } from '../projects/projects.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Project, Vendor]),
    ProjectsModule,
    NotificationsModule,
  ],
  providers: [SchedulingService],
})
export class SchedulingModule {}
