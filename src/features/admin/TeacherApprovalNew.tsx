import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

interface PendingTeacher {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    status: string;
    role: string;
}

const TeacherApprovalNew: React.FC = () => {
    const { pendingTeachers, isLoading, error, fetchPendingTeachers, approveTeacher, rejectTeacher, setError } = useAdminStore();
    const [selectedTeacher, setSelectedTeacher] = useState<PendingTeacher | null>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPendingTeachers();
    }, [fetchPendingTeachers]);

    const handleApprove = async (userId: string, teacherName: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn phê duyệt tài khoản giáo viên "${teacherName}"?`)) {
            try {
                await approveTeacher(userId);
                alert('✅ Đã phê duyệt tài khoản giáo viên thành công!');
            } catch (error) {
                console.error('Failed to approve teacher:', error);
                alert('❌ Có lỗi xảy ra khi phê duyệt tài khoản!');
            }
        }
    };

    const handleRejectClick = (teacher: PendingTeacher) => {
        setSelectedTeacher(teacher);
        setShowRejectModal(true);
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('⚠️ Vui lòng nhập lý do từ chối!');
            return;
        }

        if (!selectedTeacher) return;

        try {
            await rejectTeacher(selectedTeacher.id, rejectionReason);
            alert('❌ Đã từ chối tài khoản giáo viên!');
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedTeacher(null);
        } catch (error) {
            console.error('Failed to reject teacher:', error);
            alert('❌ Có lỗi xảy ra khi từ chối tài khoản!');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">👩‍🏫</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Duyệt Tài Khoản Giáo Viên
                            </h1>
                            <p className="mt-1 text-gray-600 font-medium">
                                Quản lý và phê duyệt đăng ký tài khoản giáo viên 📋
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-3 flex-wrap">
                        <div className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-bold shadow-md">
                            <span className="text-lg">⏳</span> Tài khoản chờ duyệt: <span className="text-xl">{pendingTeachers.length}</span>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-2xl shadow-md">
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <span className="flex-1 font-medium">{error}</span>
                            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-lg font-bold text-blue-600">Đang tải danh sách...</p>
                        </div>
                    </div>
                )}

                {/* Pending Teachers List */}
                {!isLoading && (
                    <div className="space-y-4">
                        {pendingTeachers.length > 0 ? (
                            pendingTeachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">👨‍🏫</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{teacher.fullName}</h3>
                                                    <p className="text-sm text-gray-600">{teacher.email}</p>
                                                </div>
                                                <div className="ml-auto">
                                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">
                                                        ⏳ Chờ duyệt
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📞 Số điện thoại</p>
                                                    <p className="text-sm text-gray-700">{teacher.phoneNumber || 'Không có'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📅 Ngày đăng ký</p>
                                                    <p className="text-sm text-gray-700">{formatDate(teacher.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">👤 Vai trò</p>
                                                    <p className="text-sm text-gray-700">{teacher.role}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📊 Trạng thái</p>
                                                    <p className="text-sm text-gray-700">{teacher.status}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 flex-col sm:flex-row lg:flex-col xl:flex-row">
                                            <button
                                                onClick={() => handleApprove(teacher.id, teacher.fullName)}
                                                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="text-lg mr-2">✅</span>
                                                Phê duyệt
                                            </button>
                                            <button
                                                onClick={() => handleRejectClick(teacher)}
                                                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                                            >
                                                <span className="text-lg mr-2">❌</span>
                                                Từ chối
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <span className="text-6xl">📋</span>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-600 mb-2">Không có tài khoản chờ duyệt</h3>
                                <p className="text-gray-500">Tất cả tài khoản giáo viên đã được xử lý</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && selectedTeacher && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">❌</span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Từ chối tài khoản giáo viên</h3>
                                <p className="text-gray-600">
                                    Bạn đang từ chối tài khoản của <strong>{selectedTeacher.fullName}</strong>
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    📝 Lý do từ chối *
                                </label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Nhập lý do từ chối tài khoản..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all resize-none h-24"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                        setSelectedTeacher(null);
                                    }}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl transition-all"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    onClick={handleReject}
                                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                                >
                                    Xác nhận từ chối
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherApprovalNew;
