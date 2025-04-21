import { createApiService, api } from '@/services/api/baseApi';
import type { Image } from '@/interfaces';

const endpoint = '/camera';

export const imagesApi = {
    ...createApiService<Image>(endpoint),

    // Base API methods
    getAll: async () => {
        const response = await api.get<Image[]>(`${endpoint}/`);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<Image>(`${endpoint}/${id}`);
        return response.data;
    },
    post: async (image: Image) => {
        const response = await api.post<Image>(`${endpoint}/`, image);
        return response.data;
    },
    put: async (id: string, image: Image) => {
        const response = await api.put<Image>(`${endpoint}/${id}/`, image);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`${endpoint}/${id}/`);
        if (response.status === 204) {
            // Optionally handle successful deletion (e.g., update state)
            // For example, you could dispatch a delete action to your state management
            // deleteImage(id);
        }
        return response.data;
    },

    // Add image-specific methods
    upload: async (
        file: FormData,
        onUploadProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Image>(`${endpoint}/upload`, file, {
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

    uploadMultiple: async (
        files: FormData,
        onUploadProgress?: (progress: number) => void
    ) => {
        const response = await api.post<Image[]>(
            `${endpoint}/upload-multiple`,
            files,
            {
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
            }
        );
        return response.data;
    },

    getByUserId: async (userId: string) => {
        const response = await api.get<Image[]>(`${endpoint}/user/${userId}`);
        return response.data;
    },

    optimize: async (
        id: string,
        options: { width?: number; height?: number; quality?: number }
    ) => {
        const response = await api.post<Image>(
            `${endpoint}/${id}/optimize`,
            options
        );
        return response.data;
    },
};
