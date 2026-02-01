import api from './api';

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    role: string;
    phoneNumber?: string;
}

export interface PhoneLoginRequest {
    phoneNumber: string;
    code: string;
    createAccount?: boolean;
    name?: string;
    email?: string;
}

export interface SendVerificationCodeRequest {
    phoneNumber: string;
    type?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        phoneNumber?: string;
        name: string;
        fullName?: string;
        avatarUrl?: string;
        role?: string;
        status?: string;
    };
    token: string;
}

export interface VerificationCodeResponse {
    code: string;
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyResetCodeRequest {
    email: string;
    code: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
    confirmPassword: string;
}

export interface MessageResponse {
    message: string;
}

export const authService = {
    async login(request: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', request);
        return response.data;
    }, async register(request: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', request);
        return response.data;
    },

    async sendVerificationCode(request: SendVerificationCodeRequest): Promise<VerificationCodeResponse> {
        const response = await api.post('/auth/send-code', request);
        return response.data;
    },

    async verifyPhoneLogin(request: PhoneLoginRequest): Promise<AuthResponse> {
        // Backend endpoint là /auth/phone-auth
        const response = await api.post('/auth/phone-auth', {
            phoneNumber: request.phoneNumber,
            code: request.code,
            name: request.name,
            email: request.email
        });
        return response.data;
    },

    async logout(): Promise<void> {
        await api.post('/auth/logout');
    },

    async refreshToken(): Promise<AuthResponse> {
        const response = await api.post('/auth/refresh-token');
        return response.data;
    },

    async getUserProfile(): Promise<any> {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    async forgotPassword(request: ForgotPasswordRequest): Promise<MessageResponse> {
        const response = await api.post('/auth/forgot-password', request);
        return response.data;
    },

    async verifyResetCode(request: VerifyResetCodeRequest): Promise<{ valid: boolean; message: string }> {
        const response = await api.post('/auth/verify-reset-code', request);
        return response.data;
    },

    async resetPassword(request: ResetPasswordRequest): Promise<MessageResponse> {
        const response = await api.post('/auth/reset-password', request);
        return response.data;
    },
};
