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
exports.Vendor = void 0;
const typeorm_1 = require("typeorm");
const service_entity_1 = require("./service.entity");
const match_entity_1 = require("./match.entity");
const country_entity_1 = require("./country.entity");
let Vendor = class Vendor {
    id;
    name;
    rating;
    response_sla_hours;
    created_at;
    updated_at;
    services;
    countries;
    matches;
};
exports.Vendor = Vendor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'bigint', unsigned: true }),
    __metadata("design:type", Number)
], Vendor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Vendor.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, default: 0.00 }),
    __metadata("design:type", Number)
], Vendor.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', unsigned: true, default: 0 }),
    __metadata("design:type", Number)
], Vendor.prototype, "response_sla_hours", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Vendor.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Vendor.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => service_entity_1.Service, service => service.vendors),
    (0, typeorm_1.JoinTable)({
        name: 'vendor_services',
        joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'service_id', referencedColumnName: 'id' }
    }),
    __metadata("design:type", Array)
], Vendor.prototype, "services", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => country_entity_1.Country, country => country.vendors),
    (0, typeorm_1.JoinTable)({
        name: 'vendor_countries',
        joinColumn: { name: 'vendor_id', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'country_code', referencedColumnName: 'country_code' }
    }),
    __metadata("design:type", Array)
], Vendor.prototype, "countries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => match_entity_1.Match, match => match.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "matches", void 0);
exports.Vendor = Vendor = __decorate([
    (0, typeorm_1.Entity)('vendors')
], Vendor);
//# sourceMappingURL=vendor.entity.js.map