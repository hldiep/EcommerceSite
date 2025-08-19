import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    useEffect(() => {
        console.log("Order info:", order);
    }, [order]);
    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Không tìm thấy thông tin đơn hàng</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10 px-4 max-w-3xl bg-white shadow rounded-lg p-6">
                <div className="text-center">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                        alt="Đặt hàng thành công"
                        className="mx-auto mb-6 w-24 h-24"
                    />
                    <h1 className="text-2xl font-bold text-green-600 mb-4">Đặt hàng thành công!</h1>
                    <p>
                        Mã đơn hàng: <strong>{order?.id || 'N/A'}</strong>
                    </p>
                    <p className="text-gray-600 mt-2">Cảm ơn bạn đã mua sắm cùng chúng tôi.</p>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Thông tin đơn hàng</h2>
                    <div className="text-sm text-gray-700 space-y-2">
                        <div className="flex justify-between">
                            <span>Người nhận:</span>
                            <span>{order.recipientName} - {order.recipientPhone}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Địa chỉ giao hàng:</span>
                            <span>{order.deliveryAddress}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Phương thức thanh toán:</span>
                            <span>{order.payment?.method}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 border-t pt-4">
                    <h2 className="text-lg font-semibold mb-2">Sản phẩm</h2>
                    <div>
                        {order.orderItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-2 border-b">
                                <img
                                    src={item.productVariant.imageUrl}
                                    alt={item.productVariant.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium">{item.productVariant.name}</p>
                                    <p className="text-sm text-gray-600">
                                        SL: {item.quantity} ×{" "}
                                        {item.unitAmount.toLocaleString("vi-VN")} ₫
                                    </p>
                                </div>
                                <p className="font-semibold text-red-500">
                                    {(item.unitAmount * item.quantity).toLocaleString("vi-VN")} ₫
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-1 mt-6">
                    <p>Tạm tính: {order.totalAmount.toLocaleString("vi-VN")} ₫</p>
                    <p>Phí ship: {order.shipAmount.toLocaleString("vi-VN")} ₫</p>
                    <p>Giảm giá: {order.discountAmount?.toLocaleString("vi-VN") || 0} ₫</p>
                    <p className="font-bold text-lg">
                        Tổng thanh toán: {order.finalAmount.toLocaleString("vi-VN")} ₫
                    </p>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
