import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { Vendor } from '../../entities/vendor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Match, Project, Vendor])],
  controllers: [MatchesController],
  providers: [MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
