import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import Categories from './Categories';

const HomeSection = () => {
    const promotions = [
        { id: 1, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/Z7-Sliding-1025.png" },
        { id: 2, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/690x300_iPhone_17_Pro_Opensale_v3.png" },
        { id: 3, image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:1036:450/q:90/plain/https://dashboard.cellphones.com.vn/storage/ideapad_slim_sliding.png" },
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
