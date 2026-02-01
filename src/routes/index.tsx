import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from '../features/admin/AdminDashboard';
import AdminStatistics from '../features/admin/AdminStatistics';
import RequestTeacherPage from '../features/admin/RequestTeacherPage';
import TeacherApprovalNew from '../features/admin/TeacherApprovalNew';
import UsersManagement from '../features/admin/UsersManagement';
import AuthPage from '../features/auth/AuthPage';
import ForgotPasswordPage from '../features/auth/ForgotPasswordPage';
import ChatPage from '../features/chatbot/ChatPage';
import ClassDetailPage from '../features/class/ClassDetailPage';
import ClassPage from '../features/class/ClassPage';
import MyVocabularyPage from '../features/personal-vocabulary/MyVocabularyPage';
import VocabularyPage from '../features/vocabulary/VocabularyPage';
import AdminLayout from '../layouts/AdminLayout';
import MainLayout from '../layouts/MainLayout';
import About from '../pages/About';
import Home from '../pages/Home';
import LessonsPage from '../pages/Lessons';
import ProfilePage from '../pages/ProfilePage';
import ProgressPage from '../pages/Progress';
import StudentDocuments from '../pages/StudentDocuments';
import TeacherDocuments from '../pages/TeacherDocuments';
import { useAuthStore } from '../store';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (user?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, user } = useAuthStore();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (user?.role !== 'Teacher' && user?.role !== 'Admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
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
                <Route
                    path="/forgot-password"
                    element={
                        <PublicRoute>
                            <ForgotPasswordPage />
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
                        path="my-vocabulary"
                        element={
                            <ProtectedRoute>
                                <MyVocabularyPage />
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
                    /><Route
                        path="class/:classId"
                        element={
                            <ProtectedRoute>
                                <ClassDetailPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="progress"
                        element={
                            <ProtectedRoute>
                                <ProgressPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="profile"
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="request-teacher"
                        element={
                            <ProtectedRoute>
                                <RequestTeacherPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="documents"
                        element={
                            <ProtectedRoute>
                                <StudentDocuments />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="teacher/documents"
                        element={
                            <TeacherRoute>
                                <TeacherDocuments />
                            </TeacherRoute>
                        }
                    />
                </Route>

                {/* Admin Routes - Separate Layout */}
                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminLayout />
                        </AdminRoute>
                    }
                >
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UsersManagement />} />
                    <Route path="approvals" element={<TeacherApprovalNew />} />
                    <Route path="statistics" element={<AdminStatistics />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRoutes;
