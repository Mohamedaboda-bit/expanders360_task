import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorsRepository: Repository<Vendor>,
  ) {}

  async findAll(): Promise<Vendor[]> {
    return this.vendorsRepository.find({
      relations: ['services', 'countries'],
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorsRepository.findOne({
      where: { id },
      relations: ['services', 'countries'],
    });
    
    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }
    
    return vendor;
  }

  async create(vendorData: Partial<Vendor>): Promise<Vendor> {
    const vendor = this.vendorsRepository.create(vendorData);
    return this.vendorsRepository.save(vendor);
  }

  async update(id: number, vendorData: Partial<Vendor>): Promise<Vendor> {
    await this.vendorsRepository.update(id, vendorData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.vendorsRepository.delete(id);
  }
}
