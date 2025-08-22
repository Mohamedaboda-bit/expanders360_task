"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const clients_module_1 = require("./modules/clients/clients.module");
const projects_module_1 = require("./modules/projects/projects.module");
const vendors_module_1 = require("./modules/vendors/vendors.module");
const matches_module_1 = require("./modules/matches/matches.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const documents_module_1 = require("./modules/documents/documents.module");
const user_entity_1 = require("./entities/user.entity");
const client_entity_1 = require("./entities/client.entity");
const project_entity_1 = require("./entities/project.entity");
const vendor_entity_1 = require("./entities/vendor.entity");
const service_entity_1 = require("./entities/service.entity");
const match_entity_1 = require("./entities/match.entity");
const country_entity_1 = require("./entities/country.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                useFactory: () => ({
                    type: 'mysql',
                    host: process.env.DB_HOST,
                    port: Number(process.env.DB_PORT || 3306),
                    username: process.env.DB_USERNAME,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                    entities: [user_entity_1.User, client_entity_1.Client, project_entity_1.Project, vendor_entity_1.Vendor, service_entity_1.Service, match_entity_1.Match, country_entity_1.Country],
                    autoLoadEntities: false,
                    synchronize: false,
                }),
            }),
            auth_module_1.AuthModule,
            clients_module_1.ClientsModule,
            projects_module_1.ProjectsModule,
            vendors_module_1.VendorsModule,
            matches_module_1.MatchesModule,
            analytics_module_1.AnalyticsModule,
            documents_module_1.DocumentsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map