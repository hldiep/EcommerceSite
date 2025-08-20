import React, { useEffect, useState } from 'react';
import { FaHeart, FaHome, FaStar } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { MdLocalOffer } from 'react-icons/md';
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
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const options = [
        { key: "relevant", label: "Liên quan", icon: <FaStar className="text-blue-600" /> },
        { key: "price-asc", label: "Giá Thấp - Cao", icon: <BiSortUp className="text-black" /> },
        { key: "price-desc", label: "Giá Cao - Thấp", icon: <BiSortDown className="text-black" /> },
    ];
    const loadData = async (currentPage = 0, append = false) => {
        if (append) setLoadingMore(true);
        else setLoading(true);

        try {
            if (!append) {
                const brandData = await fetchBrandById(brandId);
                setBrand(brandData);
            }

            const productData = await fetchProductsPublicWithPaging({
                brandId,
                page: currentPage,
                size: 20,
            });

            const newProducts = productData?.data || [];

            if (append) {
                setProducts((prev) => [...prev, ...newProducts]);
            } else {
                setProducts(newProducts);
            }

            if (newProducts.length < 20) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setPage(currentPage);
        } catch (err) {
            console.error(err);
        } finally {
            if (append) setLoadingMore(false);
            else setLoading(false);
        }
    };
    useEffect(() => {
        if (brandId) {
            setPage(0);
            setHasMore(true);
            loadData(0, false);
        }
    }, [brandId]);
    const handleSort = (sortKey) => {
        setSelected(sortKey);

        if (sortKey === "price-asc") {
            const sorted = [...products].sort((a, b) => {
                const priceA = a.productVariants?.[0]?.priceSale || a.productVariants?.[0]?.price || 0;
                const priceB = b.productVariants?.[0]?.priceSale || b.productVariants?.[0]?.price || 0;
                return priceA - priceB;
            });
            setProducts(sorted);
        } else if (sortKey === "price-desc") {
            const sorted = [...products].sort((a, b) => {
                const priceA = a.productVariants?.[0]?.priceSale || a.productVariants?.[0]?.price || 0;
                const priceB = b.productVariants?.[0]?.priceSale || b.productVariants?.[0]?.price || 0;
                return priceB - priceA;
            });
            setProducts(sorted);
        } else if (sortKey === "relevant") {
            setPage(0);
            setHasMore(true);
            loadData(0, false);
        }
    };
    if (!brand) return <p>Không tìm thấy thông tin thương hiệu.</p>;
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-28 mb-10'>
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
                                onClick={() => handleSort(option.key)}
                                className={`flex items-center gap-1 px-4 py-2 rounded-full border text-sm font-medium transition
          ${selected === option.key
                                        ? "border-blue-500 text-blue-600 bg-blue-50"
                                        : "border-gray-200 text-black bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {option.icon}
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center w-full py-10 text-gray-600">
                        <p className="text-lg font-semibold">Không có sản phẩm nào từ thương hiệu này.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                        {products.map((product) => {
                            const variant = product.productVariants?.[0];
                            const price = variant?.priceSale || variant?.price;
                            const originalPrice = variant?.price;
                            const discount = originalPrice && price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
                            const image = variant?.imageUrl || product.imageUrl;

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => navigate(`/detail/${product.id}`)}
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
                )}
                {hasMore && !loading && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => loadData(page + 1, true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            disabled={loadingMore}
                        >
                            {loadingMore ? "Đang tải..." : "Xem thêm"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Brand