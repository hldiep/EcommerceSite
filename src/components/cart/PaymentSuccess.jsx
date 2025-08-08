import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
            <div className="container mt-20 mb-10 px-4 text-center">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    alt="Đặt hàng thành công"
                    className="mx-auto mb-6 w-24 h-24"
                />

                <h1 className="text-2xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h1>
                <p>
                    Mã đơn hàng: <strong>{order?.id || 'N/A'}</strong>
                </p>
                <p className="text-gray-600 mt-2">
                    Cảm ơn bạn đã mua sắm cùng chúng tôi.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccess;