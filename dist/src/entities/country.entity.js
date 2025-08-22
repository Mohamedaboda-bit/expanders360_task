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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const project_entity_1 = require("./project.entity");
const vendor_entity_1 = require("./vendor.entity");
let Country = class Country {
    country_code;
    country_name;
    created_at;
    updated_at;
    projects;
    vendors;
};
exports.Country = Country;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'char', length: 2 }),
    __metadata("design:type", String)
], Country.prototype, "country_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], Country.prototype, "country_name", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Country.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Country.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => project_entity_1.Project, project => project.country),
    __metadata("design:type", Array)
], Country.prototype, "projects", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => vendor_entity_1.Vendor, vendor => vendor.countries),
    __metadata("design:type", Array)
], Country.prototype, "vendors", void 0);
exports.Country = Country = __decorate([
    (0, typeorm_1.Entity)('countries')
], Country);
//# sourceMappingURL=country.entity.js.map