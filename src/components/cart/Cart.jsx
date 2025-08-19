import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Cart = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [cartItems, setCartItems] = useState(() => {
        const stored = localStorage.getItem('cart');
        return stored ? JSON.parse(stored) : [];
    });

    const [selectedIds, setSelectedIds] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    useEffect(() => {
        const storedUser = localStorage.getItem('CUSTOMER_user');
        const storedRole = 'CUSTOMER';
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        } else {
            setUser(null);
            setRole(null);
        }
    }, []);
    const handleSelect = (productId) => {
        setSelectedIds((prev) =>
            prev.includes(productId)
                ? prev.filter((itemId) => itemId !== productId)
                : [...prev, productId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === cartItems.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(cartItems.map(item => item.productId));
        }
    };

    const removeItem = (productId) => {
        setCartItems(prev => {
            const updated = prev.filter(item => item.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
        setSelectedIds(prev => prev.filter(id => id !== productId));
    };

    const confirmRemoveSelected = () => {
        setCartItems(prev => {
            const updated = prev.filter(item => !selectedIds.includes(item.productId));
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
        toast.success('Đã xoá sản phẩm đã chọn');
        setSelectedIds([]);
        setShowConfirm(false);
    };

    const updateQuantity = (productId, delta) => {
        setCartItems(prev => {
            const updated = prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            );
            localStorage.setItem('cart', JSON.stringify(updated));
            return updated;
        });
    };

    const total = cartItems
        .filter((item) => selectedIds.includes(item.productId))
        .reduce((sum, item) => sum + item.price * item.quantity, 0);
    const handleBuyNow = (item) => {
        navigate('/quick-order', {
            state: {
                product: {
                    productId: item.productId,
                    name: item.name,
                    imageUrl: item.imageUrl,
                    price: item.price,
                    oldPrice: item.oldPrice || null,
                    quantity: item.quantity,
                    totalPrice: item.price * item.quantity,
                    productVariantId: item.productVariantId,
                    variantName: item.variantName,
                    brand: item.brand,
                    brandId: item.brandId || null
                },
            },
        });
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-28 mb-10'>
                <h2 className="text-center text-2xl font-bold mb-4">Giỏ hàng của bạn</h2>

                <div className="bg-white p-4 rounded shadow-md max-w-5xl mx-auto">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-600">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
                                alt="Empty cart"
                                className="mx-auto w-32 h-32 mb-4"
                            />
                            <p>Chưa có sản phẩm nào trong giỏ hàng.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-4">
                                <button
                                    onClick={toggleSelectAll}
                                    className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm"
                                >
                                    {selectedIds.length === cartItems.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className={`px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white text-sm ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={selectedIds.length === 0}
                                >
                                    Xoá đã chọn
                                </button>
                            </div>

                            {cartItems.map((item) => (
                                <div key={item.productId} className="flex items-start border-b py-4 gap-4">
                                    <input
                                        type="checkbox"
                                        className="mt-2"
                                        checked={selectedIds.includes(item.productId)}
                                        onChange={() => handleSelect(item.productId)}
                                    />
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-contain" />
                                    <div onClick={() => navigate(`/detail/${item.productId}`)} className="flex-1">
                                        <h3 className="font-semibold text-base">{item.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-red-600 font-bold text-lg">
                                                {item.price?.toLocaleString('vi-VN')}đ
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-gray-400 line-through">
                                                    {item.originalPrice.toLocaleString('vi-VN')}đ
                                                </span>
                                            )}
                                        </div>

                                        {Array.isArray(item.promotions) && item.promotions.length > 0 && (
                                            <div className="bg-red-50 p-2 mt-2 rounded text-sm">
                                                <div className="font-semibold text-red-600 mb-1">🎁 Khuyến mãi hấp dẫn</div>
                                                <ul className="list-disc ml-5 space-y-1 text-gray-700">
                                                    {item.promotions.map((promo, idx) => (
                                                        <li key={idx}>{promo}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex items-center border rounded">
                                            <button
                                                className="px-2 text-xl"
                                                onClick={() => updateQuantity(item.productId, -1)}
                                            >-</button>
                                            <span className="px-4">{item.quantity}</span>
                                            <button
                                                className="px-2 text-xl"
                                                onClick={() => updateQuantity(item.productId, 1)}
                                            >+</button>
                                        </div>
                                        <button onClick={() => removeItem(item.productId)} className="text-gray-500 hover:text-red-600">
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-between items-center mt-6">
                                <div className="text-lg font-medium">
                                    Tạm tính:&nbsp;
                                    <span className="text-red-600 font-bold">
                                        {total.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                                <button
                                    onClick={() => {
                                        if (user && role === 'CUSTOMER') {
                                            const selectedItems = cartItems.filter(item => selectedIds.includes(item.productId));
                                            const cartProducts = selectedItems.map(item => ({
                                                productVariantId: item.productVariantId,
                                                imageUrl: item.imageUrl,
                                                name: item.name,
                                                variantName: item.variantName,
                                                price: item.price,
                                                oldPrice: item.oldPrice,
                                                quantity: item.quantity
                                            }));

                                            navigate("/payment-info", { state: { cartProducts } });
                                        } else {
                                            const selectedItem = cartItems.find(item => selectedIds.includes(item.productId));
                                            if (selectedItem) {
                                                handleBuyNow(selectedItem);
                                            } else {
                                                toast.warning("Vui lòng chọn sản phẩm trước khi mua ngay");
                                            }
                                        }
                                    }}
                                    disabled={selectedIds.length === 0}
                                    className={`px-6 py-2 rounded font-semibold text-white ${selectedIds.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {showConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
                            <h3 className="text-lg font-semibold mb-4">Xác nhận xoá</h3>
                            <p className="mb-6">Bạn có chắc chắn muốn xoá các sản phẩm đã chọn không?</p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={confirmRemoveSelected}
                                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                                >
                                    Xoá
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};

export default Cart;
