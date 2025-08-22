import { Service } from './service.entity';
import { Match } from './match.entity';
import { Country } from './country.entity';
export declare class Vendor {
    id: number;
    name: string;
    rating: number;
    response_sla_hours: number;
    created_at: Date;
    updated_at: Date;
    services: Service[];
    countries: Country[];
    matches: Match[];
}
