import api from './api';

export interface ClassRoom {
    id: string;
    name: string;
    description?: string;
    code: string;
    teacherId: string;
    teacherName: string;
    createdAt: string;
    memberCount: number;
}

export interface ClassMember {
    id: string;
    userId: string;
    userName: string;
    fullName: string;
    role: 'Teacher' | 'Student';
    joinedAt: string;
    vocabularyCount: number;
    bestQuizScore: number;
}

export interface ClassMessage {
    id: string;
    message: string;
    createdAt: string;
    sender: {
        id: string;
        fullName: string;
    };
}

export interface ClassQuiz {
    id: string;
    title: string;
    description?: string;
    timeLimit: number;
    isActive: boolean;
    createdAt: string;
    createdBy: string;
    createdByName: string;
    questions?: ClassQuizQuestion[];
    questionCount?: number; // From API list endpoint
    attemptCount?: number;
    myAttempt?: any;
    myBestScore?: number;
}

export interface ClassQuizQuestion {
    id: string;
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: string;
    vocabularyId?: string;
}

export interface QuizSubmission {
    id: string;
    score: number;
    totalQuestions: number;
    completedAt: string;
    timeSpent: number;
    user: {
        id: string;
        fullName: string;
    };
}

export interface ClassRanking {
    userId: string;
    userName: string;
    fullName: string;
    vocabularyCount: number;
    bestQuizScore: number;
    averageQuizScore: number;
    totalQuizzes: number;
    rank: number;
}

export const classService = {
    // Get user's classes
    async getMyClasses(): Promise<ClassRoom[]> {
        const response = await api.get('/Class');
        return response.data;
    },

    // Get class details
    async getClassById(classId: string): Promise<ClassRoom> {
        const response = await api.get(`/Class/${classId}`);
        return response.data;
    },

    // Create new class
    async createClass(classData: { name: string; description?: string }): Promise<ClassRoom> {
        const response = await api.post('/Class', classData);
        return response.data;
    },

    // Join class with code
    async joinClass(inviteCode: string): Promise<void> {
        await api.post('/Class/join', { "inviteCode": inviteCode });
    },

    // Leave class
    async leaveClass(classId: string): Promise<void> {
        await api.delete(`/Class/${classId}/leave`);
    },

    // Get class members
    async getClassMembers(classId: string): Promise<ClassMember[]> {
        const response = await api.get(`/Class/${classId}/members`);
        return response.data;
    },

    // Remove member from class (teacher only)
    async removeMember(classId: string, userId: string): Promise<void> {
        await api.delete(`/Class/${classId}/members/${userId}`);
    },

    // Get class ranking
    async getClassRanking(classId: string): Promise<ClassRanking[]> {
        const response = await api.get(`/Class/${classId}/results`);
        return response.data;
    },

    // Chat functions
    async getMessages(classId: string, page: number = 1): Promise<ClassMessage[]> {
        const response = await api.get(`/ClassChat/${classId}/messages?page=${page}`);
        return response.data;
    },

    async sendMessage(classId: string, message: string): Promise<ClassMessage> {
        const response = await api.post(`/ClassChat/${classId}/messages`, { message });
        return response.data;
    },

    async deleteMessage(messageId: string): Promise<void> {
        await api.delete(`/ClassChat/messages/${messageId}`);
    },

    // Quiz functions
    async getClassQuizzes(classId: string): Promise<ClassQuiz[]> {
        const response = await api.get(`/ClassQuiz/${classId}`);
        return response.data;
    },

    async getQuizById(quizId: string): Promise<ClassQuiz> {
        const response = await api.get(`/ClassQuiz/quiz/${quizId}`);
        return response.data;
    },

    async createQuiz(classId: string, quizData: {
        title: string;
        description?: string;
        timeLimit: number;
        questions: Omit<ClassQuizQuestion, 'id'>[];
    }): Promise<ClassQuiz> {
        const response = await api.post(`/ClassQuiz/${classId}`, quizData);
        return response.data;
    },

    async submitQuiz(quizId: string, answers: { questionId: string; selectedOption: string }[]): Promise<QuizSubmission> {
        const response = await api.post(`/ClassQuiz/quiz/${quizId}/submit`, { answers });
        return response.data;
    },

    async getQuizSubmissions(quizId: string): Promise<QuizSubmission[]> {
        const response = await api.get(`/ClassQuiz/quiz/${quizId}/submissions`);
        return response.data;
    },

    async deleteQuiz(quizId: string): Promise<void> {
        await api.delete(`/ClassQuiz/quiz/${quizId}`);
    },
};
