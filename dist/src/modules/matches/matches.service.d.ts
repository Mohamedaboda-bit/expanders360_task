import { Repository } from 'typeorm';
import { Match } from '../../entities/match.entity';
import { Project } from '../../entities/project.entity';
export declare class MatchesService {
    private matchesRepository;
    private projectsRepository;
    constructor(matchesRepository: Repository<Match>, projectsRepository: Repository<Project>);
    findAll(): Promise<Match[]>;
    findByClientProjects(clientId: number): Promise<Match[]>;
    findOne(id: number): Promise<Match>;
    findOneByClient(id: number, clientId: number): Promise<Match>;
    findByProject(projectId: number): Promise<Match[]>;
    findByProjectAndClient(projectId: number, clientId: number): Promise<Match[]>;
    findByVendor(vendorId: number): Promise<Match[]>;
    remove(id: number): Promise<void>;
}
