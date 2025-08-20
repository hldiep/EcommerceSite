import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { placeOrder } from "../../api/order";

const ConfirmOrder = () => {
    const [orderInfo, setOrderInfo] = useState(null); // orderData
    const [products, setProducts] = useState([]); // danh sách sản phẩm
    const navigate = useNavigate();
    const [finalAmount, setFinalAmount] = useState(0);
    const [shipFee, setShipFee] = useState(0);
    const [coupon, setCoupon] = useState('');
    useEffect(() => {
        const storedData = localStorage.getItem("quickOrderData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed?.orderData && parsed?.products) {
                    setOrderInfo(parsed.orderData);
                    setProducts(parsed.products);
                    setFinalAmount(parsed.finalAmount || 0);
                    setShipFee(parsed.shipFee || 0);
                } else {
                    navigate("/cart");
                }
            } catch (error) {
                console.error("Lỗi parse quickOrderData:", error);
                navigate("/cart");
            }
        } else {
            navigate("/cart");
        }
    }, [navigate]);

    const handleConfirmOrder = async () => {

        if (!orderInfo || !products.length) {
            toast.error("Không có dữ liệu đơn hàng");
            return;
        }

        if (orderInfo.payment?.method === "CREDIT_CARD") {
            navigate("/credit-card-payment", {
                state: {
                    products,
                    orderData: orderInfo,
                    coupon: orderInfo.discountCode || "",
                    discount: orderInfo.discount || 0,
                    shipFee: orderInfo.shipFee || 0,
                    totalPrice: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
                    finalAmount: orderInfo.finalAmount || 0
                }
            });
            return;
        }
        const items = products.map((item) => {
            const obj = {
                productVariantId: item.productVariantId,
                quantity: item.quantity,
            };
            if (coupon.trim()) {
                obj.discountCode = coupon.trim();
            }
            return obj;
        });

        const finalOrderData = {
            items,
            orderTime: orderInfo.orderTime || new Date().toISOString(),
            note: orderInfo.note || "",
            deliveryAddress: orderInfo.deliveryAddress,
            recipientName: orderInfo.recipientName,
            recipientPhone: orderInfo.recipientPhone,
            payment: {
                method: orderInfo.payment?.method
            }
        };

        if (orderInfo.discountCode?.trim()) {
            finalOrderData.discountCode = orderInfo.discountCode.trim();
        }
        console.log("Dữ liệu gửi lên:", finalOrderData);

        try {
            const data = await placeOrder(finalOrderData);
            toast.success("Đặt hàng thành công!");
            navigate("/payment-success", { state: { order: data } });
        } catch (error) {
            toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
            console.error("Lỗi đặt hàng:", error);
        }
    };
    if (!orderInfo) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10">
                <h1 className="text-2xl font-bold mb-4">Xác nhận đơn hàng</h1>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
                    <p><strong>Họ tên:</strong> {orderInfo.recipientName}</p>
                    <p><strong>Email:</strong> {orderInfo.email}</p>
                    <p><strong>Số điện thoại:</strong> {orderInfo.recipientPhone}</p>
                    <p><strong>Địa chỉ:</strong> {orderInfo.deliveryAddress}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Sản phẩm</h2>
                    <table className="w-full border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2">Tên sản phẩm</th>
                                <th className="border p-2">Số lượng</th>
                                <th className="border p-2">Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, idx) => (
                                <tr key={idx}>
                                    <td className="border p-2 flex items-center gap-2">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-12 h-12 object-contain border"
                                        />
                                        <div>
                                            <div className="font-medium">{product.name}</div>
                                            <div className="text-sm text-gray-500">{product.variantName}</div>
                                            <div className="text-xs text-gray-400">{product.brand}</div>
                                        </div>
                                    </td>
                                    <td className="border p-2 text-center">{product.quantity}</td>
                                    <td className="border p-2 text-right">
                                        {(product.price * product.quantity).toLocaleString()} ₫
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 text-right space-y-1">
                        <div>Phí vận chuyển: {shipFee.toLocaleString()} ₫</div>
                        <div className="font-bold text-lg">
                            Tổng cộng: {finalAmount.toLocaleString()} ₫
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <p className="text-lg font-bold">
                        Tổng cộng: {finalAmount.toLocaleString()} ₫
                    </p>
                    <button
                        onClick={handleConfirmOrder}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
                    >
                        Xác nhận đặt hàng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmOrder;
