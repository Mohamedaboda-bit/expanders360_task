import { VendorsService } from './vendors.service';
import { Vendor } from '../../entities/vendor.entity';
export declare class VendorsController {
    private readonly vendorsService;
    constructor(vendorsService: VendorsService);
    create(createVendorDto: Partial<Vendor>): Promise<Vendor>;
    findAll(): Promise<Vendor[]>;
    findOne(id: number): Promise<Vendor>;
    update(id: number, updateVendorDto: Partial<Vendor>): Promise<Vendor>;
    remove(id: number): Promise<void>;
}
