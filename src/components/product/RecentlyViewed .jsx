import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const RecentlyViewed  = () => {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        setItems(JSON.parse(localStorage.getItem("recentViewed")) || []);
    }, []);

    if (!items.length) return null;
    return (
        <div className='mt-10'>
            <h2 className='text-xl font-semibold mb-3'>Sản phẩm đã xem</h2>

            <div className='grid grid-cols-1 gap-4'>
                {items.map(item => (
                    <div 
                        onClick={() => navigate(`/detail/${item.id}`)}
                        key={item.id}
                        className='flex items-start gap-3 p-2 border rounded-xl bg-white shadow-sm hover:shadow-md transition cursor-pointer'
                    >
                        <img 
                            src={item.imageUrl}
                            className='w-14 h-14 object-contain rounded-md border'
                        />

                        <div className='flex flex-col'>
                            <p className='font-medium text-sm line-clamp-2 leading-tight'>
                                {item.name}
                            </p>

                            <p className='text-red-600 font-semibold mt-1 text-sm'>
                                {item.price?.toLocaleString()}₫
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

    )
}

export default RecentlyViewed 
