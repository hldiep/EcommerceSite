import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const InputSdt = () => {
    const [form, setForm] = useState({ phone: '' });
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Số điện thoại đã nhập:', form.phone);
        // TODO: Thực hiện gửi OTP hoặc bước tiếp theo
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className='container mt-10 mb-10'>
                <div className='items-center text-center'>
                    <img
                        src="https://image.plo.vn/w460/Uploaded/2025/yqjvzdjwp/2014_08_01/MPUC20140731161420-logo-xiaomi.jpg.webp"
                        alt="Mascot"
                        className="mx-auto h-36 mb-4 mt-10"
                    />
                    <h2 className='text-red-600 text-3xl font-bold mb-4'>Tạo mật khẩu mới</h2>
                    <span>Hãy nhập email của bạn vào bên dưới để bắt đầu quá trình khôi phục mật khẩu.</span>
                </div>
                <div className="flex items-center justify-center px-4 mt-10">
                    <form onSubmit={handleSubmit} className="bg-white p-6 max-w-2xl w-full">
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                required
                                className="text-sm w-full border rounded px-3 py-2 outline-none mt-2"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>
                        <div className="flex mt-6 gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="flex-1 py-2 border border-gray-400 text-black rounded-lg hover:bg-gray-100"
                            >
                                &larr; Quay lại
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Tiếp tục
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default InputSdt;
