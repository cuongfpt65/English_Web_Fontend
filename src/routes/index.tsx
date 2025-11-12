import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthPage from '../features/auth/AuthPage';
import ChatPage from '../features/chatbot/ChatPage';
import ClassDetailPage from '../features/class/ClassDetailPage';
import ClassPage from '../features/class/ClassPage';
import VocabularyPage from '../features/vocabulary/VocabularyPage';
import MainLayout from '../layouts/MainLayout';
import About from '../pages/About';
import Home from '../pages/Home';
import LessonsPage from '../pages/Lessons';
import PracticePage from '../pages/Practice';
import ProgressPage from '../pages/Progress';
import { useAuthStore } from '../store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Component để ngăn người dùng đã đăng nhập truy cập trang auth
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/auth"
                    element={
                        <PublicRoute>
                            <AuthPage />
                        </PublicRoute>
                    }
                />
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="about" element={<About />} /><Route
                        path="chat"
                        element={
                            <ProtectedRoute>
                                <ChatPage />
                            </ProtectedRoute>
                        }
                    />                    <Route
                        path="lessons"
                        element={
                            <ProtectedRoute>
                                <LessonsPage />
                            </ProtectedRoute>
                        }
                    />                    <Route
                        path="vocabulary"
                        element={
                            <ProtectedRoute>
                                <VocabularyPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="class"
                        element={
                            <ProtectedRoute>
                                <ClassPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="class/:classId"
                        element={
                            <ProtectedRoute>
                                <ClassDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="practice"
                        element={
                            <ProtectedRoute>
                                <PracticePage />
                            </ProtectedRoute>
                        }
                    /><Route
                        path="progress"
                        element={
                            <ProtectedRoute>
                                <ProgressPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
