import React, { useEffect, useRef, useState } from 'react';
import profileService, { type UserProfile } from '../services/profileService';
import { useAuthStore } from '../store';

// Simple toast notification function
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'error') {
        alert('❌ ' + message);
    } else {
        alert('✅ ' + message);
    }
};

const ProfilePage: React.FC = () => {
    const { updateUser } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Profile form state
    const [profileForm, setProfileForm] = useState({
        fullName: '',
        phoneNumber: '',
    });
    const [profileSaving, setProfileSaving] = useState(false);

    // Password form state
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    useEffect(() => {
        loadProfile();
    }, []); const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await profileService.getProfile();
            setProfile(data);
            setProfileForm({
                fullName: data.fullName,
                phoneNumber: data.phoneNumber || '',
            });
        } catch (error: any) {
            console.error('Failed to load profile:', error);
            showToast(error.response?.data?.message || 'Không thể tải thông tin người dùng', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    }; const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('Chỉ chấp nhận file ảnh định dạng: JPG, JPEG, PNG, GIF, WEBP', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('Kích thước file không được vượt quá 5MB', 'error');
            return;
        } try {
            setUploading(true);
            const result = await profileService.updateAvatar(file);
            showToast(result.message);

            // Update profile with new avatar
            setProfile(prev => prev ? { ...prev, avatarUrl: result.avatarUrl } : null);

            // Update auth store to reflect avatar in sidebar
            updateUser({ avatarUrl: result.avatarUrl });
        } catch (error: any) {
            console.error('Failed to upload avatar:', error);
            showToast(error.response?.data?.message || 'Không thể cập nhật avatar', 'error');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!profileForm.fullName.trim()) {
            showToast('Vui lòng nhập tên', 'error');
            return;
        } try {
            setProfileSaving(true);
            const result = await profileService.updateProfile({
                fullName: profileForm.fullName.trim(),
                phoneNumber: profileForm.phoneNumber.trim() || undefined,
            });
            showToast(result.message);
            setProfile(result.user);

            // Update auth store to reflect name changes in sidebar
            updateUser({
                name: result.user.fullName,
                fullName: result.user.fullName,
                phoneNumber: result.user.phoneNumber
            });
        } catch (error: any) {
            console.error('Failed to update profile:', error);
            showToast(error.response?.data?.message || 'Không thể cập nhật thông tin', 'error');
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!passwordForm.currentPassword) {
            showToast('Vui lòng nhập mật khẩu hiện tại', 'error');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            showToast('Mật khẩu mới phải có ít nhất 8 ký tự', 'error');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            showToast('Xác nhận mật khẩu không khớp', 'error');
            return;
        }

        try {
            setPasswordSaving(true);
            const result = await profileService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword,
            });
            showToast(result.message);

            // Reset form
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
            });
        } catch (error: any) {
            console.error('Failed to change password:', error);
            showToast(error.response?.data?.message || 'Không thể đổi mật khẩu', 'error');
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-xl text-gray-600">Không thể tải thông tin người dùng</p>
                    <button
                        onClick={loadProfile}
                        className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-400 via-pink-400 to-rose-500 rounded-2xl p-8 mb-6 shadow-xl">
                <div className="text-center text-white">
                    <h1 className="text-4xl font-bold mb-2">Thông Tin Cá Nhân 👤</h1>
                    <p className="text-white/90">Quản lý thông tin tài khoản của bạn</p>
                </div>
            </div>

            {/* Avatar Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-400 shadow-xl">
                            {profile.avatarUrl ? (
                                <img
                                    src={profile.avatarUrl}
                                    alt={profile.fullName}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-pink-400 to-orange-400 flex items-center justify-center text-white text-5xl font-bold">
                                    {profile.fullName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Upload overlay */}
                        <button
                            onClick={handleAvatarClick}
                            disabled={uploading}
                            className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                        >
                            {uploading ? (
                                <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <span className="text-white text-3xl">📷</span>
                            )}
                        </button>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />

                    <h2 className="mt-4 text-2xl font-bold text-gray-800">{profile.fullName}</h2>
                    <p className="text-gray-600">{profile.email}</p>
                    <span className="mt-2 px-4 py-1 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full text-sm font-semibold">
                        {profile.role === 'Teacher' ? '👨‍🏫 Giáo Viên' : '👨‍🎓 Học Sinh'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'profile'
                            ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        📝 Thông Tin
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`flex-1 px-6 py-4 font-semibold transition-all ${activeTab === 'password'
                            ? 'bg-gradient-to-r from-orange-400 to-pink-500 text-white'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        🔒 Mật Khẩu
                    </button>
                </div>

                <div className="p-8">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Họ và Tên *
                                </label>
                                <input
                                    type="text"
                                    value={profileForm.fullName}
                                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
                                    placeholder="Nhập họ và tên"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed"
                                    disabled
                                />
                                <p className="mt-1 text-xs text-gray-500">Email không thể thay đổi</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Số Điện Thoại
                                </label>
                                <input
                                    type="tel"
                                    value={profileForm.phoneNumber}
                                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors"
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={profileSaving}
                                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {profileSaving ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang lưu...
                                        </span>
                                    ) : (
                                        '💾 Lưu Thay Đổi'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Password Tab */}
                    {activeTab === 'password' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật Khẩu Hiện Tại *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.current ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors pr-12"
                                        placeholder="Nhập mật khẩu hiện tại"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.current ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật Khẩu Mới *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.new ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors pr-12"
                                        placeholder="Nhập mật khẩu mới"
                                        required
                                        minLength={8}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.new ? '🙈' : '👁️'}
                                    </button>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                    Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Xác Nhận Mật Khẩu Mới *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordForm.confirmNewPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-400 focus:outline-none transition-colors pr-12"
                                        placeholder="Nhập lại mật khẩu mới"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPasswords.confirm ? '🙈' : '👁️'}
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={passwordSaving}
                                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    {passwordSaving ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Đang lưu...
                                        </span>
                                    ) : (
                                        '🔒 Đổi Mật Khẩu'
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
