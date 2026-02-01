export interface MyVocab {
    id: string;
    userId: string;
    word: string;
    meaning: string;
    example?: string;
    imageUrl?: string;
    topic?: string;
    level?: string;
    note?: string;
    isLearned: boolean;
    createdAt: string;
    updatedAt: string;
}
