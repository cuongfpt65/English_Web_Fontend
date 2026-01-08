import { AlertCircle, ArrowLeft, CheckCircle, Lock, Mail } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

type Step = 'email' | 'code' | 'password' | 'success';

const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle sending reset code
    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.forgotPassword({ email });
            setMessage(response.message);
            setStep('code');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể gửi mã xác thực');
        } finally {
            setLoading(false);
        }
    };

    // Handle verifying reset code
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.verifyResetCode({ email, code });
            if (response.valid) {
                setStep('password');
            } else {
                setError(response.message || 'Mã xác thực không hợp lệ');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Mã xác thực không hợp lệ');
        } finally {
            setLoading(false);
        }
    };

    // Handle resetting password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        // Validate password strength
        if (newPassword.length < 8) {
            setError('Mật khẩu phải có ít nhất 8 ký tự');
            return;
        }

        const hasUpper = /[A-Z]/.test(newPassword);
        const hasLower = /[a-z]/.test(newPassword);
        const hasNumber = /\d/.test(newPassword);
        const hasSpecial = /[@$!%*?&]/.test(newPassword);

        if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
            setError('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt');
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({ email, code, newPassword, confirmPassword });
            setStep('success');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể đặt lại mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };
        const score = Object.values(checks).filter(Boolean).length;
        return { checks, score };
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-peach-300/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-md w-full space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto mb-6 inline-block">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                            <Lock className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                        {step === 'email' && 'Quên mật khẩu'}
                        {step === 'code' && 'Xác thực mã'}
                        {step === 'password' && 'Đặt lại mật khẩu'}
                        {step === 'success' && 'Thành công!'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {step === 'email' && 'Nhập email của bạn để nhận mã xác thực'}
                        {step === 'code' && 'Nhập mã 6 số đã được gửi đến email của bạn'}
                        {step === 'password' && 'Nhập mật khẩu mới của bạn'}
                        {step === 'success' && 'Mật khẩu đã được đặt lại thành công'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
                    {error && (
                        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    {message && step === 'code' && (
                        <div className="mb-4 flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <p className="text-sm text-green-600">{message}</p>
                        </div>
                    )}

                    {/* Step 1: Enter Email */}
                    {step === 'email' && (
                        <form onSubmit={handleSendCode} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter Verification Code */}
                    {step === 'code' && (
                        <form onSubmit={handleVerifyCode} className="space-y-6">
                            <div>
                                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mã xác thực
                                </label>
                                <input
                                    id="code"
                                    name="code"
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                    placeholder="000000"
                                />
                                <p className="mt-2 text-xs text-gray-500 text-center">
                                    Mã có hiệu lực trong 15 phút
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep('email')}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                >
                                    Quay lại
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || code.length !== 6}
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Đang xác thực...' : 'Xác thực'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCode('');
                                        setStep('email');
                                    }}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Gửi lại mã
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Enter New Password */}
                    {step === 'password' && (
                        <form onSubmit={handleResetPassword} className="space-y-6">
                            <div>
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {/* Password Strength Indicator */}
                                {newPassword && (
                                    <div className="mt-3 space-y-2">
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= passwordStrength.score
                                                            ? passwordStrength.score <= 2
                                                                ? 'bg-red-500'
                                                                : passwordStrength.score === 3
                                                                    ? 'bg-yellow-500'
                                                                    : passwordStrength.score === 4
                                                                        ? 'bg-blue-500'
                                                                        : 'bg-green-500'
                                                            : 'bg-gray-200'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <ul className="text-xs space-y-1">
                                            <li className={passwordStrength.checks.length ? 'text-green-600' : 'text-gray-500'}>
                                                ✓ Ít nhất 8 ký tự
                                            </li>
                                            <li className={passwordStrength.checks.upper ? 'text-green-600' : 'text-gray-500'}>
                                                ✓ Có chữ hoa
                                            </li>
                                            <li className={passwordStrength.checks.lower ? 'text-green-600' : 'text-gray-500'}>
                                                ✓ Có chữ thường
                                            </li>
                                            <li className={passwordStrength.checks.number ? 'text-green-600' : 'text-gray-500'}>
                                                ✓ Có số
                                            </li>
                                            <li className={passwordStrength.checks.special ? 'text-green-600' : 'text-gray-500'}>
                                                ✓ Có ký tự đặc biệt (@$!%*?&)
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || passwordStrength.score < 5}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Đang đặt lại...' : 'Đặt lại mật khẩu'}
                            </button>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 'success' && (
                        <div className="text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Đặt lại mật khẩu thành công!
                                </h3>
                                <p className="text-gray-600">
                                    Bạn có thể đăng nhập bằng mật khẩu mới của mình
                                </p>
                            </div>
                            <button
                                onClick={() => navigate('/auth')}
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Đăng nhập ngay
                            </button>
                        </div>
                    )}

                    {/* Back to Login Link */}
                    {step !== 'success' && (
                        <div className="mt-6 text-center">
                            <Link
                                to="/auth"
                                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-500">
                    © 2024 FPT Learnify AI. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
