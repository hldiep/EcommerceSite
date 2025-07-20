import React, { useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoginModal from '../login/LoginModal';
const product = {
    name: "Điện thoại ZTE Blade A55",
    rating: 5,
    reviews: 2,
    originalPrice: 2090000,
    colors: [
        {
            name: "Đen",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/z/t/zte-a55-den.jpg",
            price: 1990000
        },
        {
            name: "Xanh dương",
            image: "https://cdn2.cellphones.com.vn/358x/media/catalog/product/z/t/zte-a55-xanh-duong.jpg",
            price: 1990000
        }
    ],
    variants: [
        {
            name: "A55 4GB 64GB",
            price: 1990000,
            highlights: [
                "Chip Unisoc SC9863A1 mạnh mẽ, mượt mà.",
                "Camera trước 8MP hỗ trợ gọi video rõ nét.",
                "Pin 5000mAh dùng cả ngày không lo hết pin."
            ]
        },
        {
            name: "A55 4GB 128GB",
            price: 2090000,
            highlights: [
                "Dung lượng 128GB lưu trữ thoải mái.",
                "RAM 4GB giúp đa nhiệm mượt hơn.",
                "Camera AI hỗ trợ chụp đêm tốt hơn."
            ]
        }
    ],
};

const formatCurrency = (amount) => new Intl.NumberFormat("vi-VN").format(amount) + "đ";

const specifications = [
    { label: "Kích thước màn hình", value: "6.75 inches" },
    { label: "Camera sau", value: "13M AF + AI Camera" },
    { label: "Camera trước", value: "8M FF" },
    { label: "Chipset", value: "Unisoc SC9863A1" },
    { label: "Công nghệ NFC", value: "Không" },
    { label: "Dung lượng RAM", value: "4 GB" },
    { label: "Bộ nhớ trong", value: "64 GB" },
    { label: "Pin", value: "5000 mAh" },
    { label: "Thẻ SIM", value: "2 SIM (Nano-SIM)" },
    { label: "Hệ điều hành", value: "Android U" },
    { label: "Độ phân giải màn hình", value: "720 x 1600 pixel" },
    { label: "Tính năng màn hình", value: "Tần số quét 90Hz" },
    { label: "Loại CPU", value: "Octa-Core 1.6GHz" }
];
const results = [
    {
        id: 1,
        name: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A',
        price: 30290000,
        originalPrice: 34990000,
        discount: 13,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
    },
    {
        id: 2,
        name: 'Xiaomi 14T Pro 12GB 512GB',
        price: 14890000,
        originalPrice: 17670000,
        discount: 16,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14t_pro_1_.png',
    },
];

const ratingSummary = {
    average: 5,
    total: 1,
    breakdown: [1, 0, 0, 0, 0],
    aspects: [
        { name: "Hiệu năng", score: 5 },
        { name: "Thời lượng pin", score: 5 },
        { name: "Chất lượng camera", score: 5 },
    ]
};

const reviews = [
    {
        name: "Nguyễn Hoàng Hiệp",
        avatar: "N",
        rating: 5,
        verified: true,
        tags: [
            "Hiệu năng Siêu mạnh mẽ",
            "Thời lượng pin Cực khủng",
            "Chất lượng camera Chụp đẹp, chuyên nghiệp"
        ],
        comment: "Đẹp ạ máy khỏe pin trâu cấu hình ổn",
        timeAgo: "4 tháng trước",
    }
];
const Detail = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    <button onClick={() => navigate('/mobile')}
                        className="text-gray-700">Điện thoại</button>
                    <span className="text-gray-700">/</span>
                    <button onClick={() => navigate('/brand')}
                        className="text-gray-700">Nhãn hàng</button>
                    <span className="text-gray-700">/</span>
                    <span className="text-black font-medium">Điện thoại iPhone 16</span>

                </div>
                <div className="max-w-6xl mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <div className="text-yellow-500 flex items-center mb-4">
                        <span>⭐ {product.rating}</span>
                        <span className="text-gray-600 ml-2">({product.reviews} đánh giá)</span>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Image & Highlights */}
                        <div className="md:w-1/2 ">
                            <div className="flex justify-start gap-2 mb-2">
                                <button className="flex items-center gap-1 text-sm bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100">
                                    Yêu thích
                                </button>
                                <button className="flex items-center gap-1 text-sm bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100">
                                    Thông số
                                </button>
                                <button className="flex items-center gap-1 text-sm bg-white border border-gray-300 px-3 py-1 rounded-full hover:bg-gray-100">
                                    So sánh
                                </button>
                            </div>
                            <div className='bg-pink-100 p-4 rounded-xl'>
                                <img src={selectedColor.image} alt={selectedColor.name} className="w-48 mx-auto mb-4" />
                                <h2 className="text-xl font-semibold mb-2">TÍNH NĂNG NỔI BẬT</h2>
                                <ul className="list-disc pl-6 text-sm text-gray-700 space-y-1">
                                    {selectedVariant.highlights.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="mt-10">
                                <h2 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h2>
                                <div className="overflow-x-auto rounded-xl border border-gray-200">
                                    <table className="min-w-full bg-white">
                                        <tbody>
                                            {specifications.map((spec, index) => (
                                                <tr
                                                    key={index}
                                                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                                                >
                                                    <td className="py-2 px-4 font-medium text-gray-700 w-1/2 border-b">
                                                        {spec.label}
                                                    </td>
                                                    <td className="py-2 px-4 text-gray-600 border-b">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="md:w-1/2 space-y-4">
                            <div>
                                <p className="text-gray-600">Giá sản phẩm</p>
                                <div className='flex space-x-2 items-center'>
                                    <p className="text-red-600 text-2xl font-bold">{formatCurrency(selectedVariant.price)}</p>
                                    <p className="line-through text-gray-400">{formatCurrency(product.originalPrice)}</p>
                                </div>

                            </div>

                            <div>
                                <p className="font-semibold">Phiên bản</p>
                                <div className="flex gap-2 mt-2">
                                    {product.variants.map((v) => (
                                        <button
                                            key={v.name}
                                            className={`px-3 py-1 border rounded-full ${selectedVariant.name === v.name ? "bg-red-600 text-white" : "bg-white text-gray-700"}`}
                                            onClick={() => setSelectedVariant(v)}
                                        >
                                            {v.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold">Màu sắc</p>
                                <div className="flex gap-3 mt-2">
                                    {product.colors.map((c) => (
                                        <button
                                            key={c.name}
                                            className={`border p-2 rounded-xl flex items-center w-40 justify-start gap-3 ${selectedColor.name === c.name ? "border-red-600" : "border-gray-300"
                                                }`}
                                            onClick={() => setSelectedColor(c)}
                                        >
                                            <img src={c.image} alt={c.name} className="w-10 h-10 object-cover rounded-md" />
                                            <div className="text-left">
                                                <p className="text-sm">{c.name}</p>
                                                <p className="text-sm text-gray-600">{c.price?.toLocaleString("vi-VN")}đ</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                            </div>

                            <div className="bg-gray-100 p-3 rounded-xl text-sm">
                                <span className="font-semibold text-red-600">Ưu đãi:</span> Học sinh – sinh viên, Giảng viên – giáo viên được giảm thêm{" "}
                                <span className="font-bold text-red-600">
                                    {formatCurrency(selectedVariant.price * 0.05)}
                                </span>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={() => {
                                    if (user) {
                                        navigate('/payment');
                                    } else {
                                        toast.info('Vui lòng đăng nhập để mua sản phẩm');
                                        setShowModal(true);
                                    }
                                }}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                                    Mua ngay
                                </button>
                                <LoginModal show={showModal} onClose={() => setShowModal(false)} />
                                <button onClick={() => {
                                    if (user) {
                                        toast.success('Thêm vào giỏ thành công')
                                    } else {
                                        toast.info('Vui lòng đăng nhập để thêm vào giỏ');
                                        setShowModal(true);
                                    }
                                }}
                                    className="flex-1 border border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4">Có thể bạn cũng thích</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                            {results.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-lg transition p-3 relative group"
                                >
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-xl">
                                        Giảm {product.discount}%
                                    </div>

                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-[240px] object-contain mb-2 transition-transform duration-300 group-hover:scale-[1.015]"
                                    />

                                    <h3 className="text-sm font-medium mb-1 h-[40px] line-clamp-2">
                                        {product.name}
                                    </h3>

                                    <div className="text-red-600 font-bold text-lg">{product.price}</div>
                                    <div className="text-gray-400 text-sm line-through">{product.originalPrice}</div>

                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12 bg-white rounded-xl shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Đánh giá {product.name}</h2>

                        <div className="flex flex-col md:flex-row justify-between gap-8">

                            <div className="md:w-1/2 bg-gray-50 p-4 rounded-lg">
                                <p className="text-4xl font-bold text-gray-800">{ratingSummary.average}.0<span className="text-xl text-gray-500">/5</span></p>
                                <div className="text-yellow-400 text-xl">★★★★★</div>
                                <p className="text-sm text-gray-600 mb-4">{ratingSummary.total} lượt đánh giá</p>
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg">Viết đánh giá</button>

                                <div className="mt-4 space-y-1">
                                    {[5, 4, 3, 2, 1].map((star, index) => (
                                        <div key={star} className="flex items-center gap-2 text-sm">
                                            <span>{star} ★</span>
                                            <div className="w-40 h-2 bg-gray-200 rounded-full">
                                                <div
                                                    className="h-2 bg-red-500 rounded-full"
                                                    style={{ width: `${(ratingSummary.breakdown[5 - star] / ratingSummary.total) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span>{ratingSummary.breakdown[5 - star]} đánh giá</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="md:w-1/2 bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">Đánh giá theo trải nghiệm</h3>
                                {ratingSummary.aspects.map((aspect) => (
                                    <div key={aspect.name} className="flex justify-between items-center mb-1 text-sm">
                                        <span>{aspect.name}</span>
                                        <div className="text-yellow-400">★★★★★</div>
                                        <span className="text-gray-500">{aspect.score}/5 ({ratingSummary.total} đánh giá)</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-medium mb-2">Lọc đánh giá theo</h3>
                            <div className="flex flex-wrap gap-2">
                                {["Tất cả", "Có hình ảnh", "Đã mua hàng", "5 sao", "4 sao", "3 sao", "2 sao", "1 sao"].map((filter) => (
                                    <button key={filter} className="border border-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-100">
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 space-y-6">
                            {reviews.map((review, idx) => (
                                <div key={idx} className="border-t pt-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">{review.avatar}</div>
                                        <div>
                                            <p className="font-semibold">{review.name}</p>
                                            <p className="text-yellow-400 text-sm">★★★★★ <span className="text-gray-500 ml-2">Tuyệt vời</span></p>
                                            {review.verified && <p className="text-green-600 text-sm">✔️ Đã mua tại website</p>}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {review.tags.map((tag, i) => (
                                            <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-sm">{tag}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-700">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-1">Đánh giá đã đăng vào {review.timeAgo}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Detail