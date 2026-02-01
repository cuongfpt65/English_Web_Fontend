import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

const UsersManagement: React.FC = () => {
    const { users, isLoading, error, fetchAllUsers, resetUserPassword, toggleUserStatus, setError } = useAdminStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<'All' | 'Student' | 'Teacher' | 'Admin'>('All');
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        fetchAllUsers();
    }, [fetchAllUsers]); const handleResetPassword = async () => {
        if (!selectedUser || !newPassword) return;

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long!');
            return;
        }

        try {
            await resetUserPassword(selectedUser.id, newPassword);
            alert(`Password reset successfully for ${selectedUser.fullName}!`);
            setShowPasswordModal(false);
            setSelectedUser(null);
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    };

    const handleToggleStatus = async (user: any) => {
        const action = user.isActive ? 'lock' : 'unlock';
        const confirmMessage = user.isActive
            ? `Are you sure you want to lock ${user.fullName}'s account? They will not be able to access the system.`
            : `Are you sure you want to unlock ${user.fullName}'s account?`;

        if (!confirm(confirmMessage)) return;

        try {
            await toggleUserStatus(user.id, !user.isActive);
            alert(`User account ${action}ed successfully!`);
        } catch (error) {
            console.error(`Failed to ${action} user account:`, error);
            alert(`Failed to ${action} user account. Please try again.`);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'Admin':
                return <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">👑 Admin</span>;
            case 'Teacher':
                return <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">👨‍🏫 Teacher</span>;
            case 'Student':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">🎓 Student</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">{role}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">👥</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                Users Management
                            </h1>
                            <p className="mt-1 text-gray-600 font-medium">
                                Manage all users and their roles 🔧
                            </p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="🔍 Search by name or email..."
                                className="w-full px-6 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            {['All', 'Student', 'Teacher', 'Admin'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setFilterRole(role as any)}
                                    className={`px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all ${filterRole === role
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                        : 'bg-white text-gray-700 border-2 border-gray-200'
                                        }`}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-2xl shadow-md">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <span className="flex-1 font-medium">{error}</span>
                            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-lg font-bold text-green-600">Loading users...</p>
                        </div>
                    </div>
                )}                {/* Users Table */}
                {!isLoading && (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-green-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold">User</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Phone</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Joined</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            {user.fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{user.fullName}</p>
                                                            <p className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}...</p>
                                                        </div>                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{user.phoneNumber || 'N/A'}</td>
                                                <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                                                <td className="px-6 py-4">
                                                    {user.isActive ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                                                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                                            Locked
                                                        </span>
                                                    )}
                                                </td>                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedUser(user);
                                                                setNewPassword('');
                                                                setConfirmPassword('');
                                                                setShowPasswordModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-bold transition-all"
                                                        >
                                                            Reset Password
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleStatus(user)}
                                                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${user.isActive
                                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                                : 'bg-green-500 hover:bg-green-600 text-white'
                                                                }`}
                                                            title={user.isActive ? 'Lock Account' : 'Unlock Account'}
                                                        >
                                                            {user.isActive ? '🔒 Lock' : '🔓 Unlock'}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))) : (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-12 text-center">
                                                <span className="text-4xl block mb-2">🔍</span>
                                                <p className="text-gray-600 font-medium">No users found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination info */}
                        {filteredUsers.length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Showing <span className="font-bold">{filteredUsers.length}</span> users
                                </p>
                            </div>
                        )}
                    </div>
                )}                {/* Reset Password Modal */}
                {showPasswordModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reset User Password</h3>
                            <div className="mb-6">
                                <p className="text-gray-600 mb-2">
                                    Reset password for <strong>{selectedUser.fullName}</strong>
                                </p>
                                <p className="text-sm text-gray-500 mb-4">{selectedUser.email}</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Enter new password (min 6 characters)"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Confirm Password
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:outline-none"
                                        />
                                    </div>
                                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                        <p className="text-red-500 text-sm">⚠️ Passwords do not match</p>
                                    )}
                                    {newPassword && newPassword.length < 6 && (
                                        <p className="text-orange-500 text-sm">⚠️ Password must be at least 6 characters</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleResetPassword}
                                    disabled={!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6}
                                    className={`flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all ${!newPassword || !confirmPassword || newPassword !== confirmPassword || newPassword.length < 6
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:shadow-lg'
                                        }`}
                                >
                                    Reset Password
                                </button>
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setSelectedUser(null);
                                        setNewPassword('');
                                        setConfirmPassword('');
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersManagement;
