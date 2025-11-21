import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import { useAuthStore } from '../store';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://localhost:7023/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from Zustand store
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - logout user
            useAuthStore.getState().logout();
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;
