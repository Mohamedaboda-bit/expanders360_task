import { DataSource } from 'typeorm';
import { Client } from '../entities/client.entity';
import { User, UserRole } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

export class ClientsSeeder {
  constructor(private dataSource: DataSource) {}

  async run() {
    const clientsData = [
      { 
        company_name: 'Tech Solutions Inc', 
        contact_email: 'contact@techsolutions.com',
        user_email: 'user@techsolutions.com',
        password: 'TechPass123!'
      },
      { 
        company_name: 'Global Innovations', 
        contact_email: 'contact@globalinnovations.net',
        user_email: 'user@globalinnovations.net',
        password: 'GlobalPass123!'
      },
      { 
        company_name: 'Digital Enterprises', 
        contact_email: 'contact@digitalenterprises.org',
        user_email: 'user@digitalenterprises.org',
        password: 'DigitalPass123!'
      },
      { 
        company_name: 'Smart Systems Ltd', 
        contact_email: 'contact@smartsystems.co',
        user_email: 'user@smartsystems.co',
        password: 'SmartPass123!'
      },
      { 
        company_name: 'Future Technologies', 
        contact_email: 'contact@futuretech.com',
        user_email: 'user@futuretech.com',
        password: 'FuturePass123!'
      },
    ];

    console.log('🏢 Seeding clients and their users...');
    
    for (const clientData of clientsData) {
      // Create client
      const client = new Client();
      client.company_name = clientData.company_name;
      client.contact_email = clientData.contact_email;
      
      await this.dataSource.getRepository(Client).save(client);

      // Create user for this client
      const user = new User();
      user.email = clientData.user_email;
      user.password_hash = await bcrypt.hash(clientData.password, 10);
      user.role = UserRole.CLIENT;
      user.client_id = client.id;
      
      await this.dataSource.getRepository(User).save(user);
    }

    console.log('✅ Clients seeded successfully');
  }
}