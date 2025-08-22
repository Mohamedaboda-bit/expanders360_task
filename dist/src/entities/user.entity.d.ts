import { Client } from './client.entity';
export declare enum UserRole {
    CLIENT = "client",
    ADMIN = "admin"
}
export declare class User {
    id: number;
    email: string;
    password_hash: string;
    role: UserRole;
    client_id: number;
    created_at: Date;
    updated_at: Date;
    client: Client;
}
