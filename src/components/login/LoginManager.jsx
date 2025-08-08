import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginManagerApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const LoginManager = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginManagerApi(username, password);
            login(data.user, data.token, 'MANAGER');
            toast.success('Đăng nhập thành công!');
            navigate('/tongquan')
        } catch (error) {
            toast.error(error.message || 'Sai thông tin đăng nhập');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">Đăng nhập quản lý</h2>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại, email</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Nhập số điện thoại hoặc email của bạn"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-red-400"
                                placeholder="Nhập mật khẩu của bạn"
                                required
                            />
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-2.5 right-3 cursor-pointer text-gray-500"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        <div className="text-right mt-1">
                            <a href="/restore-password" className="text-blue-600 text-sm italic hover:underline">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition text-base font-semibold"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Bạn chưa có tài khoản?
                    <button
                        onClick={() => navigate('/register')}
                        className="ml-1 text-red-600 font-medium hover:underline"
                    >
                        Đăng ký ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginManager;
