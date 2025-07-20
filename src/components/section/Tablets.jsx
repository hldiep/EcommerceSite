import React from 'react'
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const featuredTablets = [
    {
        id: 1,
        name: 'iPad A16 Wifi 128GB 2025 | Chính hãng Apple Việt Nam',
        price: '9.590.000đ',
        originalPrice: '9.990.000đ',
        discount: 4,
        rating: 4.7,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-a16-11-inch_10_.jpg',
    },
    {
        id: 2,
        name: 'Máy tính bảng Teclast P30 4GB 64GB',
        price: '1.990.000đ',
        originalPrice: '2.490.000đ',
        discount: 20,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-teclast-p30.png',
    },
    {
        id: 3,
        name: 'Máy tính bảng Teclast T50 Plus 6GB 256GB',
        price: '3.990.000đ',
        originalPrice: '4.990.000đ',
        discount: 20,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-teclast-t50-plus_1_.png',
    },
    {
        id: 4,
        name: 'iPad Air 11 inch M3 Wifi 128GB 2025 | Chính hãng Apple Việt Nam',
        price: '16.390.000đ',
        originalPrice: '16.990.000đ',
        discount: 4,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/ipad-air-11-wifi-1.jpg',
    },
    {
        id: 5,
        name: 'Máy tính bảng Lenovo IdeaPad Tab Pro Wifi 8GB 256GB',
        price: '11.490.000đ',
        originalPrice: '11.990.000đ',
        discount: 4,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/may-tinh-bang-lenovo-idea-tab-pro-kem-but-ban-phim_1_.png',
    },
];
const Tablets = () => {
    const navigate = useNavigate();
    return (
        <div className="px-4 mt-10">
            <button onClick={() => navigate('/mobile')}
                className="text-2xl font-bold mb-4">MÀN HÌNH, MÁY TÍNH ĐỂ BÀN</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredTablets.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => navigate('/detail')}
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

                        <div className="flex items-center justify-between text-sm mt-2">
                            <div className="flex items-center gap-1 text-yellow-500">
                                <FaStar className="text-xs" /> {product.rating}
                            </div>
                            <div className="text-red-500 flex items-center gap-1">
                                <FaHeart className="text-xs" /> Yêu thích
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}

export default Tablets