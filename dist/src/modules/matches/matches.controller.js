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
exports.MatchesController = void 0;
const common_1 = require("@nestjs/common");
const matches_service_1 = require("./matches.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const user_entity_1 = require("../../entities/user.entity");
let MatchesController = class MatchesController {
    matchesService;
    constructor(matchesService) {
        this.matchesService = matchesService;
    }
    findAll(user) {
        if (user.role === user_entity_1.UserRole.CLIENT) {
            return this.matchesService.findByClientProjects(user.clientId);
        }
        return this.matchesService.findAll();
    }
    findOne(id, user) {
        if (user.role === user_entity_1.UserRole.CLIENT) {
            return this.matchesService.findOneByClient(id, user.clientId);
        }
        return this.matchesService.findOne(id);
    }
    findByProject(projectId, user) {
        if (user.role === user_entity_1.UserRole.CLIENT) {
            return this.matchesService.findByProjectAndClient(projectId, user.clientId);
        }
        return this.matchesService.findByProject(projectId);
    }
    findByVendor(vendorId) {
        return this.matchesService.findByVendor(vendorId);
    }
    remove(id) {
        return this.matchesService.remove(id);
    }
};
exports.MatchesController = MatchesController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.CLIENT, user_entity_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.CLIENT, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('project/:projectId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.CLIENT, user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('projectId', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Get)('vendor/:vendorId'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('vendorId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "findByVendor", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MatchesController.prototype, "remove", null);
exports.MatchesController = MatchesController = __decorate([
    (0, common_1.Controller)('matches'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [matches_service_1.MatchesService])
], MatchesController);
//# sourceMappingURL=matches.controller.js.map