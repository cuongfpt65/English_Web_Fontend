import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/adminStore';

const TeacherApprovals: React.FC = () => {
    const { approvals, isLoading, error, fetchAllApprovals, approveTeacher, rejectTeacher, setError } = useAdminStore();
    const [selectedApproval, setSelectedApproval] = useState<any>(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');

    useEffect(() => {
        fetchAllApprovals();
    }, [fetchAllApprovals]);

    const handleApprove = async (approvalId: string) => {
        if (window.confirm('Are you sure you want to approve this teacher?')) {
            try {
                await approveTeacher(approvalId);
                alert('Teacher approved successfully!');
            } catch (error) {
                console.error('Failed to approve teacher:', error);
            }
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            await rejectTeacher(selectedApproval.id, rejectionReason);
            alert('Teacher approval rejected');
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedApproval(null);
        } catch (error) {
            console.error('Failed to reject teacher:', error);
        }
    };

    const filteredApprovals = approvals.filter(approval =>
        filterStatus === 'All' || approval.status === filterStatus
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending':
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-bold">⏳ Pending</span>;
            case 'Approved':
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold">✅ Approved</span>;
            case 'Rejected':
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-bold">❌ Rejected</span>;
            default:
                return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">{status}</span>;
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
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 flex-wrap">
                        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status as any)}
                                className={`px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all ${filterStatus === status
                                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                                        : 'bg-white text-gray-700 border-2 border-gray-200'
                                    }`}
                            >
                                {status}
                                {status === 'Pending' && (
                                    <span className="ml-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-full">
                                        {approvals.filter(a => a.status === 'Pending').length}
                                    </span>
                                )}
                            </button>
                        ))}
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
                )}

                {/* Approvals List */}
                {!isLoading && (
                    <div className="space-y-4">
                        {filteredApprovals.length > 0 ? (
                            filteredApprovals.map((approval) => (
                                <div
                                    key={approval.id}
                                    className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-100 hover:shadow-xl transition-all"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                                    <span className="text-2xl">👨‍🏫</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-800">{approval.fullName}</h3>
                                                    <p className="text-sm text-gray-600">{approval.email}</p>
                                                </div>
                                                {getStatusBadge(approval.status)}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">📞 Phone</p>
                                                    <p className="text-sm text-gray-700">{approval.phoneNumber || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">🎓 Qualification</p>
                                                    <p className="text-sm text-gray-700">{approval.qualification}</p>
                                                </div>
                                                <div className="md:col-span-2">
                                                    <p className="text-xs text-gray-500 font-semibold mb-1">💼 Experience</p>
                                                    <p className="text-sm text-gray-700">{approval.experience}</p>
                                                </div>
                                                {approval.certificateUrl && (
                                                    <div className="md:col-span-2">
                                                        <p className="text-xs text-gray-500 font-semibold mb-1">📄 Certificate</p>
                                                        <a
                                                            href={approval.certificateUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                                                        >
                                                            View Certificate
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                <p>Applied: {new Date(approval.createdAt).toLocaleDateString()}</p>
                                                {approval.reviewedAt && (
                                                    <p>Reviewed: {new Date(approval.reviewedAt).toLocaleDateString()}</p>
                                                )}
                                                {approval.rejectionReason && (
                                                    <p className="text-red-600 mt-2">Reason: {approval.rejectionReason}</p>
                                                )}
                                            </div>
                                        </div>

                                        {approval.status === 'Pending' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleApprove(approval.id)}
                                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                >
                                                    ✅ Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedApproval(approval);
                                                        setShowRejectModal(true);
                                                    }}
                                                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                                >
                                                    ❌ Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                                <span className="text-6xl mb-4 block">📭</span>
                                <h3 className="text-xl font-bold text-gray-600 mb-2">No approvals found</h3>
                                <p className="text-gray-500">There are no {filterStatus.toLowerCase()} teacher approvals at the moment.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Reject Modal */}
                {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Reject Teacher Application</h3>
                            <p className="text-gray-600 mb-4">
                                Please provide a reason for rejecting <strong>{selectedApproval?.fullName}</strong>'s application:
                            </p>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none mb-4"
                                rows={4}
                                placeholder="Enter rejection reason..."
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={handleReject}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    Confirm Reject
                                </button>
                                <button
                                    onClick={() => {
                                        setShowRejectModal(false);
                                        setRejectionReason('');
                                        setSelectedApproval(null);
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

export default TeacherApprovals;
