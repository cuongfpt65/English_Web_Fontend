import React, { useState } from 'react';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store';

const RequestTeacherPage: React.FC = () => {
    const { user } = useAuthStore();
    const [formData, setFormData] = useState({
        fullName: user?.name || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        qualification: '',
        experience: '',
        certificateUrl: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await adminService.requestTeacherApproval(formData);
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit application');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">
                        Your teacher application has been submitted successfully.
                        Our admin team will review it shortly and notify you via email.
                    </p>
                    <div className="animate-pulse text-sm text-gray-500">
                        Redirecting to home page...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-blue-100">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <span className="text-4xl">👨‍🏫</span>
                        </div>
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Become a Teacher
                        </h1>
                        <p className="text-gray-600 font-medium">
                            Share your knowledge and help students learn English! 🎓
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-300 text-red-700 rounded-xl">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">⚠️</span>
                                <span className="flex-1 font-medium">{error}</span>
                                <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">✕</button>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Full Name *
                            </label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email *
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Qualification *
                            </label>
                            <input
                                type="text"
                                value={formData.qualification}
                                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                                placeholder="e.g., Bachelor's in English Literature, TESOL Certificate"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Teaching Experience *
                            </label>
                            <textarea
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                placeholder="Tell us about your teaching experience, specializations, and why you want to be a teacher on our platform..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                                rows={5}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Certificate URL (Optional)
                            </label>
                            <input
                                type="url"
                                value={formData.certificateUrl}
                                onChange={(e) => setFormData({ ...formData, certificateUrl: e.target.value })}
                                placeholder="https://example.com/your-certificate.pdf"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Provide a link to your teaching certificate or credentials (Google Drive, Dropbox, etc.)
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all ${isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 hover:shadow-xl hover:scale-105'
                                }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Submitting...
                                </span>
                            ) : (
                                '📤 Submit Application'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <span>ℹ️</span>
                            What happens next?
                        </h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>✓ Our admin team will review your application</li>
                            <li>✓ You'll receive an email notification with the decision</li>
                            <li>✓ Once approved, you can create and manage classes</li>
                            <li>✓ Start teaching and help students improve their English!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestTeacherPage;
