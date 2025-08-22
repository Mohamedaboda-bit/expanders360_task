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
exports.ClientOwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
let ClientOwnershipGuard = class ClientOwnershipGuard {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const { user, params } = context.switchToHttp().getRequest();
        if (user.role === 'admin') {
            return true;
        }
        if (user.role === 'client') {
            const resourceId = parseInt(params.id);
            if (user.clientId == resourceId) {
                return true;
            }
        }
        throw new common_1.ForbiddenException('Access denied: You can only access your own data');
    }
};
exports.ClientOwnershipGuard = ClientOwnershipGuard;
exports.ClientOwnershipGuard = ClientOwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], ClientOwnershipGuard);
//# sourceMappingURL=client-ownership.guard.js.map