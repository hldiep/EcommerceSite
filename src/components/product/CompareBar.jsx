import React, { useState } from 'react';
import { fetchProductsPublicWithPaging } from '../../api/product';

const CompareBar = ({ compareItems, onRemove, onClearAll, onCompare, onAdd, onClose }) => {
    const [brandProducts, setBrandProducts] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const handleShowSuggestions = async () => {
        if (compareItems.length === 0) return;

        const brandId = compareItems[0]?.brand?.id;
        if (!brandId) return;

        try {
            const result = await fetchProductsPublicWithPaging({
                brandId,
                page: 0,
                size: 5,
            });

            setBrandProducts(Array.isArray(result.data) ? result.data : []);
            setShowSuggestions(true);
        } catch (err) {
            console.error("Lỗi fetch sản phẩm theo brand:", err);
            setBrandProducts([]);
        }
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t p-4 z-50">
            <div className="max-w-7xl mx-auto flex gap-4 justify-center items-center overflow-x-auto">
                {compareItems.map((item, index) => (
                    <div key={index} className="flex-shrink-0 w-40 text-center border rounded relative p-2">
                        <button
                            onClick={() => onRemove(item.id)}
                            className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                        >
                            ×
                        </button>
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mx-auto object-contain" />
                        <p className="text-sm mt-2">{item.name}</p>
                    </div>
                ))}

                {Array.from({ length: 4 - compareItems.length }).map((_, i) => (
                    <div
                        key={i}
                        onClick={handleShowSuggestions}
                        className="cursor-pointer w-40 h-[100px] flex-shrink-0 flex items-center justify-center border-dashed border-2 border-gray-300 rounded text-gray-500 hover:bg-gray-100"
                    >
                        + Thêm sản phẩm
                    </div>
                ))}

                <div className="flex flex-col justify-between">
                    <button
                        onClick={onClose}
                        className="absolute top-1 right-1 text-gray-400 hover:text-red-500 font-bold"
                    >
                        ×
                    </button>
                    <button
                        onClick={onCompare}
                        disabled={compareItems.length < 2}
                        className={`px-4 py-2 bg-gray-300 rounded text-white mb-2 ${compareItems.length >= 2 ? 'bg-blue-500 hover:bg-blue-600' : 'cursor-not-allowed'
                            }`}
                    >
                        So sánh ngay
                    </button>
                    <button onClick={onClearAll} className="text-blue-500 underline text-sm">
                        Xóa tất cả sản phẩm
                    </button>
                </div>
            </div>

            {showSuggestions && (
                <div className="absolute bottom-20 bg-white shadow-lg border rounded p-4 max-w-md w-full">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold">Sản phẩm cùng thương hiệu</h3>
                        <button
                            onClick={() => setShowSuggestions(false)}
                            className="text-gray-400 hover:text-red-500 font-bold"
                        >
                            ×
                        </button>
                    </div>
                    {brandProducts.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {brandProducts.map((p) => (
                                <div
                                    key={p.id}
                                    className="p-2 border rounded cursor-pointer hover:bg-gray-100"
                                    onClick={() => {
                                        if (!compareItems.find((ci) => ci.id === p.id)) {
                                            onAdd(p); // dùng callback thay vì push
                                        }
                                        setShowSuggestions(false);
                                    }}
                                >
                                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 mx-auto object-contain" />
                                    <p className="text-xs mt-1 text-center">{p.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">Không có sản phẩm nào</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CompareBar;
