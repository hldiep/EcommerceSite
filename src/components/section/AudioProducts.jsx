import React from 'react'
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const featuredAudioProducts = [
    {
        id: 1,
        name: 'Tai nghe Bluetooth Apple AirPods 4 | Chính hãng Apple',
        price: '3.090.000đ',
        originalPrice: '3.490.000đ',
        discount: 11,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-4-thumb.png',
    },
    {
        id: 2,
        name: 'Tai nghe Bluetooth Apple AirPods 4 chống ồn chủ động',
        price: '4.490.000đ',
        originalPrice: '4.790.000đ',
        discount: 6,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-4-chong-on-chu-dong-thumb.png',
    },
    {
        id: 3,
        name: 'Tai nghe Bluetooth Apple AirPods Pro 2 2023 USB-C',
        price: '5.390.000đ',
        originalPrice: '6.190.000đ',
        discount: 13,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/a/p/apple-airpods-pro-2-usb-c_1_.png',
    },
    {
        id: 4,
        name: 'Tai nghe Bluetooth Apple AirPods 2 | Chính hãng Apple',
        price: '2.990.000đ',
        originalPrice: '3.990.000đ',
        discount: 25,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_169_2.png',
    },
    {
        id: 5,
        name: 'Tai nghe không dây JBL Tune Beam 2',
        price: '2.345.000đ',
        originalPrice: null, // Không hiển thị giá gạch bỏ trong ảnh
        discount: null,
        rating: 4.8,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/t/a/tai-nghe-khong-day-jbl-tune-beam-2-thumb_2.png',
    },
];
const AudioProducts = () => {
    const navigate = useNavigate();
    return (
        <div className="px-4 mt-10">
            <button onClick={() => navigate('/mobile')}
                className="text-2xl font-bold mb-4">LAPTOP</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredAudioProducts.map((product) => (
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

export default AudioProducts