import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { addOrder } from "../../api/order";
import { toast } from "react-toastify";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderInfo }) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [orderInfo2, setOrderInfo2] = useState(null);
    const [finalAmount, setFinalAmount] = useState(0);
    const [cardInfo, setCardInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const storedData = localStorage.getItem("quickOrderData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                if (parsed?.orderData && parsed?.products) {
                    setOrderInfo2(parsed.orderData);
                    setFinalAmount(parsed.finalAmount || 0);
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.info("Stripe chưa sẵn sàng");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch("https://api.stripe.com/v1/payment_intents", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_STRIPE_SECRET_KEY}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    amount: Math.round(finalAmount),
                    currency: "vnd",
                    "payment_method_types[]": "card",
                }),
            });

            const data = await res.json();
            console.log("🔹 PaymentIntent created:", data);

            if (!data.client_secret) {
                toast.info("Không tạo được PaymentIntent");
                setLoading(true);
                return;
            }

            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                data.client_secret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: orderInfo?.orderData?.recipientName || "Khách hàng",
                        },
                    },
                }
            );

            if (error) {
                console.error("Lỗi Stripe confirm:", error);
                toast.error(error.message);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                console.log("Thanh toán thành công:", paymentIntent);
                const payload = {
                    items: orderInfo.products.map((item) => ({
                        productVariantId: item.productVariantId,
                        quantity: item.quantity,
                        discountCode: orderInfo.coupon || undefined,
                    })),
                    orderTime: new Date().toISOString(),
                    note: orderInfo.orderData.note || "",
                    deliveryAddress: orderInfo.orderData.deliveryAddress,
                    // deliveryAddress: {
                    //     province: orderInfo.orderData.province,
                    //     district: orderInfo.orderData.district,
                    //     commune: orderInfo.orderData.commune,
                    //     detail: orderInfo.orderData.addressDetail,
                    // },
                    recipientName: orderInfo.orderData.recipientName,
                    recipientPhone: orderInfo.orderData.recipientPhone,
                    payment: {
                        method: "CREDIT_CARD",
                        transactionId: paymentIntent.id,
                        status: "PAID",
                    },
                    status: "CONFIRMED",
                };

                console.log("Payload gửi addOrder:", payload);

                try {
                    const savedOrder = await addOrder(payload);
                    toast.success("Thanh toán thành công!");
                    navigate("/payment-success", { state: { order: savedOrder } });
                } catch (orderErr) {
                    console.error("Lỗi lưu đơn:", orderErr);
                    toast.error("Lưu đơn thất bại!");
                }
            }
        } catch (err) {
            console.error("Lỗi handleSubmit:", err);
            console.error("Có lỗi xảy ra khi thanh toán");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10 px-4">
                <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
                    <h2 className="text-lg font-bold mb-4">Nhập thông tin thẻ</h2>
                    <CardElement className="border p-2 rounded mb-4" />
                    <button
                        type="submit"
                        disabled={!stripe}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                                Đang xử lý...
                            </span>
                        ) : (
                            <>Thanh toán {finalAmount.toLocaleString()} VNĐ</>
                        )}
                    </button>
                </form>
                {cardInfo && (
                    <div className="mt-4 p-3 border rounded bg-gray-100">
                        <p><strong>Loại thẻ:</strong> {cardInfo.brand.toUpperCase()}</p>
                        <p><strong>4 số cuối:</strong> {cardInfo.last4}</p>
                        <p><strong>Hết hạn:</strong> {cardInfo.exp_month}/{cardInfo.exp_year}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const CreditCardPayment = () => {
    const location = useLocation();
    const orderInfo = location.state;

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm orderInfo={orderInfo} />
        </Elements>
    );
};

export default CreditCardPayment;
