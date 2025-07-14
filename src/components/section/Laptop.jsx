import React from 'react'
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const featuredLaptops = [
    {
        id: 1,
        name: 'Apple MacBook Air M2 2024 8CPU 8GPU 16GB 256GB',
        price: '19.890.000đ',
        originalPrice: '24.990.000đ',
        discount: 20,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/m/image_1396_1.png',
    },
    {
        id: 2,
        name: 'Laptop HP Gaming Victus 15-FA1139TX 8Y6W3PA i5-12450H/RTX 2050/16GB/512GB',
        price: '16.490.000đ',
        originalPrice: '24.590.000đ',
        discount: 33,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/e/text_d_i_6_35.png',
    },
    {
        id: 3,
        name: 'MacBook Air M4 13 inch 2025 10CPU 8GPU 16GB 256GB',
        price: '25.690.000đ',
        originalPrice: '26.990.000đ',
        discount: 5,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/macbook_11_1.png',
    },
    {
        id: 4,
        name: 'Laptop ASUS Vivobook 15 X1502VA-BQ885W i5-13420H/16GB/512GB',
        price: '13.990.000đ',
        originalPrice: '15.990.000đ',
        discount: 13,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_42.png',
    },
    {
        id: 5,
        name: 'Laptop Acer Aspire Lite 15 AL15-41P-R3U5 R7-5700U/16GB/512GB',
        price: '12.590.000đ',
        originalPrice: '12.990.000đ',
        discount: 3,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_659_1__21.png',
    },
];

const Laptop = () => {
    const navigate = useNavigate();
    return (
        <div className="px-4 mt-10">
            <button onClick={() => navigate('/mobile')}
                className="text-2xl font-bold mb-4">LAPTOP</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredLaptops.map((product) => (
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

export default Laptop