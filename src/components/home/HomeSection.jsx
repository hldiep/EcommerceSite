import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

const categories = [
    { id: 1, name: "Điện thoại, Tablet", icon: "📱" },
    { id: 2, name: "Laptop", icon: "💻" },
    { id: 3, name: "Âm thanh, Mic thu âm", icon: "🎧" },
    { id: 4, name: "Đồng hồ, Camera", icon: "📷" },
    { id: 5, name: "Đồ gia dụng", icon: "🏠" },
    { id: 6, name: "Phụ kiện", icon: "🔌" },
    { id: 7, name: "PC, Màn hình, Máy in", icon: "🖥️" },
    { id: 8, name: "Tivi", icon: "📺" },
    { id: 9, name: "Khuyến mãi", icon: "🎁" },
    { id: 10, name: "Tin công nghệ", icon: "📰" },
];

const HomeSection = () => {
    const promotions = [
        { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/dien-thoai-oppo-reno14-home.png" },
        { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/Home%20(2).jpg" },
        { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-home.png" },
    ];

    return (
        <div className="flex gap-4 mt-6 px-4">
            <div className="w-[200px] bg-white rounded-xl shadow p-2 flex flex-col justify-between max-h-[350px]">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="flex items-center gap-2 py-1 px-2 hover:bg-gray-100 rounded cursor-pointer transition"
                    >
                        <span className="text-base">{cat.icon}</span>
                        <span className="text-xs font-medium leading-tight">{cat.name}</span>
                    </div>
                ))}
            </div>

            <div className="flex-1 relative group rounded-xl overflow-hidden max-h-[350px]">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Navigation, Autoplay]}
                    className="rounded-xl"
                >
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo.id}>
                            <img
                                src={promo.image}
                                alt={`Promotion ${promo.id}`}
                                className="w-full h-[220px] md:h-[280px] lg:h-[350px] object-cover rounded-xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default HomeSection;
