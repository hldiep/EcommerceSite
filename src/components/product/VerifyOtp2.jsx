import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "../../api/order";
import { toast } from "react-toastify";

const VerifyOtp2 = () => {
    const [otp, setOtp] = useState("");
    const [pendingOrder, setPendingOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedOrder = localStorage.getItem("pendingOrder");
        if (storedOrder) {
            setPendingOrder(JSON.parse(storedOrder));
        } else {
            alert("Không tìm thấy đơn hàng.");
            navigate("/checkout");
        }
    }, [navigate]);

    const handleConfirmOrder = async () => {
        if (!otp.trim()) {
            alert("Vui lòng nhập mã OTP");
            return;
        }

        if (!pendingOrder?.email) {
            toast.info("Không có thông tin email để xác thực.");
            return;
        }

        try {
            const token = await verifyOtp(pendingOrder.email, otp);

            localStorage.setItem("TEMP_ORDER_TOKEN", token);

            toast.success("Xác thực OTP thành công!");
            navigate("/checkout/confirm");
        } catch (error) {
            console.error("Lỗi xác thực OTP:", error);
            toast.error(error.message || "Có lỗi xảy ra khi xác thực OTP.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Xác nhận OTP</h2>
                <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Nhập mã OTP"
                    className="border p-2 w-full mb-4"
                />
                <button
                    onClick={handleConfirmOrder}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600"
                >
                    Xác nhận
                </button>
            </div>
        </div>
    );
};

export default VerifyOtp2;
