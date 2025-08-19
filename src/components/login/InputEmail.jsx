import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendOtpToEmail } from "../../api/auth";

const InputEmail = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Email không hợp lệ.");
            return;
        }

        try {
            setLoading(true);
            await sendOtpToEmail(email);
            navigate("/restore-password/otp", { state: { email } });
        } catch (err) {
            setError(err.message || "Có lỗi xảy ra khi gửi OTP.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex justify-center">
            <div className="container mb-10 max-w-lg w-full">
                <div className="text-center">
                    <img
                        src="https://image.plo.vn/w460/Uploaded/2025/yqjvzdjwp/2014_08_01/MPUC20140731161420-logo-xiaomi.jpg.webp"
                        alt="Mascot"
                        className="mx-auto h-36 mb-4 mt-10"
                    />
                    <h2 className="text-red-600 text-3xl font-bold mb-4">
                        Tạo mật khẩu mới
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Hãy nhập email của bạn vào bên dưới để bắt đầu quá trình khôi phục mật khẩu.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-6 mt-8 shadow rounded-lg"
                >
                    <label className="block text-sm font-medium mb-1">Nhập email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="text-sm w-full border rounded px-3 py-2 outline-none mt-2 focus:border-red-500"
                        placeholder="Nhập email"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                    <div className="flex mt-6 gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="flex-1 py-2 border border-gray-400 text-black rounded-lg hover:bg-gray-100 disabled:opacity-50"
                            disabled={loading}
                        >
                            &larr; Quay lại
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Đang gửi..." : "Tiếp tục"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InputEmail;
