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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../../entities/user.entity");
const client_entity_1 = require("../../entities/client.entity");
let AuthService = class AuthService {
    usersRepository;
    clientsRepository;
    jwtService;
    constructor(usersRepository, clientsRepository, jwtService) {
        this.usersRepository = usersRepository;
        this.clientsRepository = clientsRepository;
        this.jwtService = jwtService;
    }
    async login(loginDto) {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
            relations: ['client'],
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password_hash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                client: user.client,
            },
        };
    }
    async register(registerDto) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const existingClient = await this.clientsRepository.findOne({
            where: { contact_email: registerDto.contact_email },
        });
        if (existingClient) {
            throw new common_1.ConflictException('Client with this contact email already exists');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);
        const client = this.clientsRepository.create({
            company_name: registerDto.company_name,
            contact_email: registerDto.contact_email,
        });
        const savedClient = await this.clientsRepository.save(client);
        const user = this.usersRepository.create({
            email: registerDto.email,
            password_hash: passwordHash,
            role: user_entity_1.UserRole.CLIENT,
            client_id: savedClient.id,
        });
        const savedUser = await this.usersRepository.save(user);
        const payload = {
            sub: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: savedUser.id,
                email: savedUser.email,
                role: savedUser.role,
                client: savedClient,
            },
        };
    }
    async validateToken(token) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(client_entity_1.Client)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map