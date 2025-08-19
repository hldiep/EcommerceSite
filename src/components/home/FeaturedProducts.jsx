import React, { useEffect, useState } from 'react';
import { FaStar, FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchBestSellingProducts } from '../../api/product';

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/category');
    };
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const data = await fetchBestSellingProducts(5);
                console.log('Dữ liệu', data);
                setProducts(data.data || []);
            } catch (err) {
                console.error("Lỗi tải sản phẩm bán chạy:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    if (loading) return <p>Đang tải...</p>;
    return (
        <div className="px-4 mt-10">
            <h2 className="text-2xl font-bold mb-4">
                SẢN PHẨM BÁN CHẠY
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {products.map((product) => (
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
};

export default FeaturedProducts;
