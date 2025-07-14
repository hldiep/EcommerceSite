import React from 'react'
import { BiSortDown, BiSortUp } from 'react-icons/bi';
import { FaStar, FaHeart, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
    {
        id: 3,
        name: 'Samsung Galaxy Z Flip6 12GB 256GB',
        price: 21990000,
        originalPrice: 28470000,
        discount: 23,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/f/r/frame_166_3.png',
    },
    {
        id: 4,
        name: 'Samsung Galaxy S25 Ultra 12GB 256GB',
        price: 28490000,
        originalPrice: 33380000,
        discount: 15,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s25-ultra_3__3.png',
    },
    {
        id: 5,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-plus_1__1.png',
    },
];
const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + '₫';
};
const SearchResults = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    <span className="text-black font-medium">Kết quả tìm kiếm cho: ...</span>
                </div>
                <div className="mt-4 mb-10">
                    <p className='text-xl font-semibold'>Sắp xếp theo:</p>
                    <div className='flex space-x-4 text-sm mt-5'>
                        <button className="border border-red-500 text-red-500 rounded-lg px-2 py-1">Liên quan</button>
                        <button className="border border-red-500 rounded-lg px-2 py-1 flex items-center space-x-1"><BiSortUp /><p>Giá cao</p></button>
                        <button className="border border-red-500 rounded-lg px-2 py-1 flex items-center space-x-1"><BiSortDown /><p>Giá thấp</p></button>
                    </div>
                </div>
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

                            <div className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</div>
                            <div className="text-gray-400 text-sm line-through">{formatPrice(product.originalPrice)}</div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchResults