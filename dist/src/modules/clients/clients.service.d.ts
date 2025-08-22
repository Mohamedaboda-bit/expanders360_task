import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
export declare class ClientsService {
    private clientsRepository;
    constructor(clientsRepository: Repository<Client>);
    findAll(): Promise<Client[]>;
    findOne(id: number): Promise<Client>;
    create(clientData: Partial<Client>): Promise<Client>;
    update(id: number, clientData: Partial<Client>): Promise<Client>;
    remove(id: number): Promise<void>;
}
