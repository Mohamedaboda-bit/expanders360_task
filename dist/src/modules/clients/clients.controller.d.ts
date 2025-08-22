import { ClientsService } from './clients.service';
import { Client } from '../../entities/client.entity';
import { UpdateClientDto } from './dto/updateClient.dto';
export declare class ClientsController {
    private readonly clientsService;
    constructor(clientsService: ClientsService);
    create(createClientDto: Partial<Client>): Promise<Client>;
    findAll(): Promise<Client[]>;
    findOne(id: number, user: any): Promise<Client>;
    update(id: number, updateClientDto: UpdateClientDto): Promise<Client>;
    remove(id: number): Promise<void>;
}
