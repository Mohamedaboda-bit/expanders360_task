import { DataSource } from 'typeorm';
export declare class CountriesSeeder {
    private dataSource;
    constructor(dataSource: DataSource);
    run(): Promise<void>;
}
