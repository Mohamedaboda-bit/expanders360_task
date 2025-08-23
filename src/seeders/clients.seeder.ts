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
      const clientRepo = this.dataSource.getRepository(Client);
      const existingClient = await clientRepo.findOne({
        where: { contact_email: clientData.contact_email }
      });

      let client: Client;
      if (existingClient) {
        existingClient.company_name = clientData.company_name;
        client = await clientRepo.save(existingClient);
      } else {
        client = await clientRepo.save({
          company_name: clientData.company_name,
          contact_email: clientData.contact_email
        });
      }

      const userRepo = this.dataSource.getRepository(User);
      const existingUser = await userRepo.findOne({
        where: { email: clientData.user_email }
      });

      if (existingUser) {
        existingUser.password_hash = await bcrypt.hash(clientData.password, 10);
        existingUser.client_id = client.id;
        await userRepo.save(existingUser);
      } else {
        await userRepo.save({
          email: clientData.user_email,
          password_hash: await bcrypt.hash(clientData.password, 10),
          role: UserRole.CLIENT,
          client_id: client.id
        });
      }
    }

    console.log('✅ Clients seeded successfully');
  }
}