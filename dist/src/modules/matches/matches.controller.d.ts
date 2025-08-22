import { MatchesService } from './matches.service';
export declare class MatchesController {
    private readonly matchesService;
    constructor(matchesService: MatchesService);
    findAll(user: any): Promise<import("../../entities").Match[]>;
    findOne(id: number, user: any): Promise<import("../../entities").Match>;
    findByProject(projectId: number, user: any): Promise<import("../../entities").Match[]>;
    findByVendor(vendorId: number): Promise<import("../../entities").Match[]>;
    remove(id: number): Promise<void>;
}
