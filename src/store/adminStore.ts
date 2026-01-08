import { create } from 'zustand';
import { adminService } from '../services/adminService';

interface PendingTeacher {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    status: string;
    role: string;
}

interface DashboardStats {
    totalUsers: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdmins: number;
    totalClasses: number;
    totalVocabularies: number;
    totalChatSessions: number;
    totalQuizzes: number;
    pendingApprovals: number;
    activeUsersToday: number;
}

interface AdminState {
    pendingTeachers: PendingTeacher[];
    dashboardStats: DashboardStats | null;
    users: any[];
    isLoading: boolean;
    error: string | null;

    // Teacher Approvals
    fetchPendingTeachers: () => Promise<void>;
    approveTeacher: (userId: string) => Promise<void>;
    rejectTeacher: (userId: string, reason: string) => Promise<void>;

    // Statistics
    fetchDashboardStats: () => Promise<void>;

    // User Management
    fetchAllUsers: () => Promise<void>;
    changeUserRole: (userId: string, role: string) => Promise<void>;

    setError: (error: string | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    pendingTeachers: [],
    dashboardStats: null,
    users: [],
    isLoading: false,
    error: null,

    fetchPendingTeachers: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await adminService.getPendingTeachers();
            set({ pendingTeachers: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch pending teachers',
                isLoading: false
            });
        }
    },

    approveTeacher: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
            await adminService.approveTeacher(userId);
            // Refresh pending teachers list
            const data = await adminService.getPendingTeachers();
            set({ pendingTeachers: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to approve teacher',
                isLoading: false
            });
            throw error;
        }
    },

    rejectTeacher: async (userId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            await adminService.rejectTeacher(userId, reason);
            // Refresh pending teachers list
            const data = await adminService.getPendingTeachers();
            set({ pendingTeachers: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to reject teacher',
                isLoading: false
            });
            throw error;
        }
    },

    fetchDashboardStats: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await adminService.getDashboardStatistics();
            set({ dashboardStats: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch dashboard statistics',
                isLoading: false
            });
        }
    },

    fetchAllUsers: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await adminService.getAllUsers();
            set({ users: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch users',
                isLoading: false
            });
        }
    },

    changeUserRole: async (userId: string, role: string) => {
        set({ isLoading: true, error: null });
        try {
            await adminService.changeUserRole(userId, role);
            // Refresh users list
            const data = await adminService.getAllUsers();
            set({ users: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to change user role',
                isLoading: false
            });
            throw error;
        }
    },

    setError: (error: string | null) => set({ error }),
}));
