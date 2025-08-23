import { DataSource } from 'typeorm';

export class VendorsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const vendors = [
      {
        name: 'TechCorp Solutions',
        rating: 4.5,
        response_sla_hours: 4,
        countries: ['US', 'CA', 'UK'],
        services: ['Software Development', 'Web Development', 'Mobile App Development', 'UI/UX Design']
      },
      {
        name: 'Digital Dynamics',
        rating: 4.2,
        response_sla_hours: 6,
        countries: ['US', 'DE', 'FR'],
        services: ['Digital Marketing', 'SEO Optimization', 'Content Creation', 'Social Media Management']
      },
      {
        name: 'CloudTech Pro',
        rating: 4.8,
        response_sla_hours: 2,
        countries: ['US', 'CA', 'AU', 'SG'],
        services: ['Cloud Infrastructure', 'DevOps Services', 'System Integration', 'API Development']
      },
      {
        name: 'DataFlow Analytics',
        rating: 4.3,
        response_sla_hours: 8,
        countries: ['UK', 'DE', 'NL'],
        services: ['Data Analytics', 'Machine Learning', 'Performance Optimization', 'Database Design']
      },
      {
        name: 'SecureNet Systems',
        rating: 4.7,
        response_sla_hours: 3,
        countries: ['US', 'UK', 'DE', 'JP'],
        services: ['Cybersecurity', 'Network Administration', 'Hardware Support', 'Technical Support']
      },
      {
        name: 'E-Commerce Experts',
        rating: 4.1,
        response_sla_hours: 12,
        countries: ['US', 'CA', 'UK', 'AU'],
        services: ['E-commerce Development', 'Web Development', 'Digital Marketing', 'Content Creation']
      },
      {
        name: 'Mobile Masters',
        rating: 4.4,
        response_sla_hours: 5,
        countries: ['US', 'CA', 'UK', 'DE'],
        services: ['Mobile App Development', 'UI/UX Design', 'Software Development', 'Quality Assurance']
      },
      {
        name: 'IT Consulting Plus',
        rating: 4.6,
        response_sla_hours: 4,
        countries: ['US', 'UK', 'DE', 'FR', 'CA'],
        services: ['IT Consulting', 'Project Management', 'Business Analysis', 'Training & Workshops']
      },
      {
        name: 'Testing Titans',
        rating: 4.0,
        response_sla_hours: 10,
        countries: ['US', 'UK', 'IN'],
        services: ['Software Testing', 'Quality Assurance', 'Performance Optimization', 'Technical Support']
      },
      {
        name: 'Innovation Hub',
        rating: 4.9,
        response_sla_hours: 1,
        countries: ['US', 'CA', 'UK', 'DE', 'AU'],
        services: ['Machine Learning', 'Data Analytics', 'Custom Software Solutions', 'System Integration']
      }
    ];

    for (const vendor of vendors) {
      const { countries, services, ...vendorData } = vendor;
      
      const result = await this.dataSource.query(
        'INSERT INTO vendors (name, rating, response_sla_hours) VALUES (?, ?, ?)',
        [vendorData.name, vendorData.rating, vendorData.response_sla_hours]
      );
      
      const vendorId = result.insertId;

      for (const countryCode of countries) {
        await this.dataSource.query(
          'INSERT IGNORE INTO vendor_countries (vendor_id, country_code) VALUES (?, ?)',
          [vendorId, countryCode]
        );
      }

      for (const serviceName of services) {
        const serviceResult = await this.dataSource.query(
          'SELECT id FROM services WHERE name = ?',
          [serviceName]
        );
        
        if (serviceResult.length > 0) {
          await this.dataSource.query(
            'INSERT IGNORE INTO vendor_services (vendor_id, service_id) VALUES (?, ?)',
            [vendorId, serviceResult[0].id]
          );
        }
      }
    }

    console.log(`✅ Seeded ${vendors.length} vendors with their countries and services`);
  }
}
