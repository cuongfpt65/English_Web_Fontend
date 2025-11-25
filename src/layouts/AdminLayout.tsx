import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const adminNavigationItems = [
        { path: '/admin', label: 'Dashboard', icon: '📊' },
        { path: '/admin/users', label: 'Users Management', icon: '👥' },
        { path: '/admin/approvals', label: 'Teacher Approvals', icon: '✅' },
        { path: '/admin/statistics', label: 'Statistics', icon: '📈' },
    ];

    const isActivePath = (path: string) => {
        if (path === '/admin') {
            return location.pathname === '/admin';
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const handleBackToApp = () => {
        navigate('/');
    }; return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Mobile Top Bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg z-50 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-lg">👑</span>
                        </div>
                        <h1 className="text-lg font-bold text-white">
                            Admin Panel
                        </h1>
                    </div>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <svg
                            className="w-6 h-6 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Admin Sidebar */}
            <aside
                className={`fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl transition-all duration-300 z-50 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:block ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72`}
            >                {/* Logo Section */}
                <div className="p-4 lg:p-6 border-b border-slate-700 lg:pt-6 pt-20">
                    <div className="flex items-center justify-between">
                        {!isSidebarCollapsed && (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-2xl">👑</span>
                                </div>
                                <div className="lg:block hidden">
                                    <h1 className="text-lg font-bold text-white">
                                        Admin Panel
                                    </h1>
                                    <p className="text-xs text-slate-400">Management System</p>
                                </div>
                            </div>
                        )}
                        <button
                            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                            className="p-2 rounded-lg hover:bg-slate-700 transition-colors hidden lg:block"
                        >
                            <svg
                                className={`w-5 h-5 text-slate-400 transition-transform ${isSidebarCollapsed ? 'rotate-180' : ''
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
                </div>                {/* Admin Profile */}
                {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                    <div className="p-4 border-b border-slate-700">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                                <span className="text-lg font-bold text-white">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-purple-400 font-medium">Administrator</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    {adminNavigationItems.map((item) => {
                        const isActive = isActivePath(item.path); return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>                {/* Bottom Actions */}
                <div className="p-4 border-t border-slate-700 space-y-2">
                    <button
                        onClick={() => {
                            handleBackToApp();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                    >
                        <span className="text-2xl">🏠</span>
                        {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                            <span className="font-medium">Back to App</span>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                    >
                        <span className="text-2xl">🚪</span>
                        {(!isSidebarCollapsed || window.innerWidth < 1024) && (
                            <span className="font-medium">Logout</span>
                        )}
                    </button>
                </div>
            </aside>            {/* Main Content */}
            <main
                className={`transition-all duration-300 lg:ml-72 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} pt-16 lg:pt-0`}
            >
                {/* Top Bar */}
                <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-40">
                    <div className="px-4 lg:px-8 py-4">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
                            <div>
                                <h2 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {adminNavigationItems.find(item => isActivePath(item.path))?.label || 'Admin Panel'}
                                </h2>
                                <p className="text-xs lg:text-sm text-gray-600 mt-1">
                                    Manage and monitor your platform
                                </p>
                            </div>
                            <div className="flex items-center gap-2 lg:gap-4 w-full lg:w-auto">
                                <div className="flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex-1 lg:flex-initial">
                                    <span className="text-xs lg:text-sm font-semibold text-purple-700 truncate">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
