import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { sendOtpRegister } from '../../api/auth';

const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        birthday: '',
        phone: '',
        email: '',
        address: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: 'Nam',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            fullName, birthday, phone, email, username,
            password, confirmPassword
        } = form;

        if (!fullName || !birthday || !phone || !email || !username || !password || !confirmPassword) {
            toast.error("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }
        if (username.length < 8) {
            toast.error("Tên đăng nhập phải có ít nhất 8 ký tự.");
            return;
        }
        if (password.length < 6 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            toast.error("Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp.");
            return;
        }
        setIsLoading(true);
        try {
            await sendOtpRegister(form);
            toast.success("OTP đã được gửi tới email!");

            navigate("/register/verify-otp", { state: { formData: form } });
        } catch (error) {
            toast.error(error.response?.data?.message || "Lỗi khi gửi OTP.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className='container mt-10 mb-10'>
                <div className='items-center text-center'>
                    <h2 className='text-red-600 text-3xl font-bold'>Đăng ký để trở thành thành viên ngay</h2>
                    <img src="https://image.plo.vn/w460/Uploaded/2025/yqjvzdjwp/2014_08_01/MPUC20140731161420-logo-xiaomi.jpg.webp" alt="Mascot" className="mx-auto h-36 mb-4 mt-10" />
                </div>
                <h2 className='items-center text-center text-gray-600 text-sm'>Hãy điền đầy đủ thông tin đăng ký dưới đây</h2>

                <div className="min-h-screen flex items-center justify-center px-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Giới tính</label>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nam"
                                            checked={form.gender === 'Nam'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Nam
                                    </label>
                                    <label className="flex items-center text-sm">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Nu"
                                            checked={form.gender === 'Nu'}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        Nữ
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email (Bắt buộc)</label>
                                    <input type="email" name="email" value={form.email} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                                </div>
                                <label className="block text-sm font-medium mb-1 mt-2">Địa chỉ (Không bắt buộc)</label>
                                <input type="text" name="address" value={form.address} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mt-6 mb-4">Tạo tài khoản & mật khẩu</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={form.username}
                                    onChange={handleChange}
                                    className="text-sm outline-none w-full border rounded px-3 py-2"
                                />
                            </div>
                            <div className="relative">
                                <label className="block text-sm font-medium mb-1">Mật khẩu</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="text-sm outline-none w-full border rounded px-3 py-2 pr-10"
                                />
                                <span
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute top-[36px] right-3 cursor-pointer text-gray-500"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự, có ít nhất 1 chữ & 1 số</p>
                            </div>
                            <div className="md:col-span-2 relative">
                                <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="text-sm outline-none w-full border rounded px-3 py-2 pr-10"
                                />
                                <span
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute top-[36px] right-3 cursor-pointer text-gray-500"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>

                        <div className="flex mt-6 gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="flex-1 py-2 border border-gray-400 text-black rounded-lg hover:bg-gray-100"
                            >
                                &larr; Quay lại đăng nhập
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`flex-1 py-2 rounded-lg text-white transition ${isLoading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                {isLoading ? 'Đang xử lý...' : 'Hoàn tất đăng ký'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Register;
