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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("../../entities/vendor.entity");
const match_entity_1 = require("../../entities/match.entity");
const project_entity_1 = require("../../entities/project.entity");
let AnalyticsService = class AnalyticsService {
    vendorsRepository;
    matchesRepository;
    projectsRepository;
    constructor(vendorsRepository, matchesRepository, projectsRepository) {
        this.vendorsRepository = vendorsRepository;
        this.matchesRepository = matchesRepository;
        this.projectsRepository = projectsRepository;
    }
    async getTopVendorsByCountry() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const query = `
      SELECT 
        v.id,
        v.name,
        v.rating,
        v.response_sla_hours,
        vc.country_code,
        AVG(m.score) as avg_match_score,
        COUNT(m.id) as total_matches
      FROM vendors v
      INNER JOIN vendor_countries vc ON v.id = vc.vendor_id
      LEFT JOIN matches m ON v.id = m.vendor_id 
        AND m.created_at >= ?
      GROUP BY v.id, vc.country_code
      HAVING avg_match_score > 0
      ORDER BY vc.country_code, avg_match_score DESC
    `;
        const vendors = await this.vendorsRepository.query(query, [thirtyDaysAgo]);
        const result = [];
        const countryGroups = {};
        for (const vendor of vendors) {
            if (!countryGroups[vendor.country_code]) {
                countryGroups[vendor.country_code] = [];
            }
            countryGroups[vendor.country_code].push(vendor);
        }
        for (const [countryCode, countryVendors] of Object.entries(countryGroups)) {
            const top3 = countryVendors.slice(0, 3);
            const expansionProjectsCount = await this.projectsRepository.count({
                where: {
                    country_code: countryCode,
                    status: 'active'
                }
            });
            result.push({
                country_code: countryCode,
                top_vendors: top3.map(v => ({
                    id: v.id,
                    name: v.name,
                    rating: v.rating,
                    response_sla_hours: v.response_sla_hours,
                    avg_match_score: parseFloat(v.avg_match_score),
                    total_matches: parseInt(v.total_matches)
                })),
                expansion_projects_count: expansionProjectsCount
            });
        }
        return result;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(1, (0, typeorm_1.InjectRepository)(match_entity_1.Match)),
    __param(2, (0, typeorm_1.InjectRepository)(project_entity_1.Project)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map