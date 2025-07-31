import React, { useEffect, useState } from 'react';
import { FaHeart, FaHome, FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import {
    MdSportsEsports, MdBatteryFull, MdNetworkCell,
    MdCameraAlt, MdPhoneAndroid, MdLocalOffer
} from 'react-icons/md';
import { BiSortUp, BiSortDown } from "react-icons/bi";
import { fetchProductsPublicWithPaging } from '../../api/product';
import { fetchBrandById } from '../../api/brand';

const Brand = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState("popular");
    const [brand, setBrand] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { brandId } = useParams();
    const options = [
        { key: "popular", label: "Phổ biến", icon: <FaStar className="text-blue-600" /> },
        { key: "promo", label: "Khuyến mãi HOT", icon: <MdLocalOffer className="text-black" /> },
        { key: "price-asc", label: "Giá Thấp - Cao", icon: <BiSortUp className="text-black" /> },
        { key: "price-desc", label: "Giá Cao - Thấp", icon: <BiSortDown className="text-black" /> },
    ];
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const brandData = await fetchBrandById(brandId);
                setBrand(brandData);

                const productData = await fetchProductsPublicWithPaging({
                    brandId,
                    page: 0,
                    size: 20,
                });
                console.log('Dữ liệu', productData);
                setProducts(productData.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (brandId) loadData();
    }, [brandId]);

    if (loading) return <p>Đang tải...</p>;
    if (!brand) return <p>Không tìm thấy thông tin thương hiệu.</p>;
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    {/* <button onClick={() => navigate('/mobile')}
                        className="text-gray-700">Điện thoại</button>
                    <span className="text-gray-700">/</span> */}
                    <span className="text-black font-medium">{brand.name}</span>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {products.map((product) => {
                        const variant = product.productVariants?.[0];
                        const price = variant?.priceSale || variant?.price;
                        const originalPrice = variant?.price;
                        const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                        const image = variant?.imageUrl || product.imageUrl;

                        return (
                            <div
                                key={product.id}
                                onClick={() => navigate(`/detail/${product.id}`)} // sửa nếu route bạn cần
                                className="bg-white rounded-xl shadow-lg transition p-3 relative group"
                            >
                                {discount > 0 && (
                                    <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-xl">
                                        Giảm {discount}%
                                    </div>
                                )}

                                <img
                                    src={image}
                                    alt={product.name}
                                    className="w-full h-[240px] object-contain mb-2 transition-transform duration-300 group-hover:scale-[1.015]"
                                />

                                <h3 className="text-sm font-medium mb-1 h-[40px] line-clamp-2">
                                    {product.name || "Không có tên"}
                                </h3>

                                <div className="text-red-600 font-bold text-lg">{price}</div>
                                {originalPrice && price !== originalPrice && (
                                    <div className="text-gray-400 text-sm line-through">
                                        {originalPrice}
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-sm mt-2">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <FaStar className="text-xs" /> {product.rating || '5.0'}
                                    </div>
                                    <div className="text-red-500 flex items-center gap-1">
                                        <FaHeart className="text-xs" /> Yêu thích
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    )
}

export default Brand