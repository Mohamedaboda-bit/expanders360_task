import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { VendorsModule } from './modules/vendors/vendors.module';
import { MatchesModule } from './modules/matches/matches.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { User } from './entities/user.entity';
import { Client } from './entities/client.entity';
import { Project } from './entities/project.entity';
import { Vendor } from './entities/vendor.entity';
import { Service } from './entities/service.entity';
import { Match } from './entities/match.entity';
import { Country } from './entities/country.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 3306),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Client, Project, Vendor, Service, Match, Country],
        autoLoadEntities: false,
        synchronize: false,
      }),
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/expander360'),
    AuthModule,
    ClientsModule,
    ProjectsModule,
    VendorsModule,
    MatchesModule,
    AnalyticsModule,
    DocumentsModule,
    NotificationsModule,
    SchedulingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
