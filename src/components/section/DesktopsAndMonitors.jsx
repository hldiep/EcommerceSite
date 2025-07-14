import React from 'react'
import { FaHeart, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
const featuredDesktopsAndMonitors = [
    {
        id: 1,
        name: 'PC CPS X ASUS Gaming Intel i3 Gen 12 Kèm màn hình',
        price: '11.990.000đ',
        originalPrice: '17.990.000đ',
        discount: 33,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_854.png',
    },
    {
        id: 2,
        name: 'PC CPS X MSI Gaming Intel i5 Gen 12 Kèm màn hình',
        price: '20.490.000đ',
        originalPrice: '25.890.000đ',
        discount: 21,
        rating: 4,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_784.png',
    },
    {
        id: 3,
        name: 'Màn hình thông minh LG MyView 25SR50F 25 inch',
        price: '2.890.000đ',
        originalPrice: '5.990.000đ',
        discount: 52,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_180_1_5.png',
    },
    {
        id: 4,
        name: 'Màn hình Gaming ASUS TUF VG249Q3A 24 inch',
        price: '2.990.000đ',
        originalPrice: '3.990.000đ',
        discount: 25,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/m/a/man-hinh-gaming-asus-tuf-vg249q3a-24-inch.png',
    },
    {
        id: 5,
        name: 'Màn hình Gaming LG Ultragear 24GS65F 24 inch',
        price: '3.190.000đ',
        originalPrice: '4.290.000đ',
        discount: 26,
        rating: 5,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/g/r/group_183_1_5.png',
    },
];
const DesktopsAndMonitors = () => {
    const navigate = useNavigate();
    return (
        <div className="px-4 mt-10">
            <button onClick={() => navigate('/mobile')}
                className="text-2xl font-bold mb-4">MÀN HÌNH, MÁY TÍNH ĐỂ BÀN</button>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {featuredDesktopsAndMonitors.map((product) => (
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

export default DesktopsAndMonitors