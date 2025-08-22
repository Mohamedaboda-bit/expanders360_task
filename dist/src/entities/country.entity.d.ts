import { Project } from './project.entity';
import { Vendor } from './vendor.entity';
export declare class Country {
    country_code: string;
    country_name: string;
    created_at: Date;
    updated_at: Date;
    projects: Project[];
    vendors: Vendor[];
}
