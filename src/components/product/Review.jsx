import React, { useEffect, useState } from "react";
import { ThumbsUp, Share2 } from "lucide-react";
import { fetchReviewsByProductId } from "../../api/review";

function StarRating({ count }) {
    return (
        <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < count ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

export default function Review({ productId }) {
    const [review, setReview] = useState(null);
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleLike = () => setLiked(!liked);

    useEffect(() => {
    const loadReview = async () => {
        try {
            const res = await fetchReviewsByProductId({ productId });

            console.log("fetchReviewsByProductId response:", res);

            const reviewObj = res?.data ?? res ?? null;
            setReview(reviewObj);
        } catch (err) {
            console.error("Lỗi fetch review:", err);
            setError("Chưa có đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    if (productId) {
        loadReview();
    }
}, [productId]);

    if (loading) {
        return <div className="p-10 text-center">Đang tải đánh giá...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">{error}</div>;
    }

    if (!review) {
        return <div className="p-10 text-center">Sản phẩm chưa có đánh giá.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="container mb-10">
                <div className="max-w-2xl mx-auto p-4 space-y-6">

                    <div className="p-6 rounded-2xl shadow-md border bg-white text-center">
                        <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>

                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-yellow-500">
                                {review.rating}.0
                            </span>

                            <StarRating count={review.rating} />

                            <p className="text-gray-600 text-sm mt-1">
                                1 đánh giá
                            </p>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl shadow-md border bg-white">
                        <div className="flex items-center space-x-3">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                alt={review.fullName}
                                className="w-12 h-12 rounded-full"
                            />
                            <div>
                                <p className="font-semibold">{review.fullName}</p>
                                <p className="text-xs text-gray-500">@{review.username}</p>
                            </div>
                        </div>

                        <div className="mt-3">
                            <StarRating count={review.rating} />

                            <p className="text-gray-700 mt-2">{review.comment}</p>

                            <p className="text-xs text-gray-500 mt-2">
                                Trạng thái: {review.status}
                            </p>
                        </div>

                        <div className="flex gap-6 mt-3 text-sm text-gray-600">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-1 ${liked ? "text-blue-600" : ""}`}
                            >
                                <ThumbsUp size={16} />
                                Hữu ích
                            </button>

                            <button className="flex items-center gap-1">
                                <Share2 size={16} />
                                Chia sẻ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
