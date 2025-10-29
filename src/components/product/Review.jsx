import React, { useState } from "react";
import { ThumbsUp, Share2 } from "lucide-react";

const reviews = [
    {
        id: 1,
        user: { name: "Nguyễn Văn A" },
        rating: 5,
        title: "Rất hài lòng",
        content:
            "Điện thoại dùng mượt, pin trâu, sạc nhanh. Màn hình hiển thị đẹp, loa nghe to rõ. Giá so với cấu hình thì quá hợp lý.",
        date: "Đánh giá vào 1 tháng trước",
        adminReply: "Cảm ơn bạn đã tin tưởng sản phẩm! Chúc bạn sử dụng vui vẻ nhé."
    },
    {
        id: 2,
        user: { name: "Trần Thị B" },
        rating: 4,
        title: "Ổn trong tầm giá",
        content:
            "Máy chạy khá ổn, chụp hình đẹp nhưng hơi nóng khi chơi game nặng. Pin dùng tạm ổn trong 1 ngày.",
        date: "Đánh giá vào 2 tuần trước",
        adminReply: "Cảm ơn góp ý của bạn, chúng tôi sẽ cải thiện hiệu năng sản phẩm."
    },
    {
        id: 3,
        user: { name: "Phạm Văn C" },
        rating: 4,
        title: "Bình thường",
        content:
            "Máy dùng tạm, không có gì nổi bật. Camera ổn nhưng hiệu năng chưa được mượt mà lắm.",
        date: "Đánh giá vào 5 ngày trước",
    },
];

function StarRating({ count }) {
    return (
        <div className="flex text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < count ? "★" : "☆"}</span>
            ))}
        </div>
    );
}

const Review = () => {
    const [likes, setLikes] = useState({});

    const handleLike = (id) => {
        setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10">
                <div className="max-w-2xl mx-auto p-4 space-y-6">

                    <div className="p-6 rounded-2xl shadow-md border bg-white text-center">
                        <h2 className="text-xl font-semibold mb-2">Đánh giá sản phẩm</h2>
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold text-yellow-500">
                                {avgRating.toFixed(1)}
                            </span>
                            <StarRating count={Math.round(avgRating)} />
                            <p className="text-gray-600 text-sm mt-1">
                                {reviews.length} đánh giá
                            </p>
                        </div>
                    </div>

                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 rounded-2xl shadow-md border bg-white"
                        >
                            <div className="flex items-center space-x-3">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    alt={review.user.name}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <p className="font-semibold">{review.user.name}</p>
                                </div>
                            </div>

                            <div className="mt-3">
                                <div className="flex items-center gap-2">
                                    <StarRating count={review.rating} />
                                </div>
                                <h4 className="font-semibold mt-1">{review.title}</h4>
                                <p className="text-gray-700 mt-1">{review.content}</p>
                                <p className="text-xs text-gray-500 mt-2">{review.date}</p>
                            </div>

                            <div className="flex gap-6 mt-3 text-sm text-gray-600">
                                <button
                                    onClick={() => handleLike(review.id)}
                                    className={`flex items-center gap-1 ${likes[review.id] ? "text-blue-600" : ""
                                        }`}
                                >
                                    <ThumbsUp size={16} />
                                    Hữu ích
                                </button>
                                <button className="flex items-center gap-1">
                                    <Share2 size={16} />
                                    Chia sẻ
                                </button>
                            </div>

                            {review.adminReply && (
                                <div className="mt-4 p-3 bg-gray-50 border-l-4 border-blue-500 rounded-md">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold text-blue-600">Quản trị viên: </span>
                                        {review.adminReply}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Review;
