import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

const TeacherApprovals: React.FC = () => {
    const { pendingTeachers, isLoading, error, fetchPendingTeachers, approveTeacher, rejectTeacher, setError } = useAdminStore();
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchPendingTeachers();
    }, [fetchPendingTeachers]); const handleApprove = async (userId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn phê duyệt tài khoản giáo viên này?')) {
            try {
                await approveTeacher(userId);
                alert('Đã phê duyệt tài khoản giáo viên thành công!');
            } catch (error) {
                console.error('Failed to approve teacher:', error);
            }
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            await rejectTeacher(selectedTeacher.id, rejectionReason);
            alert('Đã từ chối tài khoản giáo viên');
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedTeacher(null);
        } catch (error) {
            console.error('Failed to reject teacher:', error);
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-3xl">✅</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                Teacher Approvals
                            </h1>
                            <p className="mt-1 text-gray-600 font-medium">
                                Review and approve teacher applications 📋
                            </p>
                        </div>
                    </div>                    {/* Info Stats */}
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
                            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                            <p className="mt-4 text-lg font-bold text-blue-600">Loading approvals...</p>
                        </div>
                    </div>
                )}                {/* Teachers List */}
                {!isLoading && (
                    <div className="space-y-4">
                        {pendingTeachers.length > 0 ? (
                            pendingTeachers.map((teacher) => (
                                <div
                                    key={teacher.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-100 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">👨‍🏫</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{teacher.fullName}</h3>
                                                    <p className="text-sm text-gray-600">{teacher.email}</p>
                                                </div>
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">⏳ Chờ duyệt</span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📞 Số điện thoại</p>
                                                    <p className="text-sm text-gray-700">{teacher.phoneNumber || 'Chưa cung cấp'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📅 Ngày đăng ký</p>
                                                    <p className="text-sm text-gray-700">{new Date(teacher.createdAt).toLocaleDateString('vi-VN')}</p>
                                                </div>                                            </div>

                                            <div className="text-xs text-gray-500">
                                                <p>Đăng ký: {new Date(teacher.createdAt).toLocaleDateString('vi-VN')}</p>
                                                <p className="text-yellow-600 mt-1">Trạng thái: Chờ phê duyệt</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => handleApprove(teacher.id)}
                                                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                            >
                                                ✅ Phê duyệt
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedTeacher(teacher);
                                                    setShowRejectModal(true);
                                                }}
                                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                            >
                                                ❌ Từ chối
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))) : (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                <span className="text-6xl mb-4 block">📭</span>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">Không có tài khoản chờ duyệt</h3>
                                <p className="text-gray-500">Hiện tại không có tài khoản giáo viên nào cần phê duyệt.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Từ chối tài khoản giáo viên</h3>
                            <p className="text-gray-600 mb-4">
                                Vui lòng nhập lý do từ chối tài khoản của <strong>{selectedTeacher?.fullName}</strong>:
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
                                rows={4}
                                placeholder="Nhập lý do từ chối..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReject}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Xác nhận từ chối
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                        setSelectedTeacher(null);
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeacherApprovals;
