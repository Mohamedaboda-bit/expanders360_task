import { DataSource } from 'typeorm';
export declare class AdminSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    run(): Promise<void>;
}
