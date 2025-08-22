import { ProjectsService } from './projects.service';
import { Project } from '../../entities/project.entity';
import { Match } from '../../entities/match.entity';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: CreateProjectDto, user: any): Promise<Project | null>;
    findAll(user: any): Promise<Project[]>;
    findOne(id: number, user: any): Promise<Project>;
    update(id: number, updateProjectDto: UpdateProjectDto, user: any): Promise<Project>;
    remove(id: number, user: any): Promise<void>;
    rebuildMatches(id: number, user: any): Promise<Match[]>;
}
