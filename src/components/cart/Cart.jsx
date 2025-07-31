import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const initialCart = [
    {
        id: 1,
        name: 'iPhone 16 Pro 128GB | Chính hãng VN/A - Titan Sa Mạc',
        price: 25190000,
        originalPrice: 28990000,
        quantity: 1,
        image: 'https://cdn2.cellphones.com.vn/insecure/rs:fill:350:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac.png',
        promotions: [
            'Đặc quyền trợ giá lên đến 3 triệu khi thu cũ lên đời iPhone',
            'Tặng combo 3 voucher tổng trị giá đến 2 triệu mua các sản phẩm tivi, gia dụng, đồng hồ trẻ em',
            'Trả góp 0% lãi suất, tối đa 12 tháng, trả trước từ 10% qua CTTC hoặc 0đ qua thẻ tín dụng'
        ]
    }
];

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState(initialCart);

    const updateQuantity = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <h2 className="text-center text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>

                <div className="bg-white p-4 rounded shadow-md max-w-5xl mx-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-600">Chưa có sản phẩm nào trong giỏ hàng.</p>
                    ) : (
                        <>
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-start border-b py-4 gap-4">
                                    <input type="checkbox" className="mt-2" />
                                    <img src={item.image} alt={item.name} className="w-24 h-24 object-contain" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base">{item.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-red-600 font-bold text-lg">
                                                {item.price.toLocaleString('vi-VN')}đ
                                            </span>
                                            <span className="text-gray-400 line-through">
                                                {item.originalPrice.toLocaleString('vi-VN')}đ
                                            </span>
                                        </div>
                                        <div className="bg-red-50 p-2 mt-2 rounded text-sm">
                                            <div className="font-semibold text-red-600 mb-1">🎁 Khuyến mãi hấp dẫn</div>
                                            <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                                {item.promotions.map((promo, index) => (
                                                    <li key={index}>{promo}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center border rounded">
                                            <button
                                                className="px-2 text-xl"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >-</button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                className="px-2 text-xl"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >+</button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-gray-500 hover:text-red-600">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center mt-6">
                                <div className="text-lg font-medium">
                                    Tạm tính: <span className="text-red-600 font-bold">{total.toLocaleString('vi-VN')}đ</span>
                                </div>
                                <button
                                    onClick={() => navigate('/payment')}
                                    disabled={cartItems.length === 0}
                                    className={`px-6 py-2 rounded font-semibold text-white ${cartItems.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
