import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from '../../entities/vendor.entity';
import { Service } from '../../entities/service.entity';
import { Country } from '../../entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Service, Country])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {}
