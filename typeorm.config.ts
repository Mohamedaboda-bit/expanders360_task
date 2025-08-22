import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import * as path from 'path';

const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME || 'expander_user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'expander360',
  entities: [path.join(__dirname, 'src/**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, 'src/migrations/*{.ts,.js}')],
  synchronize: false,
  logging: false,
});

export default AppDataSource;


