import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { addReviews, fetchReviewsByProductId } from '../../api/review';

const ReviewPage = () => {
    const { productVariantId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const productId = location.state?.productId;
    const productVariant = location.state?.productVariant;
    const [isChecking, setIsChecking] = useState(true); 
    const [allowReview, setAllowReview] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    console.log("Data", productVariant)
    useEffect(() => {
        const checkReview = async () => {
            try {
                await fetchReviewsByProductId({
                    productId,
                    page: 0,
                    size: 1
                });

                toast.info("Bạn đã đánh giá sản phẩm này trước đó.");
                navigate(`/detail/${productId}`);

            } catch (err) {
                console.log("Check review error:", err);

                if (
                    err.message?.includes("Review not found for this customer and product")
                ) {
                    setAllowReview(true);
                } else {
                    toast.error("Lỗi khi kiểm tra đánh giá!");
                }
            } finally {
                setIsChecking(false);
            }
        };

        checkReview();
    }, [productId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Vui lòng chọn số sao!");
            return;
        }

        const payload = {
            productId: Number(productId),
            productVariantId: Number(productVariantId),
            rating,
            comment
        };

        try {
            await addReviews(payload);
            toast.success("Đánh giá thành công!");
            navigate("/profile");
        } catch (err) {
            toast.error("Lỗi khi gửi đánh giá!");
        }
    };

    if (isChecking) {
        return <div className="mt-32 text-center text-gray-600">Đang kiểm tra đánh giá...</div>;
    }

    if (!allowReview) {
        return null;
    }

    return (
        <div className='min-h-screen'>            
            <div className="max-w-xl mx-auto mt-32 bg-white p-6 rounded shadow">
                <h2 className="text-xl font-bold mb-4">Đánh giá sản phẩm</h2>

                <div className="flex gap-4 border rounded-lg p-4 mb-6 bg-gray-50">
                    <img
                        src={productVariant?.imageUrl || productVariant?.product?.thumbnail}
                        alt={productVariant?.name}
                        className="w-24 h-24 object-cover rounded border"
                    />

                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                            {productVariant?.product?.name}
                        </h3>

                        <p className="text-sm text-gray-600 mt-1">
                            Phiên bản: {productVariant?.name}
                        </p>
                        <div className='flex items-center space-x-3 mt-2'>
                            <div className="text-red-600 font-bold">
                                {productVariant?.priceSale?.toLocaleString("vi-VN")} ₫
                            </div>
                            <div className="text-gray-400 text-sm line-through">{productVariant?.price?.toLocaleString("vi-VN")} ₫</div>
                        </div>
                        
                    </div>
                </div>

                <p className="mb-4 text-gray-600">
                    Mã sản phẩm: <b>{productVariantId}</b>  
                </p>

                <div className="flex mb-4 space-x-1">
                    {[1,2,3,4,5].map(star => (
                        <span
                            key={star}
                            className={`cursor-pointer text-2xl ${
                                rating >= star ? "text-yellow-400" : "text-gray-300"
                            }`}
                            onClick={() => setRating(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    placeholder="Viết đánh giá..."
                    className="w-full border p-2 rounded mb-4 outline-none"
                />

                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Gửi đánh giá
                </button>
            </div>
        </div>
    );
};

export default ReviewPage;
