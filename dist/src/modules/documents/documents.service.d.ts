export declare class DocumentsService {
    uploadDocument(documentData: any): Promise<any>;
    searchDocuments(query: string, tags?: string[], projectId?: number): Promise<any[]>;
    getDocumentsByProject(projectId: number): Promise<any[]>;
}
