import React, { useEffect, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { getShipFee, sendOtp } from '../../api/order';
import { toast } from 'react-toastify';

const ThanhToan = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [orderData, setOrderData] = useState({});

    const [shipFee, setShipFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('COD');

    useEffect(() => {
        let savedProducts = location.state?.products;
        let savedOrderData = location.state?.orderData;

        if (!savedProducts || !savedOrderData) {
            const stored = localStorage.getItem("quickOrderData");
            if (stored) {
                const parsed = JSON.parse(stored);
                savedProducts = parsed.products;
                savedOrderData = parsed.orderData;
            }
        }

        if (!savedProducts || !savedOrderData) {
            navigate('/quick-order');
            return;
        }

        setProducts(savedProducts);
        setOrderData(savedOrderData);

        // Tính toán
        const totalPrice = savedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discountAmount = totalPrice * discount;
        const finalAmount = totalPrice - discountAmount + shipFee;

        const updatedQuickOrderData = {
            products: savedProducts,
            orderData: {
                ...savedOrderData,
                payment: { method: selectedPaymentMethod }
            },
            shipFee,
            finalAmount
        };

        localStorage.setItem("quickOrderData", JSON.stringify(updatedQuickOrderData));

    }, [location.state, navigate, selectedPaymentMethod, discount, shipFee]);

    useEffect(() => {
        if (orderData?.deliveryAddress) {
            getShipFee(orderData.deliveryAddress).then((fee) => {
                setShipFee(typeof fee === 'number' ? fee : 0);
            });
        }
    }, [orderData]);

    const applyCoupon = () => {
        if (coupon === 'GIAM10') {
            setDiscount(0.1);
        } else {
            setDiscount(0);
        }
    };

    const totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = totalPrice * discount;
    const finalAmount = totalPrice - discountAmount + shipFee;
    const handlePlaceOrder = async () => {
        try {
            const items = products.map((item) => {
                const obj = { productVariantId: item.productVariantId, quantity: item.quantity };
                if (coupon.trim()) obj.discountCode = coupon.trim();
                return obj;
            });

            const finalOrderData = {
                items,
                orderTime: new Date().toISOString(),
                note: orderData.note || "",
                deliveryAddress: orderData.deliveryAddress,
                recipientName: orderData.recipientName,
                recipientPhone: orderData.recipientPhone,
                email: orderData.email,
                payment: {
                    method: selectedPaymentMethod
                },
            };
            if (!finalOrderData.email) {
                toast.info("Vui lòng nhập email để nhận OTP");
                return;
            }
            if (coupon.trim()) {
                finalOrderData.discountCode = coupon.trim();
            }
            console.log("Dữ liệu gửi OTP:", finalOrderData);
            await sendOtp(finalOrderData.email);

            localStorage.setItem("pendingOrder", JSON.stringify(finalOrderData));

            navigate("/quick-order/verify-otp");
        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            toast.error("Đặt hàng thất bại, vui lòng thử lại.");
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10 px-4">
                <div className="flex items-center space-x-2 text-gray-700 mb-4">
                    <button onClick={() => navigate(-1)} className="hover:text-red-600 transition">
                        <FaChevronLeft />
                    </button>
                    <h2 className="text-xl font-bold">Thanh toán</h2>
                </div>

                <div className="p-4 rounded max-w-5xl mx-auto">
                    <div className="flex border-b border-gray-300 mb-4">
                        <div className="px-4 py-2 text-gray-500">1. THÔNG TIN</div>
                        <div className="px-4 py-2 text-red-600 font-semibold border-b-2 border-red-600">
                            2. THANH TOÁN
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 mb-6">
                        <div className="mb-4">
                            <label className="text-gray-600 text-sm block mb-1">
                                Nhập mã giảm giá (chỉ áp dụng 1 lần)
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="flex-1 border px-3 py-2 rounded-l-md outline-none"
                                    placeholder="Nhập mã..."
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                />
                                <button
                                    className="bg-gray-200 px-4 py-2 rounded-r-md text-sm"
                                    onClick={applyCoupon}
                                    type="button"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between">
                                <span>Số lượng sản phẩm</span>
                                <span>{totalQuantity} sản phẩm</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng tiền hàng</span>
                                <span>{totalPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>{shipFee === 0 ? 'Miễn phí' : shipFee}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Giảm giá ({(discount * 100).toFixed(0)}%)</span>
                                    <span>-{discountAmount}</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mt-4 font-semibold text-lg">
                            <span className="text-black">Tổng tiền thanh toán</span>
                            <span className="text-black">{finalAmount}</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border mb-4">
                        <div className="flex items-center mb-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
                                alt="payment"
                                className="w-6 h-6 mr-2"
                            />
                            <span className="text-red-600 font-medium">
                                Chọn phương thức thanh toán
                            </span>
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="COD"
                                    checked={selectedPaymentMethod === 'COD'}
                                    onChange={() => setSelectedPaymentMethod('COD')}
                                />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className="flex items-center space-x-2 mt-2">
                                <input
                                    type="radio"
                                    name="payment"
                                    value="CREDIT_CARD"
                                    checked={selectedPaymentMethod === 'CREDIT_CARD'}
                                    onChange={() => setSelectedPaymentMethod('CREDIT_CARD')}
                                />
                                <span>Chuyển khoản ngân hàng</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg border mb-4">
                        <h3 className="text-gray-800 font-semibold text-lg mb-3 border-b pb-1">
                            THÔNG TIN NHẬN HÀNG
                        </h3>
                        <div className="text-sm text-gray-800 space-y-2">
                            <div className="flex">
                                <span className="w-40 text-gray-500">Khách hàng</span>
                                <span>{orderData?.recipientName}</span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Số điện thoại</span>
                                <span>{orderData?.recipientPhone}</span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Nhận hàng tại</span>
                                <span>
                                    {orderData.deliveryAddress}
                                </span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Người nhận</span>
                                <span>{orderData.recipientName} - {orderData.recipientPhone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sticky bottom-0">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Tổng tiền:</span>
                            <span className="text-red-600">{finalAmount} VNĐ</span>
                        </div>
                        <button
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded text-base font-semibold"
                            onClick={handlePlaceOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThanhToan;
