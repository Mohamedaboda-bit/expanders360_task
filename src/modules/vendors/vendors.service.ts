import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Service } from '../../entities/service.entity';
import { Country } from '../../entities/country.entity';
import { CreateVendorDto } from './dto/createVendor.dto';
import { UpdateVendorDto } from './dto/updateVendor.dto';
import { ApiResponseUtil } from '../../utils/api-response.util';
import { ApiResponse } from '../../types/api-response.types';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
    @InjectRepository(Country)
    private countriesRepository: Repository<Country>,
  ) {}

  async findAll(): Promise<ApiResponse<Vendor[]>> {
    const vendors = await this.vendorsRepository.find({
      relations: ['services', 'countries'],
    });
    
    if (vendors.length === 0) {
      return ApiResponseUtil.emptyList('vendors');
    }
    
    return ApiResponseUtil.successWithCount(vendors, 'All vendors retrieved successfully');
  }

  async findOne(id: number): Promise<ApiResponse<Vendor>> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['services', 'countries'],
    });
    
    if (!vendor) {
      return ApiResponseUtil.notFound('Vendor', id);
    }
    
    return ApiResponseUtil.success(vendor, 'Vendor retrieved successfully');
  }

  async create(vendorData: CreateVendorDto): Promise<ApiResponse<Vendor>> {
    await this.validateVendorInputs(vendorData.service_ids, vendorData.country_codes);
    
    const services = await this.servicesRepository.find({
      where: vendorData.service_ids.map((id: number) => ({ id })),
    });
    
    const countries = await this.countriesRepository.find({
      where: vendorData.country_codes.map((code: string) => ({ country_code: code.toUpperCase() })),
    });

    const vendor = this.vendorsRepository.create({
      name: vendorData.name,
      rating: vendorData.rating,
      response_sla_hours: vendorData.response_sla_hours,
      services,
      countries,
    });

    const savedVendor = await this.vendorsRepository.save(vendor);
    const createdVendor = await this.vendorsRepository.findOne({
      where: { id: savedVendor.id },
      relations: ['services', 'countries'],
    });
    
    if (!createdVendor) {
      return ApiResponseUtil.error('Failed to create vendor', 'CREATION_FAILED');
    }
    
    return ApiResponseUtil.created(createdVendor, 'Vendor');
  }

  async update(id: number, vendorData: UpdateVendorDto): Promise<ApiResponse<Vendor>> {
    if (vendorData.service_ids || vendorData.country_codes) {
      await this.validateVendorInputs(vendorData.service_ids, vendorData.country_codes);
    }

    const { service_ids, country_codes, ...scalarFields } = vendorData;
    
    await this.vendorsRepository.update(id, scalarFields);

    if (service_ids) {
      await this.vendorsRepository
        .createQueryBuilder()
        .relation(Vendor, 'services')
        .of(id)
        .remove(await this.vendorsRepository
          .createQueryBuilder()
          .relation(Vendor, 'services')
          .of(id)
          .loadMany());
      await this.vendorsRepository
        .createQueryBuilder()
        .relation(Vendor, 'services')
        .of(id)
        .add(service_ids);
    }

    if (country_codes) {
      await this.vendorsRepository
        .createQueryBuilder()
        .relation(Vendor, 'countries')
        .of(id)
        .remove(await this.vendorsRepository
          .createQueryBuilder()
          .relation(Vendor, 'countries')
          .of(id)
          .loadMany());
      await this.vendorsRepository
        .createQueryBuilder()
        .relation(Vendor, 'countries')
        .of(id)
        .add(country_codes.map((code: string) => code.toUpperCase()));
    }

    const updatedVendor = await this.findOne(id);
    if (!updatedVendor.success) {
      return updatedVendor;
    }
    return ApiResponseUtil.updated(updatedVendor.data, 'Vendor');
  }

  async remove(id: number): Promise<ApiResponse<{ deletedVendorId: number; vendorName: string }>> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['services', 'countries'],
    });
    
    if (!vendor) {
      return ApiResponseUtil.notFound('Vendor', id);
    }
    
    await this.vendorsRepository.delete(id);
    
    return ApiResponseUtil.success(
      { deletedVendorId: id, vendorName: vendor.name },
      `Vendor "${vendor.name}" with ID ${id} has been successfully deleted`
    );
  }

  private async validateVendorInputs(serviceIds?: number[], countryCodes?: string[]) {
    if (serviceIds) {
      const foundServices = await this.servicesRepository.find({
        where: serviceIds.map((id: number) => ({ id })),
      });
      if (foundServices.length !== serviceIds.length) {
        const foundIds = foundServices.map((s) => s.id);
        const missing = serviceIds.filter((id) => !foundIds.includes(id));
        throw new BadRequestException(
          `Invalid service_ids: ${missing.join(', ')}`,
        );
      }
    }
    
    if (countryCodes) {
      const foundCountries = await this.countriesRepository.find({
        where: countryCodes.map((code: string) => ({ country_code: code.toUpperCase() })),
      });
      if (foundCountries.length !== countryCodes.length) {
        const foundCodes = foundCountries.map((c) => c.country_code);
        const missing = countryCodes.filter((code) => !foundCodes.includes(code.toUpperCase()));
        throw new BadRequestException(
          `Invalid country_codes: ${missing.join(', ')}`,
        );
      }
    }
  }
}
