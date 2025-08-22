import { Client } from './client.entity';
import { Service } from './service.entity';
import { Match } from './match.entity';
import { Country } from './country.entity';
export declare class Project {
    id: number;
    client_id: number;
    country_code: string;
    budget: number;
    status: string;
    created_at: Date;
    updated_at: Date;
    client: Client;
    country: Country;
    services: Service[];
    matches: Match[];
}
