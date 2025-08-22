"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const project_entity_1 = require("../../entities/project.entity");
const service_entity_1 = require("../../entities/service.entity");
const vendor_entity_1 = require("../../entities/vendor.entity");
const match_entity_1 = require("../../entities/match.entity");
const country_entity_1 = require("../../entities/country.entity");
let ProjectsService = class ProjectsService {
    projectsRepository;
    servicesRepository;
    vendorsRepository;
    matchesRepository;
    countriesRepository;
    constructor(projectsRepository, servicesRepository, vendorsRepository, matchesRepository, countriesRepository) {
        this.projectsRepository = projectsRepository;
        this.servicesRepository = servicesRepository;
        this.vendorsRepository = vendorsRepository;
        this.matchesRepository = matchesRepository;
        this.countriesRepository = countriesRepository;
    }
    async findAll() {
        return this.projectsRepository.find({
            relations: ['client', 'services'],
        });
    }
    async findByClient(clientId) {
        return this.projectsRepository.find({
            where: { client_id: clientId },
            relations: ['client', 'services'],
        });
    }
    async findOne(id) {
        const project = await this.projectsRepository.findOne({
            where: { id },
            relations: ['client', 'services'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }
    async findOneByClient(id, clientId) {
        const project = await this.projectsRepository.findOne({
            where: { id, client_id: clientId },
            relations: ['client', 'services'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${id} not found for this client`);
        }
        return project;
    }
    async create(projectData) {
        await this.validateProjectInputs(projectData.service_ids, projectData.country_code);
        const project = this.projectsRepository.create(projectData);
        const savedProject = await this.projectsRepository.save(project);
        if (projectData.service_ids && projectData.service_ids.length > 0) {
            await this.projectsRepository
                .createQueryBuilder()
                .relation(project_entity_1.Project, 'services')
                .of(savedProject.id)
                .add(projectData.service_ids);
        }
        return await this.projectsRepository.findOne({
            where: { id: savedProject.id },
            relations: ["services"]
        });
    }
    async update(id, projectData) {
        if (projectData.service_ids || projectData.country_code) {
            await this.validateProjectInputs(projectData.service_ids, projectData.country_code);
        }
        await this.projectsRepository.update(id, projectData);
        return this.findOne(id);
    }
    async updateByClient(id, projectData, clientId) {
        const project = await this.findOneByClient(id, clientId);
        await this.projectsRepository.update(id, projectData);
        return this.findOneByClient(id, clientId);
    }
    async remove(id) {
        await this.projectsRepository.delete(id);
    }
    async removeByClient(id, clientId) {
        await this.findOneByClient(id, clientId);
        await this.projectsRepository.delete(id);
    }
    async rebuildMatches(projectId) {
        const project = await this.projectsRepository.findOne({
            where: { id: projectId },
            relations: ['services'],
        });
        if (!project) {
            throw new common_1.NotFoundException(`Project with ID ${projectId} not found`);
        }
        const vendors = await this.vendorsRepository.find({
            relations: ['services', 'countries'],
        });
        const matches = [];
        for (const vendor of vendors) {
            const score = this.calculateMatchScore(project, vendor);
            if (score > 0) {
                const match = this.matchesRepository.create({
                    project_id: projectId,
                    vendor_id: vendor.id,
                    score,
                });
                matches.push(match);
            }
        }
        await this.matchesRepository.save(matches);
        return matches;
    }
    async rebuildMatchesByClient(projectId, clientId) {
        await this.findOneByClient(projectId, clientId);
        return this.rebuildMatches(projectId);
    }
    calculateMatchScore(project, vendor) {
        const vendorCountryCodes = vendor.countries.map(c => c.country_code);
        if (!vendorCountryCodes.includes(project.country_code)) {
            return 0;
        }
        const projectServiceIds = project.services.map(s => s.id);
        const vendorServiceIds = vendor.services.map(s => s.id);
        const serviceOverlap = projectServiceIds.filter(id => vendorServiceIds.includes(id)).length;
        if (serviceOverlap === 0) {
            return 0;
        }
        const slaWeight = Math.max(0, 24 - vendor.response_sla_hours) / 24;
        return serviceOverlap * 2 + vendor.rating + slaWeight;
    }
    async validateProjectInputs(serviceIds, countryCode) {
        if (serviceIds) {
            const foundServices = await this.servicesRepository.find({ where: { id: (0, typeorm_2.In)(serviceIds) } });
            if (foundServices.length !== serviceIds.length) {
                const foundIds = foundServices.map(s => s.id);
                const missing = serviceIds.filter(id => !foundIds.includes(id));
                throw new common_1.BadRequestException(`Invalid service_ids: ${missing.join(', ')}`);
            }
        }
        if (countryCode) {
            const country = await this.countriesRepository.findOne({ where: { country_code: countryCode } });
            if (!country) {
                throw new common_1.BadRequestException(`Invalid country_code: ${countryCode}`);
            }
        }
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __param(1, (0, typeorm_1.InjectRepository)(service_entity_1.Service)),
    __param(2, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(3, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(4, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map