import api from './api';

export interface ChatMessage {
    id: string;
    sender: 'User' | 'Bot';
    message: string;
    createdAt: string;
}

export interface ChatSession {
    id: string;
    title: string;
    createdAt: string;
}

export interface ChatRequest {
    type: string;
    message: string;
    sessionId?: string;
}

export interface ChatResponse {
    answer: string;
    sessionId?: string;
    vocabularyData?: {
        vocabulary: Array<{
            word: string;
            meaning: string;
            example: string;
        }>;
    };
}

export interface CreateSessionRequest {
    title: string;
}

const chatService = {
    // Gửi tin nhắn chat
    sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
        const response = await api.post<ChatResponse>('/ChatBot', request);
        return response.data;
    },

    // Tạo phiên chat mới
    createSession: async (title: string = 'New Chat'): Promise<ChatSession> => {
        const response = await api.post<ChatSession>('/ChatBot/sessions', { title });
        return response.data;
    },

    // Lấy danh sách phiên chat
    getSessions: async (): Promise<ChatSession[]> => {
        const response = await api.get<ChatSession[]>('/ChatBot/sessions');
        return response.data;
    },

    // Lấy lịch sử tin nhắn của một phiên
    getSessionMessages: async (sessionId: string): Promise<ChatMessage[]> => {
        const response = await api.get<ChatMessage[]>(`/ChatBot/sessions/${sessionId}/messages`);
        return response.data;
    },

    // Đổi tên phiên chat
    updateSessionTitle: async (sessionId: string, title: string): Promise<void> => {
        await api.put(`/ChatBot/sessions/${sessionId}`, { title });
    },
};

export default chatService;
