import React, { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, type AuthResponse } from '../services/authService';

interface User {
    id: string;
    email: string;
    name: string;
    phoneNumber?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_ERROR' }
    | { type: 'LOGOUT' };

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
            };
        default:
            return state;
    }
};

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string, name: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const navigate = useNavigate();

    // Kiểm tra token khi load app
    useEffect(() => {
        const token = localStorage.getItem('auth-token');
        const savedUser = localStorage.getItem('auth-user');

        if (token && savedUser) {
            try {
                const user = JSON.parse(savedUser);
                dispatch({ type: 'AUTH_SUCCESS', payload: user });
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR' });
            }
        } else {
            dispatch({ type: 'AUTH_ERROR' });
        }
    }, []);

    const login = async (email: string, password: string) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response: AuthResponse = await authService.login({
                emailOrPhone: email,
                password
            });

            // Lưu token và user vào localStorage
            localStorage.setItem('auth-token', response.token);
            localStorage.setItem('auth-user', JSON.stringify(response.user));

            dispatch({ type: 'AUTH_SUCCESS', payload: response.user });

            // Chuyển hướng đến trang chủ sau khi đăng nhập thành công
            navigate('/');
        } catch (error: any) {
            dispatch({ type: 'AUTH_ERROR' });
            throw new Error(error.response?.data?.message || error.message || 'Đăng nhập thất bại');
        }
    };

    const register = async (email: string, password: string, name: string) => {
        dispatch({ type: 'AUTH_START' });
        try {
            const response: AuthResponse = await authService.register({
                email,
                password,
                name
            });

            // Lưu token và user vào localStorage
            localStorage.setItem('auth-token', response.token);
            localStorage.setItem('auth-user', JSON.stringify(response.user));

            dispatch({ type: 'AUTH_SUCCESS', payload: response.user });

            // Chuyển hướng đến trang chủ sau khi đăng ký thành công
            navigate('/');
        } catch (error: any) {
            dispatch({ type: 'AUTH_ERROR' });
            throw new Error(error.response?.data?.message || error.message || 'Đăng ký thất bại');
        }
    };

    const logout = () => {
        // Xóa token và user khỏi localStorage
        localStorage.removeItem('auth-token');
        localStorage.removeItem('auth-user');

        dispatch({ type: 'LOGOUT' });

        // Chuyển hướng đến trang đăng nhập
        navigate('/auth');
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
