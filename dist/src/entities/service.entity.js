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
exports.Service = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const vendor_entity_1 = require("./vendor.entity");
let Service = class Service {
    id;
    name;
    created_at;
    updated_at;
    projects;
    vendors;
};
exports.Service = Service;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Service.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, unique: true }),
    __metadata("design:type", String)
], Service.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Service.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Service.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => project_entity_1.Project, project => project.services),
    __metadata("design:type", Array)
], Service.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => vendor_entity_1.Vendor, vendor => vendor.services),
    __metadata("design:type", Array)
], Service.prototype, "vendors", void 0);
exports.Service = Service = __decorate([
    (0, typeorm_1.Entity)('services')
], Service);
//# sourceMappingURL=service.entity.js.map