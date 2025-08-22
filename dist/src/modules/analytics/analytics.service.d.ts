import { Repository } from 'typeorm';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
import { TopVendorResult } from '../../types/analytics.types';
export declare class AnalyticsService {
    private vendorsRepository;
    private matchesRepository;
    private projectsRepository;
    constructor(vendorsRepository: Repository<Vendor>, matchesRepository: Repository<Match>, projectsRepository: Repository<Project>);
    getTopVendorsByCountry(): Promise<TopVendorResult[]>;
}
