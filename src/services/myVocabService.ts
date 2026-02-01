import api from './api';

export interface MyVocabWord {
    id?: string;
    word: string;
    meaning: string;
    example?: string;
    imageUrl?: string;
    topic?: string;
    level?: string;
    note?: string;
    isLearned?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateMyVocabDto {
    word: string;
    meaning: string;
    example?: string;
    imageUrl?: string;
    topic?: string;
    level?: string;
    note?: string;
    isLearned?: boolean;
}

export interface MyVocabResponse {
    items: MyVocabWord[];
    totalItems: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface MyVocabStatistics {
    totalWords: number;
    learnedWords: number;
    notLearnedWords: number;
    topicBreakdown: Array<{ topic: string; count: number }>;
}

class MyVocabService {
    private baseUrl = '/MyVocab';

    /**
     * Get all personal vocabulary with filters
     */
    async getMyVocabulary(params?: {
        topic?: string;
        level?: string;
        isLearned?: boolean;
        search?: string;
        page?: number;
        pageSize?: number;
    }): Promise<MyVocabResponse> {
        const response = await api.get(this.baseUrl, { params });
        return response.data;
    }

    /**
     * Get a specific vocabulary by ID
     */
    async getMyVocabularyById(id: string): Promise<MyVocabWord> {
        const response = await api.get(`${this.baseUrl}/${id}`);
        return response.data;
    }

    /**
     * Create a new vocabulary
     */
    async createMyVocabulary(dto: CreateMyVocabDto): Promise<MyVocabWord> {
        const response = await api.post(this.baseUrl, dto);
        return response.data;
    }

    /**
     * Create multiple vocabularies in batch
     */
    async createMyVocabularyBatch(words: CreateMyVocabDto[]): Promise<{
        addedCount: number;
        skippedCount: number;
        addedWords: MyVocabWord[];
        skippedWords: string[];
    }> {
        const results = {
            addedCount: 0,
            skippedCount: 0,
            addedWords: [] as MyVocabWord[],
            skippedWords: [] as string[],
        };

        for (const word of words) {
            try {
                const created = await this.createMyVocabulary(word);
                results.addedCount++;
                results.addedWords.push(created);
            } catch (error: any) {
                // If word already exists, count as skipped
                if (error.response?.status === 400) {
                    results.skippedCount++;
                    results.skippedWords.push(word.word);
                } else {
                    // Re-throw other errors
                    throw error;
                }
            }
        }

        return results;
    }

    /**
     * Update a vocabulary
     */
    async updateMyVocabulary(id: string, dto: Partial<CreateMyVocabDto>): Promise<MyVocabWord> {
        const response = await api.put(`${this.baseUrl}/${id}`, dto);
        return response.data;
    }

    /**
     * Delete a vocabulary
     */
    async deleteMyVocabulary(id: string): Promise<void> {
        await api.delete(`${this.baseUrl}/${id}`);
    }

    /**
     * Toggle learned status
     */
    async toggleLearned(id: string): Promise<{ id: string; isLearned: boolean; message: string }> {
        const response = await api.patch(`${this.baseUrl}/${id}/toggle-learned`);
        return response.data;
    }

    /**
     * Get vocabulary statistics
     */
    async getStatistics(): Promise<MyVocabStatistics> {
        const response = await api.get(`${this.baseUrl}/statistics`);
        return response.data;
    }

    /**
     * Get all topics
     */
    async getTopics(): Promise<string[]> {
        const response = await api.get(`${this.baseUrl}/topics`);
        return response.data;
    }

    /**
     * Get all levels
     */
    async getLevels(): Promise<string[]> {
        const response = await api.get(`${this.baseUrl}/levels`);
        return response.data;
    }

    /**
     * Check if words already exist in MyVocab
     */
    async checkWordsExist(words: string[]): Promise<string[]> {
        try {
            // Get all user's vocabulary
            const response = await this.getMyVocabulary({ pageSize: 10000 });
            const existingWords = response.items.map(v => v.word.toLowerCase());

            // Filter words that already exist
            return words.filter(word => existingWords.includes(word.toLowerCase()));
        } catch (error) {
            console.error('Error checking words:', error);
            return [];
        }
    }

    /**
     * Add a word from MyVocab to global Vocabulary
     */
    async addToGlobalVocabulary(myVocabId: string): Promise<{
        success: boolean;
        message: string;
        vocabularyId?: string;
    }> {
        const response = await api.post(`${this.baseUrl}/${myVocabId}/add-to-vocabulary`);
        return response.data;
    }

    /**
     * Add multiple words from MyVocab to global Vocabulary
     */
    async addMultipleToGlobalVocabulary(myVocabIds: string[]): Promise<{
        addedCount: number;
        skippedCount: number;
        failedCount: number;
        addedWords: Array<{ myVocabId: string; vocabularyId: string; word: string }>;
        skippedWords: Array<{ myVocabId: string; word: string; reason: string }>;
        failedWords: Array<{ myVocabId: string; word: string; error: string }>;
    }> {
        const response = await api.post(`${this.baseUrl}/add-to-vocabulary-batch`, { ids: myVocabIds });
        return response.data;
    }

    /**
     * Check which MyVocab words already exist in global Vocabulary
     * Returns a Set of word strings (lowercase) that exist in global vocabulary
     */
    async checkExistingInGlobalVocabulary(myVocabWords: MyVocabWord[]): Promise<Set<string>> {
        try {
            const words = myVocabWords.map(v => v.word);
            const existingWords = await api.post('/Vocabulary/check-exists', { words });
            return new Set((existingWords.data.existingWords || []).map((w: string) => w.toLowerCase()));
        } catch (error) {
            console.error('Error checking existing words in global vocabulary:', error);
            return new Set();
        }
    }
}

export const myVocabService = new MyVocabService();
