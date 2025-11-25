import api from './api';

export interface LoginRequest {
    emailOrPhone: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
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
        role?: string;
    };
    token: string;
}

export interface VerificationCodeResponse {
    code: string;
    message: string;
}

export const authService = {
    async login(request: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', request);
        return response.data;
    },

    async register(request: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', request);
        return response.data;
    }, async sendVerificationCode(request: SendVerificationCodeRequest): Promise<VerificationCodeResponse> {
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
};
