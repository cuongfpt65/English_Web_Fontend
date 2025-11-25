import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService } from '../services/authService';

interface User {
    id: string;
    email: string;
    phoneNumber?: string;
    name: string;
    fullName?: string;
    role?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (emailOrPhone: string, password: string) => Promise<void>; loginWithPhone: (phoneNumber: string, code: string, createAccount?: boolean, name?: string, email?: string) => Promise<void>;
    sendVerificationCode: (phoneNumber: string, type?: string) => Promise<string>;
    register: (email: string, password: string, name: string, phoneNumber?: string) => Promise<void>;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

// Helper function để điều hướng (sẽ được gọi từ component)
let navigateFunction: ((path: string) => void) | null = null;

export const setNavigate = (navigate: (path: string) => void) => {
    navigateFunction = navigate;
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (emailOrPhone: string, password: string) => {
                set({ isLoading: true });
                try {
                    const data = await authService.login({ emailOrPhone, password });
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
                    if (navigateFunction) {
                        navigateFunction('/');
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
                }
            }, sendVerificationCode: async (phoneNumber: string, type: string = 'Login') => {
                try {
                    const data = await authService.sendVerificationCode({ phoneNumber, type });
                    return data.code; // For demo purposes only!
                } catch (error: any) {
                    throw new Error(error.response?.data?.message || error.message || 'Gửi mã xác nhận thất bại');
                }
            },

            loginWithPhone: async (phoneNumber: string, code: string, createAccount: boolean = true, name?: string, email?: string) => {
                set({ isLoading: true });
                try {
                    const data = await authService.verifyPhoneLogin({ phoneNumber, code, createAccount, name, email });
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
                    if (navigateFunction) {
                        navigateFunction('/');
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || error.message || 'Đăng nhập bằng điện thoại thất bại');
                }
            },

            register: async (email: string, password: string, name: string, phoneNumber?: string) => {
                set({ isLoading: true });
                try {
                    const data = await authService.register({ email, password, name, phoneNumber });
                    set({
                        user: data.user,
                        token: data.token,
                        isAuthenticated: true,
                        isLoading: false,
                    });

                    // Chuyển hướng đến trang chủ sau khi đăng ký thành công
                    if (navigateFunction) {
                        navigateFunction('/');
                    }
                } catch (error: any) {
                    set({ isLoading: false });
                    throw new Error(error.response?.data?.message || error.message || 'Đăng ký thất bại');
                }
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                    isLoading: false,
                });

                // Chuyển hướng đến trang đăng nhập
                if (navigateFunction) {
                    navigateFunction('/auth');
                }
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },
        }),
        {
            name: 'auth-store',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);

interface AppState {
    theme: 'light' | 'dark';
    language: 'en' | 'vi';
    setTheme: (theme: 'light' | 'dark') => void;
    setLanguage: (language: 'en' | 'vi') => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            theme: 'light',
            language: 'en',
            setTheme: (theme) => set({ theme }),
            setLanguage: (language) => set({ language }),
        }),
        {
            name: 'app-storage',
        }
    )
);
