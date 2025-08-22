import { Project } from './project.entity';
import { User } from './user.entity';
export declare class Client {
    id: number;
    company_name: string;
    contact_email: string;
    created_at: Date;
    updated_at: Date;
    projects: Project[];
    user: User;
}
