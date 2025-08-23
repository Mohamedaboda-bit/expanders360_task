import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { DocumentEntity, DocumentSchema } from '../documents/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor, Match, Project]),
    MongooseModule.forFeature([
      { name: DocumentEntity.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
