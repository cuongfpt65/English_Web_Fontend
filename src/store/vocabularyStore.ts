import { create } from 'zustand';
import { vocabularyService } from '../services/vocabularyService';

export interface Vocabulary {
    id: string;
    word: string;
    meaning: string;
    example: string;
    topic: string;
    level: string;
    imageUrl?: string;
}

export interface UserVocabulary {
    id: string;
    isLearned: boolean;
    note?: string;
    addedAt: string;
    vocabulary: Vocabulary;
}

export interface VocabularyFilters {
    topic?: string;
    level?: string;
    search?: string;
    page: number;
    pageSize: number;
}

export interface VocabularyResponse {
    items: Vocabulary[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

interface VocabularyState {
    vocabularies: Vocabulary[];
    userVocabularies: UserVocabulary[];
    topics: string[];
    levels: string[];
    filters: VocabularyFilters;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchVocabularies: () => Promise<void>;
    fetchUserVocabularies: (learnedOnly?: boolean) => Promise<void>;
    fetchTopics: () => Promise<void>;
    fetchLevels: () => Promise<void>;
    setFilters: (filters: Partial<VocabularyFilters>) => void;
    resetFilters: () => void;
    markAsLearned: (vocabularyId: string, note?: string) => Promise<void>;
    addVocabulary: (vocabulary: Omit<Vocabulary, 'id'>) => Promise<void>;
    updateVocabulary: (id: string, vocabulary: Partial<Vocabulary>) => Promise<void>;
    deleteVocabulary: (id: string) => Promise<void>;
    searchVocabularies: (searchTerm: string) => Promise<void>;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
}

const defaultFilters: VocabularyFilters = {
    page: 1,
    pageSize: 20,
};

export const useVocabularyStore = create<VocabularyState>((set, get) => ({
    vocabularies: [],
    userVocabularies: [],
    topics: [],
    levels: [],
    filters: defaultFilters,
    isLoading: false,
    error: null,

    fetchVocabularies: async () => {
        set({ isLoading: true, error: null });
        try {
            const filters = get().filters;
            const data = await vocabularyService.getVocabularies(filters);
            set({ vocabularies: data.items, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch vocabularies',
                isLoading: false
            });
        }
    },

    fetchUserVocabularies: async (learnedOnly = false) => {
        set({ isLoading: true, error: null });
        try {
            const data = await vocabularyService.getUserVocabularies(learnedOnly);
            set({ userVocabularies: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch user vocabularies',
                isLoading: false
            });
        }
    },

    fetchTopics: async () => {
        try {
            const data = await vocabularyService.getTopics();
            set({ topics: data });
        } catch (error: any) {
            console.error('Failed to fetch topics:', error.response?.data?.message || error.message);
        }
    },

    fetchLevels: async () => {
        try {
            const data = await vocabularyService.getLevels();
            set({ levels: data });
        } catch (error: any) {
            console.error('Failed to fetch levels:', error.response?.data?.message || error.message);
        }
    },

    setFilters: (newFilters) => {
        set(state => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    resetFilters: () => {
        set({ filters: defaultFilters });
    },

    markAsLearned: async (vocabularyId, note) => {
        set({ isLoading: true, error: null });
        try {
            await vocabularyService.markAsLearned(vocabularyId, note);

            // Refresh user vocabularies
            await get().fetchUserVocabularies();
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to mark vocabulary as learned',
                isLoading: false
            });
        }
    },

    addVocabulary: async (vocabulary) => {
        set({ isLoading: true, error: null });
        try {
            await vocabularyService.addVocabulary(vocabulary);

            // Refresh vocabularies
            await get().fetchVocabularies();
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to add vocabulary',
                isLoading: false
            });
        }
    },

    updateVocabulary: async (id, vocabulary) => {
        set({ isLoading: true, error: null });
        try {
            await vocabularyService.updateVocabulary(id, vocabulary);

            // Refresh vocabularies
            await get().fetchVocabularies();
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to update vocabulary',
                isLoading: false
            });
        }
    },

    deleteVocabulary: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await vocabularyService.deleteVocabulary(id);

            // Refresh vocabularies
            await get().fetchVocabularies();
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to delete vocabulary',
                isLoading: false
            });
        }
    },

    searchVocabularies: async (searchTerm) => {
        set({ isLoading: true, error: null });
        try {
            const data = await vocabularyService.searchVocabularies(searchTerm);
            set({ vocabularies: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to search vocabularies',
                isLoading: false
            });
        }
    },

    setError: (error) => set({ error }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
