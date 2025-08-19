import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/auth';

const XacMinhEmail = () => {
    const navigate = useNavigate();
    const email = location.state?.email || "";

    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);
    // useEffect(() => {
    //     if (!location.state?.email) {
    //         navigate('/');
    //     }
    // }, [location, navigate]);
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            setCanResend(false);
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError("");

        if (!verificationCode.trim()) {
            setError("Vui lòng nhập mã OTP.");
            return;
        }

        try {
            setLoading(true);
            const token = await verifyOtp(email, verificationCode);
            setSuccess(true);
            localStorage.setItem("reset_token", token);
            setTimeout(() => {
                navigate("/mat-khau-moi");
            }, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setError("");
            setCountdown(60);
            await sendOtpToEmail(email);
        } catch (err) {
            setError("Không thể gửi lại mã. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0f7fa] via-[#ffffff] to-[#e0f7fa] relative px-4">
            <button
                onClick={() => navigate('/restore-password')}
                className="absolute top-6 left-6 flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 px-4 py-2 transition-all duration-300"
            >
                <FaArrowLeft className="text-sm" />
                Quay lại
            </button>

            <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl px-10 py-12 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4 text-logo font-serif">XÁC MINH MÃ</h2>
                <p className="text-sm mb-2 text-center">
                    Nhập mã xác minh đã gửi đến <strong>{email}</strong>
                </p>

                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="mt-2 w-full p-2 border rounded-md text-gray-900 outline-none text-center text-xl tracking-widest"
                        placeholder="------"
                        required
                        onInvalid={(e) => e.target.setCustomValidity("Vui lòng không để trống ô này")}
                        onInput={(e) => e.target.setCustomValidity("")}
                    />

                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    {success && <p className="text-green-700 text-sm mt-2 text-center">Mã hợp lệ! Đang chuyển hướng...</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-red-500 text-white font-semibold py-2 mt-4 rounded-full transition-all duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-logo hover:bg-red-600'}`}
                    >
                        {loading ? "Đang xác minh..." : "XÁC NHẬN"}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-700">
                    {canResend ? (
                        <button
                            onClick={handleResendCode}
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Gửi lại mã
                        </button>
                    ) : (
                        <span className="text-gray-500">Gửi lại mã sau {countdown}s</span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default XacMinhEmail