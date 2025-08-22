import { DataSource } from 'typeorm';
export declare class ServicesSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    run(): Promise<void>;
}
