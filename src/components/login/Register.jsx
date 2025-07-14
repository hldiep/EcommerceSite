import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const Register = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [form, setForm] = useState({
        name: '',
        birthday: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        subscribe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Đăng ký:", form);
        // TODO: Gửi dữ liệu đến backend
    };
    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className='container mt-10 mb-10'>
                <div className='items-center text-center'>
                    <h2 className='text-red-600 text-3xl font-bold'>Đăng ký để trở thành thành viên ngay</h2>
                    <img src="https://imgs.vietnamnet.vn/Images/vnn/2014/07/31/16/20140731161420-logo-xiaomi.jpg" alt="Mascot" className="mx-auto h-36 mb-4 mt-10" />
                </div>
                <h2 className='items-center text-center text-gray-600 text-sm'>Hãy điền đầy đủ thông tin đăng ký dưới đây</h2>
                <div className="min-h-screen flex items-center justify-center px-4">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-2xl w-full">
                        <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Họ và tên</label>
                                <input type="text" name="name" value={form.name} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Ngày sinh</label>
                                <input type="date" name="birthday" value={form.birthday} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Email (Bắt buộc)</label>
                                <input type="email" name="email" value={form.email} onChange={handleChange} className="text-sm w-full border rounded px-3 py-2 outline-none" />
                                <p className="text-xs text-green-600 mt-1">✔ Hóa đơn VAT sẽ được gửi qua email này</p>
                            </div>
                        </div>

                        <h2 className="text-xl font-bold mt-6 mb-4">Tạo mật khẩu</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <div className="relative">
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

                        <div className="mt-4 flex items-center">
                            <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} className="mr-2" />
                            <span className="text-sm">Đăng ký nhận tin khuyến mãi từ chúng tôi</span>
                        </div>

                        <p className="text-xs text-gray-500 mt-3">
                            Bằng việc đăng ký, bạn đã đồng ý với{' '}
                            <a href="#" className="text-blue-600 font-medium underline">Điều khoản sử dụng</a> và{' '}
                            <a href="#" className="text-blue-600 font-medium underline">Chính sách bảo mật</a>
                        </p>

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
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Hoàn tất đăng ký
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register