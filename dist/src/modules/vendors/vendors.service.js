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
exports.VendorsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_entity_1 = require("../../entities/vendor.entity");
let VendorsService = class VendorsService {
    vendorsRepository;
    constructor(vendorsRepository) {
        this.vendorsRepository = vendorsRepository;
    }
    async findAll() {
        return this.vendorsRepository.find({
            relations: ['services', 'countries'],
        });
    }
    async findOne(id) {
        const vendor = await this.vendorsRepository.findOne({
            where: { id },
            relations: ['services', 'countries'],
        });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor with ID ${id} not found`);
        }
        return vendor;
    }
    async create(vendorData) {
        const vendor = this.vendorsRepository.create(vendorData);
        return this.vendorsRepository.save(vendor);
    }
    async update(id, vendorData) {
        await this.vendorsRepository.update(id, vendorData);
        return this.findOne(id);
    }
    async remove(id) {
        await this.vendorsRepository.delete(id);
    }
};
exports.VendorsService = VendorsService;
exports.VendorsService = VendorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VendorsService);
//# sourceMappingURL=vendors.service.js.map