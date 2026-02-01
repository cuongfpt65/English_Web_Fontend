import React from 'react';
import { useNavigate } from 'react-router-dom';
import { setNavigate, useAuthStore } from '../../store';

const AuthPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = React.useState(true);
    const { login, register, isLoading } = useAuthStore();
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    // Thiết lập navigation function cho store
    React.useEffect(() => {
        setNavigate(navigate);
    }, [navigate]); const [formData, setFormData] = React.useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phoneNumber: '',
        role: 'Student',
    });
    const [error, setError] = React.useState(''); const handleEmailPasswordSubmit = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setError('');

        try {
            if (isLogin) {
                // Đăng nhập
                await login(formData.email, formData.password);
                // Nếu thành công, store sẽ tự redirect
            } else {
                // Đăng ký - Validation
                if (formData.password !== formData.confirmPassword) {
                    setError('Mật khẩu xác nhận không khớp');
                    return;
                }

                if (formData.password.length < 8) {
                    setError('Mật khẩu phải có ít nhất 8 ký tự');
                    return;
                }

                const hasUpper = /[A-Z]/.test(formData.password);
                const hasLower = /[a-z]/.test(formData.password);
                const hasNumber = /\d/.test(formData.password);
                const hasSpecial = /[@$!%*?&]/.test(formData.password);

                if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
                    setError('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)');
                    return;
                }

                // Đăng ký trực tiếp
                await register(
                    formData.email,
                    formData.password,
                    formData.confirmPassword,
                    formData.name,
                    formData.role,
                    formData.phoneNumber
                );
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi';

            // Chỉ hiển thị popup khi đăng nhập thất bại
            if (isLogin) {
                alert('❌ Đăng nhập thất bại!\n\n' + errorMessage);
                window.location.reload();
            } else {
                // Với đăng ký, kiểm tra nếu là teacher pending approval
                if (errorMessage.includes('chờ phê duyệt')) {
                    // Show success message and reset form
                    alert('✅ ' + errorMessage);
                    setIsLogin(true); // Switch to login mode
                    resetForm();
                } else {
                    setError(errorMessage);
                }
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }; const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            phoneNumber: '',
            role: 'Student',
        });
        setError('');
    };

    const toggleLoginRegister = () => {
        setIsLogin(!isLogin);
        resetForm();
    };

    // Password strength validation
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
    }; const passwordStrength = getPasswordStrength(formData.password);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-pink-50 to-peach-50 py-6 lg:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}            <div className="absolute top-0 left-0 w-48 lg:w-72 h-48 lg:h-72 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 lg:w-96 h-64 lg:h-96 bg-gradient-to-br from-pink-300/30 to-peach-300/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

            <div className="max-w-md w-full space-y-6 lg:space-y-8 relative z-10">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto mb-4 lg:mb-6 inline-block">
                        <div className="w-16 lg:w-20 h-16 lg:h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl shadow-pink-300/50 transform hover:scale-110 transition-transform">
                            <span className="text-3xl lg:text-5xl">✨</span>
                        </div>
                    </div>
                    <h2 className="text-2xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent mb-2 lg:mb-3">
                        Welcome Back! 🎉
                    </h2>
                    <p className="text-sm lg:text-base text-gray-600 font-medium">
                        {isLogin ? '✉️ Đăng nhập với email' : '✉️ Đăng ký ngay'}
                    </p>
                </div>                {/* Registration/Login Form */}
                <div className="bg-white rounded-2xl lg:rounded-3xl shadow-2xl p-6 lg:p-8 backdrop-blur-sm border border-white/50">
                    <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 lg:space-y-5">
                        {!isLogin && (
                            <>
                                <div>
                                    <label htmlFor="name" className="block text-xs lg:text-sm font-bold text-gray-700 mb-2">
                                        👤 Họ và tên
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required={!isLogin}
                                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-sm lg:text-base"
                                        placeholder="Nhập họ và tên của bạn"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="role" className="block text-xs lg:text-sm font-bold text-gray-700 mb-2">
                                        🎭 Vai trò
                                    </label>                                    <select
                                        id="role"
                                        name="role"
                                        className="w-full px-3 lg:px-4 py-2.5 lg:py-3 border-2 border-gray-200 rounded-lg lg:rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all text-sm lg:text-base"
                                        value={formData.role}
                                        onChange={handleChange}
                                    >
                                        <option value="Student">🎓 Học sinh</option>
                                        <option value="Teacher">👩‍🏫 Giáo viên (Cần phê duyệt)</option>
                                    </select>
                                    {formData.role === 'Teacher' && (
                                        <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-start gap-2">
                                                <span className="text-yellow-600">⚠️</span>
                                                <div className="text-xs text-yellow-800">
                                                    <p className="font-medium">Lưu ý cho tài khoản Giáo viên:</p>
                                                    <p className="mt-1">Tài khoản giáo viên cần được phê duyệt bởi quản trị viên trước khi có thể đăng nhập. Bạn sẽ nhận được thông báo qua email khi tài khoản được kích hoạt.</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                ✉️ Địa chỉ email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700">
                                    🔒 Mật khẩu
                                </label>
                                {isLogin && (
                                    <a
                                        href="/forgot-password"
                                        className="text-xs font-medium text-pink-500 hover:text-pink-600 transition-colors"
                                    >
                                        Quên mật khẩu?
                                    </a>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                                    required
                                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                                    placeholder={isLogin ? 'Nhập mật khẩu' : 'Tạo mật khẩu mạnh (8+ ký tự, chữ hoa, thường, số, ký tự đặc biệt)'}
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {!isLogin && formData.password && (
                                <div className="mt-2 space-y-2">
                                    <div className="flex items-center gap-1">
                                        <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 1 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength.score >= 4 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
                                        <div className={`h-1 flex-1 rounded ${passwordStrength.score === 5 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
                                    </div>
                                    <div className="text-xs space-y-1">
                                        <div className={passwordStrength.checks.length ? 'text-green-600' : 'text-red-500'}>
                                            {passwordStrength.checks.length ? '✓' : '✗'} Ít nhất 8 ký tự
                                        </div>
                                        <div className={passwordStrength.checks.upper ? 'text-green-600' : 'text-red-500'}>
                                            {passwordStrength.checks.upper ? '✓' : '✗'} Có chữ hoa
                                        </div>
                                        <div className={passwordStrength.checks.lower ? 'text-green-600' : 'text-red-500'}>
                                            {passwordStrength.checks.lower ? '✓' : '✗'} Có chữ thường
                                        </div>
                                        <div className={passwordStrength.checks.number ? 'text-green-600' : 'text-red-500'}>
                                            {passwordStrength.checks.number ? '✓' : '✗'} Có số
                                        </div>
                                        <div className={passwordStrength.checks.special ? 'text-green-600' : 'text-red-500'}>
                                            {passwordStrength.checks.special ? '✓' : '✗'} Có ký tự đặc biệt (@$!%*?&)
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>                            {!isLogin && (
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                                    🔒 Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required={!isLogin}
                                        className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                                        placeholder="Nhập lại mật khẩu"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {!isLogin && (
                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-bold text-gray-700 mb-2">
                                    📱 Số điện thoại (tuỳ chọn)
                                </label>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
                                    placeholder="0901234567"
                                    value={formData.phoneNumber}
                                    onChange={handleChange} />
                            </div>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Đang xử lý...</span>
                                    </div>
                                ) : (
                                    <span>{isLogin ? '🚀 Đăng nhập ngay' : '✨ Tạo tài khoản'}</span>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && !isLogin && (
                        <div className="mt-5 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl text-sm flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <span className="flex-1 font-medium">{error}</span>
                        </div>
                    )}

                    {/* Toggle Login/Register */}
                    <div className="mt-6 text-center">
                        <button
                            type="button"
                            className="text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-pink-700 transition-all"
                            onClick={toggleLoginRegister}
                        >                            {isLogin
                            ? '✨ Chưa có tài khoản? Tạo tài khoản mới'
                            : '👋 Đã có tài khoản? Đăng nhập ngay'}
                        </button>                        </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-sm text-gray-500">
                    <p>Bằng cách đăng nhập, bạn đồng ý với</p>
                    <p className="mt-1">
                        <a href="#" className="text-pink-500 hover:text-pink-600 font-medium">Điều khoản sử dụng</a>
                        {' & '}
                        <a href="#" className="text-pink-500 hover:text-pink-600 font-medium">Chính sách bảo mật</a>                        </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
