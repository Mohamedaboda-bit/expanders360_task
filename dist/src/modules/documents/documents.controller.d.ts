import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly documentsService;
    constructor(documentsService: DocumentsService);
    uploadDocument(documentData: any): Promise<any>;
    searchDocuments(query: string, tags?: string, projectId?: string): Promise<any[]>;
    getDocumentsByProject(projectId: number): Promise<any[]>;
}
