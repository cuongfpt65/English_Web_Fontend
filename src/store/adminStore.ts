import { create } from 'zustand';
import { adminService } from '../services/adminService';

interface TeacherApproval {
    id: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    qualification: string;
    experience: string;
    certificateUrl?: string;
    status: string;
    rejectionReason?: string;
    createdAt: string;
    reviewedAt?: string;
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
    approvals: TeacherApproval[];
    dashboardStats: DashboardStats | null;
    users: any[];
    isLoading: boolean;
    error: string | null;

    // Teacher Approvals
    fetchPendingApprovals: () => Promise<void>;
    fetchAllApprovals: () => Promise<void>;
    approveTeacher: (approvalId: string) => Promise<void>;
    rejectTeacher: (approvalId: string, reason: string) => Promise<void>;

    // Statistics
    fetchDashboardStats: () => Promise<void>;

    // User Management
    fetchAllUsers: () => Promise<void>;
    changeUserRole: (userId: string, role: string) => Promise<void>;

    setError: (error: string | null) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    approvals: [],
    dashboardStats: null,
    users: [],
    isLoading: false,
    error: null,

    fetchPendingApprovals: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await adminService.getPendingApprovals();
            set({ approvals: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch pending approvals',
                isLoading: false
            });
        }
    },

    fetchAllApprovals: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await adminService.getAllApprovals();
            set({ approvals: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to fetch approvals',
                isLoading: false
            });
        }
    },

    approveTeacher: async (approvalId: string) => {
        set({ isLoading: true, error: null });
        try {
            await adminService.approveTeacher(approvalId);
            // Refresh approvals list
            const data = await adminService.getAllApprovals();
            set({ approvals: data, isLoading: false });
        } catch (error: any) {
            set({
                error: error.response?.data?.message || 'Failed to approve teacher',
                isLoading: false
            });
            throw error;
        }
    },

    rejectTeacher: async (approvalId: string, reason: string) => {
        set({ isLoading: true, error: null });
        try {
            await adminService.rejectTeacher(approvalId, reason);
            // Refresh approvals list
            const data = await adminService.getAllApprovals();
            set({ approvals: data, isLoading: false });
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
