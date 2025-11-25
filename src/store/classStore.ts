import { create } from 'zustand';
import { classService, type ClassMember, type ClassMessage, type ClassQuiz, type ClassRanking, type ClassRoom } from '../services/classService';

interface ClassState {
    // Data
    classes: ClassRoom[];
    currentClass: ClassRoom | null;
    classMembers: ClassMember[];
    messages: ClassMessage[];
    quizzes: ClassQuiz[];
    ranking: ClassRanking[];

    // UI State
    isLoading: boolean;
    error: string | null;
    selectedTab: 'chat' | 'quizzes' | 'ranking' | 'members';

    // Actions
    fetchMyClasses: () => Promise<void>;
    fetchClassById: (classId: string) => Promise<void>;
    createClass: (classData: { name: string; description?: string }) => Promise<void>;
    joinClass: (inviteCode: string) => Promise<void>;
    leaveClass: (classId: string) => Promise<void>;

    fetchClassMembers: (classId: string) => Promise<void>;
    removeMember: (classId: string, userId: string) => Promise<void>;

    fetchMessages: (classId: string, page?: number) => Promise<void>;
    sendMessage: (classId: string, message: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;

    fetchQuizzes: (classId: string) => Promise<void>;
    createQuiz: (classId: string, quizData: any) => Promise<void>;
    deleteQuiz: (quizId: string) => Promise<void>;

    fetchRanking: (classId: string) => Promise<void>;

    setSelectedTab: (tab: 'chat' | 'quizzes' | 'ranking' | 'members') => void;
    setCurrentClass: (classRoom: ClassRoom | null) => void;
    setError: (error: string | null) => void;
    clearMessages: () => void;
}

export const useClassStore = create<ClassState>((set, get) => ({
    // Initial state
    classes: [],
    currentClass: null,
    classMembers: [],
    messages: [],
    quizzes: [],
    ranking: [],
    isLoading: false,
    error: null,
    selectedTab: 'chat',

    // Actions
    fetchMyClasses: async () => {
        set({ isLoading: true, error: null });
        try {
            const classes = await classService.getMyClasses();
            set({ classes, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch classes',
                isLoading: false
            });
        }
    },

    fetchClassById: async (classId: string) => {
        set({ isLoading: true, error: null });
        try {
            const classRoom = await classService.getClassById(classId);
            set({ currentClass: classRoom, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch class',
                isLoading: false
            });
        }
    }, createClass: async (classData: { name: string; description?: string }) => {
        set({ isLoading: true, error: null });
        try {
            await classService.createClass(classData);
            await get().fetchMyClasses();
            set({ isLoading: false });
        } catch (error: any) {
            const errorMessage = error.response?.status === 403
                ? 'Only teachers can create classes. Please contact administrator to upgrade your account.'
                : error.response?.data?.message || error.message || 'Failed to create class';
            set({
                error: errorMessage,
                isLoading: false
            });
            throw error;
        }
    },

    joinClass: async (inviteCode: string) => {
        set({ isLoading: true, error: null });
        try {
            await classService.joinClass(inviteCode);
            await get().fetchMyClasses();
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to join class',
                isLoading: false
            });
        }
    },

    leaveClass: async (classId: string) => {
        set({ isLoading: true, error: null });
        try {
            await classService.leaveClass(classId);
            await get().fetchMyClasses();
            set({ isLoading: false, currentClass: null });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to leave class',
                isLoading: false
            });
        }
    },

    fetchClassMembers: async (classId: string) => {
        try {
            const members = await classService.getClassMembers(classId);
            set({ classMembers: members });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch members'
            });
        }
    },

    removeMember: async (classId: string, userId: string) => {
        try {
            await classService.removeMember(classId, userId);
            await get().fetchClassMembers(classId);
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to remove member'
            });
        }
    },

    fetchMessages: async (classId: string, page: number = 1) => {
        try {
            const messages = await classService.getMessages(classId, page);
            if (page === 1) {
                set({ messages });
            } else {
                set(state => ({ messages: [...state.messages, ...messages] }));
            }
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch messages'
            });
        }
    },

    sendMessage: async (classId: string, message: string) => {
        try {
            const newMessage = await classService.sendMessage(classId, message);
            set(state => ({ messages: [...state.messages, newMessage] }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to send message'
            });
        }
    },

    deleteMessage: async (messageId: string) => {
        try {
            await classService.deleteMessage(messageId);
            set(state => ({
                messages: state.messages.filter(m => m.id !== messageId)
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to delete message'
            });
        }
    },

    fetchQuizzes: async (classId: string) => {
        try {
            const quizzes = await classService.getClassQuizzes(classId);
            set({ quizzes });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch quizzes'
            });
        }
    },

    createQuiz: async (classId: string, quizData: any) => {
        set({ isLoading: true, error: null });
        try {
            await classService.createQuiz(classId, quizData);
            await get().fetchQuizzes(classId);
            set({ isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to create quiz',
                isLoading: false
            });
        }
    },

    deleteQuiz: async (quizId: string) => {
        try {
            await classService.deleteQuiz(quizId);
            set(state => ({
                quizzes: state.quizzes.filter(q => q.id !== quizId)
            }));
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to delete quiz'
            });
        }
    },

    fetchRanking: async (classId: string) => {
        try {
            const ranking = await classService.getClassRanking(classId);
            set({ ranking });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || error.message || 'Failed to fetch ranking'
            });
        }
    },

    setSelectedTab: (tab) => set({ selectedTab: tab }),
    setCurrentClass: (classRoom) => set({ currentClass: classRoom }),
    setError: (error) => set({ error }),
    clearMessages: () => set({ messages: [] }),
}));
