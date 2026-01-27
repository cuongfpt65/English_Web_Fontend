import api from './api';

export interface DocumentCategory {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    documentCount: number;
}

export interface Document {
    id: string;
    title: string;
    description: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    fileSizeFormatted: string;
    categoryId: string;
    categoryName: string;
    uploadedByUserId: string;
    uploadedByName: string;
    uploadedByEmail: string;
    viewCount: number;
    downloadCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface DocumentsResponse {
    items: Document[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface CreateCategoryDto {
    name: string;
    description: string;
}

export interface UploadDocumentDto {
    title: string;
    description: string;
    categoryId: string;
    file: File;
}

export interface UpdateDocumentDto {
    title: string;
    description: string;
    categoryId: string;
}

const documentService = {
    // Categories
    getAllCategories: async () => {
        const response = await api.get<{ success: boolean; data: DocumentCategory[] }>('/document/categories');
        return response.data.data;
    },

    getCategoryById: async (id: string) => {
        const response = await api.get<{ success: boolean; data: DocumentCategory }>(`/document/categories/${id}`);
        return response.data.data;
    },

    createCategory: async (dto: CreateCategoryDto) => {
        const response = await api.post<{ success: boolean; data: DocumentCategory }>('/document/categories', dto);
        return response.data.data;
    },

    updateCategory: async (id: string, dto: CreateCategoryDto) => {
        const response = await api.put<{ success: boolean; data: DocumentCategory }>(`/document/categories/${id}`, dto);
        return response.data.data;
    },

    deleteCategory: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/document/categories/${id}`);
        return response.data;
    },

    // Documents
    getDocuments: async (params?: {
        categoryId?: string;
        search?: string;
        fileType?: string;
        page?: number;
        pageSize?: number;
    }) => {
        const response = await api.get<{ success: boolean; data: DocumentsResponse }>('/document', { params });
        return response.data.data;
    },

    getDocumentById: async (id: string) => {
        const response = await api.get<{ success: boolean; data: Document }>(`/document/${id}`);
        return response.data.data;
    }, uploadDocument: async (dto: UploadDocumentDto) => {
        try {
            console.log('=== UPLOAD DOCUMENT DEBUG ===');
            console.log('DTO received:', dto);
            console.log('File name:', dto.file.name);
            console.log('File size:', dto.file.size);
            console.log('File type:', dto.file.type);

            const formData = new FormData();
            formData.append('Title', dto.title);
            // Fix: Don't send empty string, send space or skip if empty
            formData.append('Description', dto.description || ' ');
            formData.append('CategoryId', dto.categoryId);
            formData.append('File', dto.file);

            console.log('FormData entries:');
            for (let pair of formData.entries()) {
                console.log(pair[0], ':', pair[1]);
            }

            // Don't set Content-Type header - let browser set it automatically with boundary
            const response = await api.post<{ success: boolean; data: Document; message: string }>('/document/upload', formData);
            console.log('Upload response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('=== UPLOAD ERROR ===');
            console.error('Error:', error);
            console.error('Response status:', error.response?.status);
            console.error('Response data:', error.response?.data);
            console.error('VALIDATION ERRORS:', error.response?.data?.errors);
            console.error('Response headers:', error.response?.headers);
            throw error;
        }
    },

    updateDocument: async (id: string, dto: UpdateDocumentDto) => {
        const response = await api.put<{ success: boolean; data: Document; message: string }>(`/document/${id}`, dto);
        return response.data;
    },

    deleteDocument: async (id: string) => {
        const response = await api.delete<{ success: boolean; message: string }>(`/document/${id}`);
        return response.data;
    },

    recordView: async (id: string) => {
        await api.post(`/document/${id}/view`);
    },

    recordDownload: async (id: string) => {
        await api.post(`/document/${id}/download`);
    },

    getUserHistory: async (limit = 20) => {
        const response = await api.get<{ success: boolean; data: any[] }>('/document/history', { params: { limit } });
        return response.data.data;
    },

    getStats: async () => {
        const response = await api.get<{ success: boolean; data: any }>('/document/stats');
        return response.data.data;
    },
};

export default documentService;
