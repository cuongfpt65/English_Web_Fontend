import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/adminStore';

const AdminDashboard: React.FC = () => {
    const { dashboardStats, isLoading, error, fetchDashboardStats, setError } = useAdminStore();

    useEffect(() => {
        fetchDashboardStats();
    }, [fetchDashboardStats]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-bold text-purple-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">👑</span>
                        </div>                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 text-gray-600 font-medium">
                                Manage FPT Learnify AI Platform 🎯
                            </p>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-3 flex-wrap">
                        <Link
                            to="/admin"
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all"
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            to="/admin/approvals"
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transform transition-all border-2 border-purple-200"
                        >
                            ✅ Teacher Approvals
                            {dashboardStats && dashboardStats.pendingApprovals > 0 && (
                                <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                    {dashboardStats.pendingApprovals}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/admin/users"
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transform transition-all border-2 border-purple-200"
                        >
                            👥 Users
                        </Link>
                        <Link
                            to="/admin/statistics"
                            className="px-6 py-3 bg-white text-purple-600 rounded-xl font-bold shadow-md hover:shadow-lg hover:scale-105 transform transition-all border-2 border-purple-200"
                        >
                            📈 Statistics
                        </Link>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-2xl shadow-md">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <span className="flex-1 font-medium">{error}</span>
                            <button
                                onClick={() => setError(null)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                {/* Statistics Grid */}
                {dashboardStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Users */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-4xl">👥</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalUsers}</p>
                                    <p className="text-sm text-gray-600 font-medium">Total Users</p>
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 space-y-1">
                                <p>Students: {dashboardStats.totalStudents}</p>
                                <p>Teachers: {dashboardStats.totalTeachers}</p>
                                <p>Admins: {dashboardStats.totalAdmins}</p>
                            </div>
                        </div>

                        {/* Total Classes */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">🏫</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-green-600">{dashboardStats.totalClasses}</p>
                                    <p className="text-sm text-gray-600 font-medium">Total Classes</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Vocabularies */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">📚</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-orange-600">{dashboardStats.totalVocabularies}</p>
                                    <p className="text-sm text-gray-600 font-medium">Vocabularies</p>
                                </div>
                            </div>
                        </div>

                        {/* Total Quizzes */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">📝</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-pink-600">{dashboardStats.totalQuizzes}</p>
                                    <p className="text-sm text-gray-600 font-medium">Total Quizzes</p>
                                </div>
                            </div>
                        </div>

                        {/* Chat Sessions */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">💬</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-purple-600">{dashboardStats.totalChatSessions}</p>
                                    <p className="text-sm text-gray-600 font-medium">Chat Sessions</p>
                                </div>
                            </div>
                        </div>

                        {/* Active Users Today */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-100 hover:shadow-xl transition-all">
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">🔥</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-indigo-600">{dashboardStats.activeUsersToday}</p>
                                    <p className="text-sm text-gray-600 font-medium">Active Today</p>
                                </div>
                            </div>
                        </div>

                        {/* Pending Approvals */}
                        <Link
                            to="/admin/approvals"
                            className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg p-6 border-2 border-red-200 hover:shadow-xl transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-4xl">⏳</span>
                                <div className="text-right">
                                    <p className="text-3xl font-bold text-red-600">{dashboardStats.pendingApprovals}</p>
                                    <p className="text-sm text-gray-600 font-medium">Pending Approvals</p>
                                </div>
                            </div>
                            {dashboardStats.pendingApprovals > 0 && (
                                <p className="mt-3 text-xs text-red-600 font-bold">⚠️ Action Required</p>
                            )}
                        </Link>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-purple-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span>⚡</span>
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link
                            to="/admin/approvals"
                            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all group"
                        >
                            <div className="text-3xl mb-3">✅</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600">Review Teachers</h3>
                            <p className="text-sm text-gray-600">Approve or reject teacher applications</p>
                        </Link>

                        <Link
                            to="/admin/users"
                            className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200 hover:shadow-lg transition-all group"
                        >
                            <div className="text-3xl mb-3">👥</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-green-600">Manage Users</h3>
                            <p className="text-sm text-gray-600">View and manage all users</p>
                        </Link>

                        <Link
                            to="/admin/statistics"
                            className="p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200 hover:shadow-lg transition-all group"
                        >
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-orange-600">View Analytics</h3>
                            <p className="text-sm text-gray-600">Check detailed statistics</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
