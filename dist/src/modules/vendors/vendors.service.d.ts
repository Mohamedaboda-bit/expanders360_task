import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
export declare class VendorsService {
    private vendorsRepository;
    constructor(vendorsRepository: Repository<Vendor>);
    findAll(): Promise<Vendor[]>;
    findOne(id: number): Promise<Vendor>;
    create(vendorData: Partial<Vendor>): Promise<Vendor>;
    update(id: number, vendorData: Partial<Vendor>): Promise<Vendor>;
    remove(id: number): Promise<void>;
}
