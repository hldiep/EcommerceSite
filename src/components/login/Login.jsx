import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { loginApi } from '../../api/auth';
import { useAuth } from '../../contexts/AuthContext';
const Login = () => {
    const navigate = useNavigate();
    const location = useLocation(); //lấy thông tin trang trước
    const { login } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await loginApi(username, password);
            login(data.user, data.token, 'CUSTOMER');
            toast.success('Đăng nhập thành công!');
            if (location.state?.from) {
                navigate(location.state.from);
            } else {
                navigate(-1); // Quay lại trang trước
            }
        } catch (error) {
            toast.error(error.message || 'Sai thông tin đăng nhập');
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
            <div className="bg-gray-100 p-8 flex flex-col justify-center">
                <div onClick={() => navigate('/')} className='text-4xl mb-5 font-bold text-red-600'>
                    Logo
                </div>

                <h2 className="text-2xl font-semibold text-gray-800">
                    Nhập hội khách hàng thành viên <span className="text-red-600 font-bold">của chúng tôi</span>
                </h2>
                <p className="text-gray-600 mt-2 mb-6">Để không bỏ lỡ các ưu đãi hấp dẫn từ nhé</p>
                <ul className="space-y-3 text-sm text-gray-700">
                    <li>🎁 <strong>Chiết khấu đến 5%</strong> khi mua các sản phẩm tại website</li>
                    <li>🚚 <strong>Miễn phí giao hàng</strong> cho đơn từ 300.000đ</li>
                    <li>🎉 <strong>Tặng voucher sinh nhật đến 500.000đ</strong></li>
                    <li>🔁 <strong>Trợ giá thu cũ lên đời đến 1 triệu</strong></li>
                    <li>🎁 <strong>Thăng hạng nhận voucher đến 300.000đ</strong></li>
                    <li>🎓 <strong>Ưu đãi thêm đến 10%</strong> học sinh/sinh viên</li>
                </ul>
                <a href="#" className="text-red-600 mt-4 inline-block font-semibold text-sm">
                    Xem chi tiết chính sách ưu đãi →
                </a>
            </div>

            <div className="p-8 flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">Đăng nhập</h2>
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-2 w-full border border-gray-300 rounded-md px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Nhập tên đăng nhập của bạn"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-red-400"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-9 right-3 cursor-pointer text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 text-lg font-semibold"
                    >
                        Đăng nhập
                    </button>
                    <div className="text-center">
                        <a href="/restore-password" className="text-blue-600 font-medium text-sm">Quên mật khẩu?</a>
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500">
                    Bạn chưa có tài khoản?<button onClick={() => navigate('/register')} className='font-semibold italic ml-1'>Đăng ký ngay</button>
                </div>

            </div>
        </div>
    );
}

export default Login