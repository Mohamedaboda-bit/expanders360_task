"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
const typeorm_1 = require("typeorm");
const path = require("path");
const AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    username: process.env.DB_USERNAME || 'expander_user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'expander360',
    entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, 'src/migrations/*{.ts,.js}')],
    synchronize: false,
    logging: false,
});
exports.default = AppDataSource;
//# sourceMappingURL=typeorm.config.js.map