import React from "react";
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

const stripePromise = loadStripe("pk_test_");

const CheckoutForm = ({ orderInfo }) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            toast.info("Stripe chưa sẵn sàng");
            return;
        }

        try {
            const res = await fetch("https://api.stripe.com/v1/payment_intents", {
                method: "POST",
                headers: {
                    Authorization: `Bearer sk_test_`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    amount: Math.round(orderInfo.finalAmount * 100 / 1000), // VND
                    currency: "vnd",
                    "payment_method_types[]": "card",
                }),
            });

            const data = await res.json();
            console.log("🔹 PaymentIntent created:", data);

            if (!data.client_secret) {
                toast.info("Không tạo được PaymentIntent");
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
                        Thanh toán {orderInfo.finalAmount} VNĐ
                    </button>
                </form>
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
