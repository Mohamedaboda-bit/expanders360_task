import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { Client } from '../../entities/client.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
export declare class AuthService {
    private usersRepository;
    private clientsRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, clientsRepository: Repository<Client>, jwtService: JwtService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
            client: Client;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
            client: Client;
        };
    }>;
    validateToken(token: string): Promise<any>;
}
