import { Project } from './project.entity';
import { Vendor } from './vendor.entity';
export declare class Service {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    projects: Project[];
    vendors: Vendor[];
}
