import React from 'react';

const CompareBar = ({ compareItems, onRemove, onClearAll, onCompare }) => {
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
                    <div key={i} className="w-40 h-[100px] flex-shrink-0 flex items-center justify-center border-dashed border-2 border-gray-300 rounded text-gray-500">
                        + Thêm sản phẩm
                    </div>
                ))}

                <div className="flex flex-col justify-between">
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
        </div>
    );
};

export default CompareBar;