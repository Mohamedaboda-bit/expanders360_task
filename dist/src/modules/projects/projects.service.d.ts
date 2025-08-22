import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Service } from '../../entities/service.entity';
import { Vendor } from '../../entities/vendor.entity';
import { Match } from '../../entities/match.entity';
import { Country } from '../../entities/country.entity';
import { CreateProjectDto } from './dto/createProject.dto';
export declare class ProjectsService {
    private projectsRepository;
    private servicesRepository;
    private vendorsRepository;
    private matchesRepository;
    private countriesRepository;
    constructor(projectsRepository: Repository<Project>, servicesRepository: Repository<Service>, vendorsRepository: Repository<Vendor>, matchesRepository: Repository<Match>, countriesRepository: Repository<Country>);
    findAll(): Promise<Project[]>;
    findByClient(clientId: number): Promise<Project[]>;
    findOne(id: number): Promise<Project>;
    findOneByClient(id: number, clientId: number): Promise<Project>;
    create(projectData: CreateProjectDto): Promise<Project | null>;
    update(id: number, projectData: any): Promise<Project>;
    updateByClient(id: number, projectData: Partial<Project>, clientId: number): Promise<Project>;
    remove(id: number): Promise<void>;
    removeByClient(id: number, clientId: number): Promise<void>;
    rebuildMatches(projectId: number): Promise<Match[]>;
    rebuildMatchesByClient(projectId: number, clientId: number): Promise<Match[]>;
    private calculateMatchScore;
    private validateProjectInputs;
}
