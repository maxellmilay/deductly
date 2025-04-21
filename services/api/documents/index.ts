import { createApiService, api } from '@/services/api/baseApi';
import type { Document } from '@/interfaces';
import { deleteDocument } from '@/contexts/actions/documentsActions';

const endpoint = '/document';

// Extend the base API service with document-specific methods
export const documentsApi = {
    ...createApiService<Document>(endpoint),
    
    getAll: async (id: string) => {
        const response = await api.get(`${endpoint}/`);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`${endpoint}/${id}`);
        return response.data;
    },

    postDocument: async (document: Document) => {
        // Document: {
        //  "title": "string",
        //  "document_url": "string",
        //  "user": "integer",
        //  "type": "string" // One of: "RECEIPT", "INVOICE", "OTHER"
        // }
        const response = await api.post<Document>(`${endpoint}/`, document);
        return response.data;
    },

    deleteDocument: async (id: string) => {
        const response = await api.delete(`${endpoint}/${id}`);
        if (response.status === 204) {
            // Dispatch the delete action to update the state
            deleteDocument(id);
        }
        return response.data;
    },

    // Add document-specific methods
    upload: async (
        file: FormData,
        onUploadProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Document>(`${endpoint}/upload`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onUploadProgress) {
                    const progress =
                        (progressEvent.loaded / progressEvent.total) * 100;
                    onUploadProgress(progress);
                }
            },
        });
        return response.data;
    },

    download: async (id: string) => {
        const response = await api.get(`${endpoint}/${id}/download`, {
            responseType: 'blob',
        });
        return response.data;
    },

    share: async (id: string, userIds: string[]) => {
        const response = await api.post(`${endpoint}/${id}/share`, { userIds });
        return response.data;
    },
};
