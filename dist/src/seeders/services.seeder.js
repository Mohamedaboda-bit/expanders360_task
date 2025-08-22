"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesSeeder = void 0;
class ServicesSeeder {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async run() {
        const services = [
            'Software Development',
            'Web Development',
            'Mobile App Development',
            'UI/UX Design',
            'Digital Marketing',
            'SEO Optimization',
            'Content Creation',
            'Social Media Management',
            'E-commerce Development',
            'Cloud Infrastructure',
            'DevOps Services',
            'Data Analytics',
            'Machine Learning',
            'Cybersecurity',
            'IT Consulting',
            'Project Management',
            'Quality Assurance',
            'Technical Support',
            'Training & Workshops',
            'Business Analysis',
            'System Integration',
            'API Development',
            'Database Design',
            'Network Administration',
            'Hardware Support',
            'Software Testing',
            'Performance Optimization',
            'Migration Services',
            'Maintenance & Support',
            'Custom Software Solutions'
        ];
        for (const service of services) {
            await this.dataSource.query('INSERT IGNORE INTO services (name) VALUES (?)', [service]);
        }
        console.log(`✅ Seeded ${services.length} services`);
    }
}
exports.ServicesSeeder = ServicesSeeder;
//# sourceMappingURL=services.seeder.js.map