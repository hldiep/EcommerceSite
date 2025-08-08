import React, { useState } from 'react';

const ProductCompare = () => {
    const products = [
        {
            id: 1,
            name: 'iPhone 15 Pro Max',
            imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/328449/oppo-a3x-red-thumb-600x600.jpg',
            brand: 'Apple',
            price: 33990000,
            specifications: {
                'Màn hình': '6.7 inch OLED',
                'Chip': 'Apple A17 Pro',
                'RAM': '8GB',
                'Dung lượng': '256GB',
                'Camera': '48MP + 12MP',
                'Pin': '4422mAh',
            },
        },
        {
            id: 2,
            name: 'Samsung Galaxy S24 Ultra',
            imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/328452/oppo-a3x-blue-thumb-600x600.jpg',
            brand: 'Samsung',
            price: 31990000,
            specifications: {
                'Màn hình': '6.8 inch AMOLED 2X',
                'Chip': 'Snapdragon 8 Gen 3',
                'RAM': '12GB',
                'Dung lượng': '256GB',
                'Camera': '200MP + 12MP + 10MP',
                'Pin': '5000mAh',
            },
        },
        {
            id: 3,
            name: 'Xiaomi 14 Ultra',
            imageUrl: 'https://cdn.tgdd.vn/Products/Images/42/327190/oppo-reno12-f-5g-cam-thumbai-600x600.jpg',
            brand: 'Xiaomi',
            price: 25990000,
            specifications: {
                'Màn hình': '6.73 inch AMOLED',
                'Chip': 'Snapdragon 8 Gen 3',
                'RAM': '16GB',
                'Dung lượng': '512GB',
                'Camera': '50MP + 50MP + 50MP',
                'Pin': '5300mAh',
            },
        },
    ];

    const [showDetails, setShowDetails] = useState(true);
    const toggleDetails = () => setShowDetails(!showDetails);

    const allKeys = Array.from(
        new Set(products.flatMap(product =>
            Object.keys(product.specifications || {})
        ))
    );

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-2">
            <div className='container mt-20 mb-10'>
                <div className="overflow-x-auto mt-6">
                    <table className="table-fixed w-full text-sm border-collapse">
                        <thead>
                            <tr className="border-t border-b bg-gray-50">
                                <th className="p-4 text-left align-top w-64">
                                    <h2 className="text-xl font-semibold mb-4">So sánh sản phẩm</h2>
                                    <div className="space-y-2 mb-4">
                                        {products.map((item, index) => (
                                            <div key={index} className="font-bold">
                                                {item.name}
                                                {index < products.length - 1 && <span className="text-gray-600"> &</span>}
                                            </div>
                                        ))}
                                    </div>
                                </th>
                                {products.map((product, index) => (
                                    <th key={index} className="p-4 text-center align-top border-l w-64">
                                        <img src={product.imageUrl} alt={product.name} className="h-32 object-contain mx-auto mb-2" />
                                        <h3 className="font-bold text-lg">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.brand}</p>
                                        <p className="text-blue-600 font-semibold mt-2">{product.price?.toLocaleString()}₫</p>
                                        <button className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Xem chi tiết</button>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    </table>
                </div>

                <div className="border rounded-md shadow-sm bg-white mt-10">
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-2 border-b cursor-pointer"
                        onClick={toggleDetails}
                    >
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <span className={`transition-transform duration-300 ${showDetails ? 'rotate-90' : ''}`}>▶</span>
                            <span>SO SÁNH NHANH</span>
                        </div>
                    </div>

                    {showDetails && (
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full text-sm border-collapse">
                                <thead>
                                    <tr className="border-t border-b bg-gray-100">
                                        <th className="p-3 text-left w-64">So sánh nhanh</th>
                                        {products.map((product, idx) => (
                                            <th key={idx} className="p-3 text-left border-l w-64">{product.name}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allKeys.map((key) => (
                                        <tr key={key} className="border-t">
                                            <td className="p-3 font-medium">{key}</td>
                                            {products.map((product, idx) => (
                                                <td key={idx} className="p-3 border-l">{product.specifications[key] || '-'}</td>
                                            ))}
                                        </tr>
                                    ))}
                                    <tr className="border-t">
                                        <td className="p-3 font-medium">Chi tiết</td>
                                        {products.map((_, idx) => (
                                            <td key={idx} className="p-3 border-l text-blue-600 cursor-pointer">Xem thêm ▼</td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCompare;
