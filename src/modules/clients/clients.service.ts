import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../entities/client.entity';
import { ApiResponseUtil } from '../../utils/api-response.util';
import { ApiResponse } from '../../types/api-response.types';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async findAll(): Promise<ApiResponse<Client[]>> {
    const clients = await this.clientsRepository.find({
      relations: ['projects'],
    });
    
    if (clients.length === 0) {
      return ApiResponseUtil.emptyList('clients');
    }
    
    return ApiResponseUtil.successWithCount(clients, 'All clients retrieved successfully');
  }

  async findOne(id: number): Promise<ApiResponse<Client>> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    
    if (!client) {
      return ApiResponseUtil.notFound('Client', id);
    }
    
    return ApiResponseUtil.success(client, 'Client retrieved successfully');
  }

  async create(clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    const client = this.clientsRepository.create(clientData);
    const savedClient = await this.clientsRepository.save(client);
    const createdClient = await this.clientsRepository.findOne({
      where: { id: savedClient.id },
      relations: ['projects'],
    });
    
    if (!createdClient) {
      return ApiResponseUtil.error('Failed to create client', 'CREATION_FAILED');
    }
    
    return ApiResponseUtil.created(createdClient, 'Client');
  }

  async update(id: number, clientData: Partial<Client>): Promise<ApiResponse<Client>> {
    const existingClient = await this.clientsRepository.findOne({
      where: { id },
    });
    
    if (!existingClient) {
      return ApiResponseUtil.notFound('Client', id);
    }
    
    await this.clientsRepository.update(id, clientData);
    const updatedClient = await this.clientsRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    
    if (!updatedClient) {
      return ApiResponseUtil.error('Failed to retrieve updated client', 'RETRIEVAL_FAILED');
    }
    
    return ApiResponseUtil.updated(updatedClient, 'Client');
  }

  async remove(id: number): Promise<ApiResponse<{ deletedClientId: number; clientName?: string }>> {
    const client = await this.clientsRepository.findOne({
      where: { id },
      relations: ['projects'],
    });
    
    if (!client) {
      return ApiResponseUtil.notFound('Client', id);
    }
    
    await this.clientsRepository.delete(id);
    
    return ApiResponseUtil.success(
      { deletedClientId: id, clientName: client.company_name },
      `Client "${client.company_name}" with ID ${id} has been successfully deleted`
    );
  }
}
