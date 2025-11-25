import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';

const MainLayout: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuthStore();
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); const getNavigationItems = () => {
        const items = [
            { path: '/', label: 'Home', icon: '🏠' },
            { path: '/chat', label: 'AI Chat', icon: '💬' },
            { path: '/lessons', label: 'Lessons', icon: '📚' },
            { path: '/vocabulary', label: 'Vocabulary', icon: '📖' },

            { path: '/class', label: 'Classes', icon: '👥' },
            { path: '/practice', label: 'Practice', icon: '✏️' },
            { path: '/progress', label: 'Progress', icon: '📊' },
        ];

        // Add teacher request link if user is student
        if (user?.role === 'Student') {
            items.push({ path: '/request-teacher', label: 'Become Teacher', icon: '👨‍🏫' });
        }

        return items;
    };

    const navigationItems = getNavigationItems();

    const isActivePath = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50">
            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-white shadow-lg transition-all duration-300 z-50 ${isSidebarCollapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-pink-100">
                    <div className="flex items-center justify-between">                        {!isSidebarCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent">
                                    FPT Learnify AI
                                </h1>
                                <p className="text-xs text-gray-500">AI Learning Platform</p>
                            </div>
                        </div>
                    )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-pink-50 transition-colors"
                        >
                            <svg
                                className={`w-5 h-5 text-pink-500 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navigationItems.map((item) => {
                        const isActive = isActivePath(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-lg shadow-pink-300/50'
                                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                {!isSidebarCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>                {/* User Section */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-pink-100">
                    {isAuthenticated ? (
                        <div className="space-y-3">
                            {!isSidebarCollapsed && (
                                <div className="flex items-center gap-3 px-3 py-2 bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl">
                                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">
                                            {user?.name}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                    </div>
                                </div>
                            )}
                            {user?.role === 'Admin' && (
                                <Link to="/admin">
                                    <button
                                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg ${isSidebarCollapsed ? 'px-3' : ''
                                            }`}
                                    >
                                        <span className="text-lg">👑</span>
                                        {!isSidebarCollapsed && <span className="font-medium">Admin Panel</span>}
                                    </button>
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg ${isSidebarCollapsed ? 'px-3' : ''
                                    }`}
                            >
                                <span className="text-lg">👋</span>
                                {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link to="/auth">
                                <button
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl hover:from-orange-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg ${isSidebarCollapsed ? 'px-3' : ''
                                        }`}
                                >
                                    <span className="text-lg">🔐</span>
                                    {!isSidebarCollapsed && <span className="font-medium">Login</span>}
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <div
                className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    }`}
            >
                <main className="min-h-screen p-6">
                    <Outlet />
                </main>

                {/* Footer */}
                <footer className="bg-white/80 backdrop-blur-sm border-t border-pink-100">
                    <div className="max-w-7xl mx-auto px-6 py-6">                        <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            © 2025 FPT Learnify AI. Made with{' '}
                            <span className="text-pink-500">❤️</span> for students
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                                About
                            </a>
                            <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                                Help
                            </a>
                            <a href="#" className="text-gray-500 hover:text-pink-500 transition-colors">
                                Contact
                            </a>
                        </div>
                    </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;
