import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Categories from './Categories';

const HomeSection = () => {
    const promotions = [
        { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/dien-thoai-oppo-reno14-home.png" },
        { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/Home%20(2).jpg" },
        { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:690:300/q:90/plain/https://dashboard.cellphones.com.vn/storage/iphone-16-pro-max-home.png" },
    ];

    return (
        <div className="flex gap-4 mt-6 px-4">
            <Categories />

            <div className="flex-1 relative group rounded-xl overflow-hidden h-[420px]">
                <Swiper
                    spaceBetween={10}
                    slidesPerView={1}
                    navigation
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    modules={[Navigation, Autoplay]}
                    className="h-full rounded-xl"
                >
                    {promotions.map((promo) => (
                        <SwiperSlide key={promo.id} className="h-full">
                            <img
                                src={promo.image}
                                alt={`Promotion ${promo.id}`}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default HomeSection;
