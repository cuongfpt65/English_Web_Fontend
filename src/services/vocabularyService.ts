import type { UserVocabulary, Vocabulary, VocabularyFilters, VocabularyResponse } from '../store/vocabularyStore';
import api from './api';

export const vocabularyService = {
    // Get vocabularies with filters
    async getVocabulary(filters: {
        topic?: string;
        level?: string;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<{ items: Vocabulary[]; totalItems: number; page: number; pageSize: number; totalPages: number }> {
        const params = new URLSearchParams();

        if (filters.topic) params.append('topic', filters.topic);
        if (filters.level) params.append('level', filters.level);
        if (filters.search) params.append('search', filters.search);
        params.append('page', (filters.page || 1).toString());
        params.append('pageSize', (filters.pageSize || 20).toString());

        const response = await api.get(`/Vocabulary?${params}`);
        return response.data;
    },

    // Get vocabularies with filters (legacy)
    async getVocabularies(filters: VocabularyFilters): Promise<VocabularyResponse> {
        const params = new URLSearchParams();

        if (filters.topic) params.append('topic', filters.topic);
        if (filters.level) params.append('level', filters.level);
        if (filters.search) params.append('search', filters.search);
        params.append('page', filters.page.toString());
        params.append('pageSize', filters.pageSize.toString());

        const response = await api.get(`/Vocabulary?${params}`);
        return response.data;
    },

    // Get user's vocabularies
    async getUserVocabularies(learnedOnly?: boolean): Promise<UserVocabulary[]> {
        const params = new URLSearchParams();
        if (learnedOnly) params.append('learnedOnly', 'true');

        const response = await api.get(`/Vocabulary/my-vocabulary?${params}`);
        return response.data;
    },

    // Get available topics
    async getTopics(): Promise<string[]> {
        const response = await api.get('/Vocabulary/topics');
        return response.data;
    },

    // Get available levels
    async getLevels(): Promise<string[]> {
        const response = await api.get('/Vocabulary/levels');
        return response.data;
    },

    // Add new vocabulary
    async addVocabulary(vocabulary: Omit<Vocabulary, 'id'>): Promise<void> {
        await api.post('/Vocabulary', vocabulary);
    },

    // Update vocabulary
    async updateVocabulary(id: string, vocabulary: Partial<Vocabulary>): Promise<void> {
        await api.put(`/Vocabulary/${id}`, vocabulary);
    },

    // Delete vocabulary
    async deleteVocabulary(id: string): Promise<void> {
        await api.delete(`/Vocabulary/${id}`);
    },

    // Mark vocabulary as learned
    async markAsLearned(vocabularyId: string, note?: string): Promise<void> {
        await api.post(`/Vocabulary/${vocabularyId}/learn`, { note });
    },

    // Search vocabularies
    async searchVocabularies(searchTerm: string): Promise<Vocabulary[]> {
        const response = await api.get(`/Vocabulary/search?term=${encodeURIComponent(searchTerm)}`);
        return response.data;
    },

    // Get vocabulary by ID
    async getVocabularyById(id: string): Promise<Vocabulary> {
        const response = await api.get(`/Vocabulary/${id}`);
        return response.data;
    },

    // Check if words already exist in user's vocabulary
    async checkVocabularyExists(words: string[]): Promise<string[]> {
        const response = await api.post('/Vocabulary/check-exists', { words });
        return response.data.existingWords || [];
    },

    // Add multiple vocabularies at once (batch)
    async addVocabularyBatch(words: Array<{
        word: string;
        meaning: string;
        example?: string;
        category?: string;
        topic?: string;
        level?: string;
    }>): Promise<{ addedCount: number; skippedCount: number }> {
        const response = await api.post('/Vocabulary/batch', { words });
        return response.data;
    },
};
