import { Project } from './project.entity';
import { Vendor } from './vendor.entity';
export declare class Match {
    id: number;
    project_id: number;
    vendor_id: number;
    score: number;
    created_at: Date;
    updated_at: Date;
    project: Project;
    vendor: Vendor;
}
