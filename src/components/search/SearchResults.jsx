import React, { useEffect, useState } from 'react'
import { BiSortDown, BiSortUp } from 'react-icons/bi';
import { FaStar, FaHeart, FaHome } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchProductsPublicWithPaging } from '../../api/product';

const SearchResults = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selected, setSelected] = useState("popular");
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('keyword');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const options=[
        { key: "relevant", label: "Liên quan", icon: <FaStar className="text-blue-600" /> },
        { key: "price-asc", label: "Giá Thấp - Cao", icon: <BiSortUp className="text-black" /> },
        { key: "price-desc", label: "Giá Cao - Thấp", icon: <BiSortDown className="text-black" /> },
    ]
    const fetchData = async (currentPage = 0, append = false) => {
        try {
            const data = await fetchProductsPublicWithPaging({ keyword, page: currentPage });
            const newResults = data?.data || [];

            if (append) {
                setResults(prev => [...prev, ...newResults]);
            } else {
                setResults(newResults);
            }

            setHasMore(newResults.length > 0);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true);
        setPage(0);
        setHasMore(true);
        if (keyword) {
            fetchData(0);
        }
    }, [keyword]);
    const handleLoadMore = async () => {
        const nextPage = page + 1;
        setLoadingMore(true);
        setPage(nextPage);
        await fetchData(nextPage, true);
        setLoadingMore(false);
    };
    const handleSort = (sortKey) => {
        setSelected(sortKey);

        if (sortKey === "price-asc") {
            const sorted = [...results].sort((a, b) => {
                const priceA = a.productVariants?.[0]?.priceSale || a.productVariants?.[0]?.price || 0;
                const priceB = b.productVariants?.[0]?.priceSale || b.productVariants?.[0]?.price || 0;
                return priceA - priceB;
            });
            setResults(sorted);

        } else if (sortKey === "price-desc") {
            const sorted = [...results].sort((a, b) => {
                const priceA = a.productVariants?.[0]?.priceSale || a.productVariants?.[0]?.price || 0;
                const priceB = b.productVariants?.[0]?.priceSale || b.productVariants?.[0]?.price || 0;
                return priceB - priceA;
            });
            setResults(sorted);

        } else if (sortKey === "relevant") {
            setPage(0);
            setHasMore(true);
            fetchData(0, false);   
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-28 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    <span className="text-black font-medium">Kết quả tìm kiếm cho: <strong>{keyword}</strong></span>
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
                ) : (
                    <>
                        {results.length === 0 ? (
                            <div className="text-center w-full py-10 text-gray-600">
                                <img
                                    src="https://static.vecteezy.com/system/resources/previews/006/208/684/non_2x/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                                    alt="Không tìm thấy"
                                    className="w-40 h-40 mx-auto mb-4 opacity-70"
                                />
                                <p className="text-lg font-semibold">Không tìm thấy sản phẩm phù hợp với từ khóa "<strong>{keyword}</strong>"</p>
                                <p className="text-sm mt-2 text-gray-500">Hãy thử lại với từ khóa khác nhé!</p>
                            </div>
                        ) : (
                            <>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {results.map((product) => {
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
                            </>
                        )}
                    </>
                )}
                {hasMore && results.length > 0 && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={handleLoadMore}
                            disabled={loadingMore}
                            className={`px-6 py-2 rounded transition ${loadingMore ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                } text-white`}
                        >
                            {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchResults