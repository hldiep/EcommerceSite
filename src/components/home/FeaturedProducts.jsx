import React from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const featuredPhones = [
    {
        id: 1,
        name: 'iPhone 16 Pro Max 256GB | Chính hãng VN/A',
        price: 30290000,
        originalPrice: 34990000,
        discount: 13,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png',
    },
    {
        id: 2,
        name: 'Xiaomi 14T Pro 12GB 512GB',
        price: 14890000,
        originalPrice: 17670000,
        discount: 16,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/x/i/xiaomi_14t_pro_1_.png',
    },
    {
        id: 3,
        name: 'Samsung Galaxy Z Flip6 12GB 256GB',
        price: 21990000,
        originalPrice: 28470000,
        discount: 23,
        rating: 5.0,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png',
    },
    {
        id: 4,
        name: 'Samsung Galaxy S25 Ultra 12GB 256GB',
        price: 28490000,
        originalPrice: 33380000,
        discount: 15,
        rating: 4.8,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png',
    },
    {
        id: 5,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png',
    },
];

const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
};

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/category');
    };
    return (
        <div className="px-4 mt-10">
            <button onClick={handleClick}
                className="text-2xl font-bold mb-4">ĐIỆN THOẠI NỔI BẬT</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredPhones.map((product) => (
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

                        <div className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</div>
                        <div className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</div>

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
};

export default FeaturedProducts;
