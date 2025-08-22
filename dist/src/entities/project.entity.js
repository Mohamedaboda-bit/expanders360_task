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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const client_entity_1 = require("./client.entity");
const service_entity_1 = require("./service.entity");
const match_entity_1 = require("./match.entity");
const country_entity_1 = require("./country.entity");
let Project = class Project {
    id;
    client_id;
    country_code;
    budget;
    status;
    created_at;
    updated_at;
    client;
    country;
    services;
    matches;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Project.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Project.prototype, "client_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 2 }),
    __metadata("design:type", String)
], Project.prototype, "country_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Project.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['active', 'paused', 'completed', 'cancelled'], default: 'active' }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Project.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => client_entity_1.Client, client => client.projects),
    (0, typeorm_1.JoinColumn)({ name: 'client_id' }),
    __metadata("design:type", client_entity_1.Client)
], Project.prototype, "client", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, country => country.projects),
    (0, typeorm_1.JoinColumn)({ name: 'country_code', referencedColumnName: 'country_code' }),
    __metadata("design:type", country_entity_1.Country)
], Project.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.Service, service => service.projects),
    (0, typeorm_1.JoinTable)({
        name: 'project_services',
        joinColumn: { name: 'project_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], Project.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, match => match.project),
    __metadata("design:type", Array)
], Project.prototype, "matches", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)('projects')
], Project);
//# sourceMappingURL=project.entity.js.map