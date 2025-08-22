"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_config_1 = require("../../typeorm.config");
const countries_seeder_1 = require("./countries.seeder");
const services_seeder_1 = require("./services.seeder");
const admin_seeder_1 = require("./admin.seeder");
async function runSeeders() {
    try {
        await typeorm_config_1.default.initialize();
        console.log('🚀 Starting database seeding...\n');
        const countriesSeeder = new countries_seeder_1.CountriesSeeder(typeorm_config_1.default);
        await countriesSeeder.run();
        const servicesSeeder = new services_seeder_1.ServicesSeeder(typeorm_config_1.default);
        await servicesSeeder.run();
        const adminSeeder = new admin_seeder_1.AdminSeeder(typeorm_config_1.default);
        await adminSeeder.run();
        console.log('\n🎉 All seeders completed successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
runSeeders();
//# sourceMappingURL=run-seeders.js.map