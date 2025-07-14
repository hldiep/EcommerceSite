import React, { useState } from 'react';
import { FaHeart, FaHome, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
    MdSportsEsports, MdBatteryFull, MdNetworkCell,
    MdCameraAlt, MdPhoneAndroid, MdLocalOffer
} from 'react-icons/md';
import { BiSortUp, BiSortDown } from "react-icons/bi";
const brands = [
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Xiaomi", logo: "https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg" },
    { name: "Oppo", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWByUMhh97KDZ74Jjtkc_mZ1S26joDpVSR3w&s" },
    { name: "Realme", logo: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Realme-realme-_logo_box-RGB-01.svg" },
    { name: "Vivo", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfMW4kaQoFEXOAJO4O8BfZTbhTB0PKNSL0tw&s" },
    { name: "Nokia", logo: "https://1000logos.net/wp-content/uploads/2017/03/Nokia-Logo.png" },
];

const types = [
    { name: "Chơi game", icon: <MdSportsEsports size={40} className="text-blue-600" /> },
    { name: "Pin trâu", icon: <MdBatteryFull size={40} className="text-green-600" /> },
    { name: "Điện thoại 5G", icon: <MdNetworkCell size={40} className="text-indigo-600" /> },
    { name: "Chụp ảnh đẹp", icon: <MdCameraAlt size={40} className="text-pink-500" /> },
    { name: "Điện thoại phổ thông", icon: <MdPhoneAndroid size={40} className="text-gray-600" /> },
];
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
    {
        id: 6,
        name: 'iPhone 16 Pro 128GB | Chính hãng VN/A',
        price: 25090000,
        originalPrice: 28999000,
        discount: 13,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro_1.png',
    },
    {
        id: 7,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-xiaomi-redmi-note-14_2__2.png',
    },
    {
        id: 8,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-s24-fe_3__4.png',
    },
    {
        id: 9,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        rating: 4.9,
        image: 'http://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-samsung-galaxy-a56.1_1.png',
    },
    {
        id: 10,
        name: 'iPhone 15 128GB | Chính hãng VN/A',
        price: 15590000,
        originalPrice: 19990000,
        discount: 22,
        rating: 4.9,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/d/i/dien-thoai-nubia-music_2_.png',
    },
];
const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + 'đ';
};
const Mobile = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("popular");

    const options = [
        { key: "popular", label: "Phổ biến", icon: <FaStar className="text-blue-600" /> },
        { key: "promo", label: "Khuyến mãi HOT", icon: <MdLocalOffer className="text-black" /> },
        { key: "price-asc", label: "Giá Thấp - Cao", icon: <BiSortUp className="text-black" /> },
        { key: "price-desc", label: "Giá Cao - Thấp", icon: <BiSortDown className="text-black" /> },
    ];
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    <span className="text-black font-medium">Điện thoại</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <img
                        src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/dienj-thoai-vivo-b2s.png"
                        alt="banner 1"
                        className="rounded-xl w-full h-auto object-cover"
                    />
                    <img
                        src="https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/nothing-phone-3a-cate-0625.png"
                        alt="banner 2"
                        className="rounded-xl w-full h-auto object-cover"
                    />
                </div>

                <h2 className="text-xl font-bold mb-3">Các hãng điện thoại</h2>
                <div className="flex flex-wrap gap-2 mb-6">
                    {brands.map((brand, index) => (
                        <button
                            onClick={() => navigate('/brand')}
                            key={index}
                            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow text-sm font-medium hover:shadow-md cursor-pointer transition"
                        >
                            <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                            {brand.name}
                        </button>
                    ))}
                </div>

                <h2 className="text-xl font-bold mb-3">Chọn theo nhu cầu</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    {types.map((type, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center bg-gray-100 p-4 rounded-xl"
                        >
                            <div className="mb-2">
                                {type.icon}
                            </div>
                            <span className="text-sm font-medium text-center">{type.name}</span>
                        </div>
                    ))}
                </div>
                <div className="mb-6 flex mt-6 justify-between">
                    <h2 className="text-base font-semibold mb-2 mt-2">Sắp xếp theo</h2>
                    <div className="flex flex-wrap gap-2">
                        {options.map((option) => (
                            <button
                                key={option.key}
                                onClick={() => setSelected(option.key)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition
              ${selected === option.key
                                        ? "border-blue-500 text-blue-600 bg-blue-50"
                                        : "border-gray-200 text-black bg-gray-100 hover:bg-gray-200"}
            `}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-5">
                    {featuredPhones.map((product) => (
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
        </div>
    );
};

export default Mobile;
