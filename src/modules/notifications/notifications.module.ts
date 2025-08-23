import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { Project } from '../../entities/project.entity';
import { Vendor } from '../../entities/vendor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Vendor]),
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
