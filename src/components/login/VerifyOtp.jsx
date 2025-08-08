import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendOtpRegister, verifyOtpRegister } from '../../api/auth';

const VerifyOtp = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const formData = location.state?.formData;

    const [otp, setOtp] = useState(Array(6).fill(''));
    const inputRefs = useRef([]);

    useEffect(() => {
        if (!formData) {
            toast.error('Thiếu thông tin đăng ký');
            navigate('/register');
            return;
        }

        // Focus ô đầu tiên
        inputRefs.current[0]?.focus();
    }, [formData, navigate]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length !== 6 || otp.includes('')) {
            toast.error('Vui lòng nhập đủ 6 số OTP');
            return;
        }

        try {
            await verifyOtpRegister(code, formData);
            toast.success('Đăng ký thành công, vui lòng đăng nhập');
            navigate('/login');
        } catch (error) {
            toast.error(error.message || 'Xác minh OTP thất bại');
        }
    };

    const handleResend = async () => {
        try {
            await sendOtpRegister(formData);
            toast.success('Đã gửi lại mã OTP!');
        } catch (error) {
            toast.error('Không thể gửi lại OTP.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="bg-white border shadow-md rounded-xl p-8 max-w-md w-full text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Xác minh OTP</h2>
                <p className="text-sm text-gray-500 mb-6">
                    Vui lòng nhập mã gồm 6 chữ số đã được gửi đến email của bạn
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-2 mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-10 h-12 border text-center text-xl rounded outline-none"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                    >
                        Xác minh
                    </button>

                    <div className="mt-4">
                        <span className="text-sm text-gray-600">Chưa nhận được mã? </span>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm text-red-600 hover:underline"
                        >
                            Gửi lại
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtp;
