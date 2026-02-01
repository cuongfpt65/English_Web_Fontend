import api from './api';

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    avatarUrl?: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    phoneNumber?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface UpdateProfileResponse {
    message: string;
    user: UserProfile;
}

export interface UpdateAvatarResponse {
    message: string;
    avatarUrl: string;
}

export interface ChangePasswordResponse {
    message: string;
}

const profileService = {
    // Get current user profile
    getProfile: async (): Promise<UserProfile> => {
        const response = await api.get('/userprofile');
        return response.data;
    },

    // Update profile information
    updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
        const response = await api.put('/userprofile', data);
        return response.data;
    },

    // Change password
    changePassword: async (data: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
        const response = await api.post('/userprofile/change-password', data);
        return response.data;
    },

    // Upload/Update avatar
    updateAvatar: async (file: File): Promise<UpdateAvatarResponse> => {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await api.post('/userprofile/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default profileService;
