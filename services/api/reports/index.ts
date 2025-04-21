import { createApiService, api } from '@/services/api/baseApi';
import type { Report } from '@/interfaces';

const endpoint = '/report';

export const reportsApi = {
    ...createApiService<Report>(endpoint),

    // Base API methods
    getAll: async () => {
        const response = await api.get<Report[]>(`${endpoint}/`);
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get<Report>(`${endpoint}/${id}`);
        return response.data;
    },
    post: async (report: Report) => {
        const response = await api.post<Report>(`${endpoint}/`, report);
        return response.data;
    },
    put: async (id: string, report: Report) => {
        const response = await api.put<Report>(`${endpoint}/${id}/`, report);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`${endpoint}/${id}/`);
        if (response.status === 204) {
            // Optionally handle successful deletion (e.g., update state)
        }
        return response.data;
    },

    // Report-specific methods
    generateAnalytics: async (startDate: Date, endDate: Date) => {
        const response = await api.post<Report>(`${endpoint}/analytics`, {
            startDate,
            endDate,
        });
        return response.data;
    },

    getByDateRange: async (startDate: Date, endDate: Date) => {
        const response = await api.get<Report[]>(`${endpoint}/date-range`, {
            params: { startDate, endDate },
        });
        return response.data;
    },

    getByCategory: async (category: string) => {
        const response = await api.get<Report[]>(
            `${endpoint}/category/${category}`
        );
        return response.data;
    },

    exportReport: async (reportId: string, format: 'pdf' | 'csv' | 'excel') => {
        const response = await api.get(
            `${endpoint}/${reportId}/export/${format}`,
            {
                responseType: 'blob',
            }
        );
        return response.data;
    },

    getDeductionSummary: async (reportId: string) => {
        const response = await api.get<{
            totalDeductions: number;
            categorizedDeductions: Record<string, number>;
        }>(`${endpoint}/${reportId}/deductions`);
        return response.data;
    },
};
