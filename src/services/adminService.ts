import api from './api';



export const adminService = {
    // Teacher Approval Management
    async requestTeacherApproval(data: {
        fullName: string;
        email: string;
        phoneNumber?: string;
        qualification: string;
        experience: string;
        certificateUrl?: string;
    }) {
        const response = await api.post(
            `/admin/teacher-approval`,
            data,

        );
        return response.data;
    },

    async getPendingApprovals() {
        const response = await api.get(
            `/admin/teacher-approvals/pending`,

        );
        return response.data;
    },

    async getAllApprovals() {
        const response = await api.get(
            `/admin/teacher-approvals`,

        );
        return response.data;
    },

    async getApprovalById(id: string) {
        const response = await api.get(
            `/admin/teacher-approvals/${id}`,

        );
        return response.data;
    }, async approveTeacher(userId: string) {
        const response = await api.post(
            `/admin/users/${userId}/approve`,
            {},
        );
        return response.data;
    },

    async rejectTeacher(userId: string, rejectionReason: string) {
        const response = await api.post(
            `/admin/users/${userId}/reject`,
            { reason: rejectionReason },
        );
        return response.data;
    },

    // Get pending teachers (users with Teacher role and Pending status)
    async getPendingTeachers() {
        const response = await api.get(
            `/admin/users/pending-teachers`,
        );
        return response.data;
    },// Statistics
    async getDashboardStatistics() {
        try {
            const response = await api.get(
                `/admin/statistics/dashboard`,

            );
            return response.data;
        } catch (error: any) {
            console.error('Error fetching dashboard statistics:', error);
            if (error.response) {
                // Server responded with error
                throw new Error(error.response.data?.message || 'Failed to fetch dashboard statistics');
            } else if (error.request) {
                // Request made but no response
                throw new Error('Server is not responding. Please check if the backend is running.');
            } else {
                // Something else happened
                throw new Error(error.message || 'An unexpected error occurred');
            }
        }
    },

    async getUserStatistics() {
        const response = await api.get(
            `/admin/statistics/users`,

        );
        return response.data;
    },

    async getClassStatistics() {
        const response = await api.get(
            `/admin/statistics/classes`,

        );
        return response.data;
    },

    async getVocabularyStatistics() {
        const response = await api.get(
            `/admin/statistics/vocabularies`,

        );
        return response.data;
    },

    async getQuizStatistics() {
        const response = await api.get(
            `/admin/statistics/quizzes`
        );
        return response.data;
    },

    async getChatStatistics() {
        const response = await api.get(
            `/admin/statistics/chat`

        );
        return response.data;
    },

    async getRecentActivities(limit: number = 10) {
        const response = await api.get(
            `/admin/activities/recent?limit=${limit}`,

        );
        return response.data;
    },

    // User Management
    async getAllUsers() {
        const response = await api.get(
            `/admin/users`,

        );
        return response.data;
    },

    async changeUserRole(userId: string, role: string) {
        const response = await api.put(
            `/admin/users/role`,
            { userId, role },

        );
        return response.data;
    },

    async toggleUserStatus(userId: string, isActive: boolean) {
        const response = await api.put(
            `/admin/users/status`,
            { userId, isActive },

        );
        return response.data;
    },
};
