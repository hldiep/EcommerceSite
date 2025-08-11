import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const HCM_LOCATIONS = {
    "Quận 1": ["Phường Bến Nghé", "Phường Bến Thành", "Phường Nguyễn Thái Bình"],
    "Thủ Đức": ["Phường Linh Trung", "Phường Linh Đông", "Phường Hiệp Bình Chánh"],
    "Quận 3": ["Phường Võ Thị Sáu", "Phường 6", "Phường 7"]
};
const InfoPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const singleProduct = location.state?.product;
    const cartProducts = location.state?.cartProducts;
    const products = singleProduct ? [singleProduct] : cartProducts;
    const product = location.state?.product;

    useEffect(() => {
        if (!products || products.length === 0) {
            navigate('/');
        }
    }, [products, navigate]);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
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

    const formatCurrency = (num) =>
        num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const [formData, setFormData] = useState({
        recipientName: "",
        recipientPhone: "",
        city: "Hồ Chí Minh",
        district: "",
        ward: "",
        address: "",
        deliveryAddress: "",
        note: "",
    });
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                recipientName: user.fullName || user.name || '',
                recipientPhone: user.phone || ''
            }));
        }
    }, [user]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    useEffect(() => {
        if (formData.city === "Hồ Chí Minh") {
            setDistrictOptions(Object.keys(HCM_LOCATIONS));
        } else {
            setDistrictOptions([]);
        }
        setFormData((prev) => ({
            ...prev, district: "", ward: ""
        }));
        setWardOptions([]);
    }, [formData.city]);
    useEffect(() => {
        if (formData.district && HCM_LOCATIONS[formData.district]) {
            setWardOptions(HCM_LOCATIONS[formData.district]);
        } else {
            setWardOptions([]);
        }
        setFormData((prev) => ({ ...prev, ward: "" }));
    }, [formData.district]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (
            !formData.recipientName.trim() ||
            !formData.recipientPhone.trim() ||
            !formData.city.trim() ||
            !formData.district.trim() ||
            !formData.ward.trim() ||
            !formData.address.trim()
        ) {
            toast.error("Vui lòng nhập đầy đủ thông tin nhận hàng!");
            return;
        }
        const items = products.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            discountCode: ""
        }));
        const deliveryAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`;
        const orderData = {
            items,
            discountCode: "",
            orderTime: new Date().toISOString(),
            note: formData.note || "",
            deliveryAddress,
            recipientName: formData.recipientName,
            recipientPhone: formData.recipientPhone,
        };

        navigate('/payment-continue', {
            state: {
                orderData,
                products,
                user,
            },
        });
    };

    if (!products || !user) return null;
    const totalPrice = products.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-28 mb-10">
                <div className="flex items-center space-x-2 text-gray-700 mb-4">
                    <button onClick={() => navigate(-1)} className="hover:text-red-600 transition">
                        <FaChevronLeft />
                    </button>
                    <h2 className="text-xl font-bold">Thông tin</h2>
                </div>
                <div className="p-4 rounded max-w-5xl mx-auto">
                    <div className="flex border-b border-gray-300 mb-4">
                        <div className="px-4 py-2 text-red-600 font-semibold border-b-2 border-red-600">1. THÔNG TIN</div>
                        <div className="px-4 py-2 text-gray-500">2. THANH TOÁN</div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    {products.map((product, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow mb-4 flex">
                            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded" />
                            <div className="ml-4 flex-1">
                                <h2 className="font-semibold">{product.name} - {product.variantName}</h2>
                                <div className="flex items-center space-x-2 mt-1">
                                    <p className="text-red-600 text-lg font-bold">{formatCurrency(product.price)}</p>
                                    {product.oldPrice && <del className="text-gray-400 text-sm">{formatCurrency(product.oldPrice)}</del>}
                                </div>
                                <p className="mt-2 text-sm">Số lượng: <span className="font-semibold">{product.quantity}</span></p>
                            </div>
                        </div>
                    ))}

                    <div className="bg-white rounded-lg p-4 shadow mb-4">
                        <h3 className="font-semibold mb-2 text-gray-700">THÔNG TIN KHÁCH HÀNG</h3>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{user.fullName}</span>
                            </div>
                            <p className="text-sm text-gray-500">EMAIL</p>
                            <p>{user.email}</p>
                            <p className="text-sm text-gray-500 mt-2">SỐ ĐIỆN THOẠI</p>
                            <p>{user.phone}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">(*) Hóa đơn VAT sẽ được gửi qua email này</p>
                    </div>

                    <form onSubmit={handleSubmit} className="mb-4 bg-white p-4 rounded shadow space-y-4">
                        <h2 className="text-xl font-bold">THÔNG TIN NHẬN HÀNG</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label>Tên người nhận</label>
                                <input
                                    type="text"
                                    name="recipientName"
                                    value={formData.recipientName}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded outline-none mt-2"
                                    required
                                />
                            </div>
                            <div>
                                <label>SĐT người nhận</label>
                                <input
                                    type="text"
                                    name="recipientPhone"
                                    value={formData.recipientPhone}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded outline-none mt-2"
                                    required
                                />
                            </div>
                            <div>
                                <label>Tỉnh / Thành phố</label>
                                <select name="city" value={formData.city} onChange={handleChange} className="border w-full p-2 rounded outline-none mt-2" required>
                                    <option value="">Chọn tỉnh/thành</option>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                </select>
                            </div>
                            <div>
                                <label>Quận / Huyện</label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded outline-none mt-2"
                                    required
                                    disabled={districtOptions.length === 0}
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districtOptions.map((district) => (
                                        <option key={district} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Phường / Xã</label>
                                <select
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded outline-none mt-2"
                                    required
                                    disabled={wardOptions.length === 0}
                                >
                                    <option value="">Chọn phường/xã</option>
                                    {wardOptions.map((ward) => (
                                        <option key={ward} value={ward}>{ward}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label>Số nhà, tên đường</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded outline-none mt-2"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label>Ghi chú khác (nếu có)</label>
                            <textarea name="note" value={formData.note} onChange={handleChange} className="border w-full p-2 rounded outline-none mt-2" rows="3" />
                        </div>
                    </form>

                    <div className="bg-white rounded-lg shadow p-4 sticky bottom-0">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Tổng tiền tạm tính:</span>
                            <span className="text-red-600">{formatCurrency(totalPrice)}</span>
                        </div>
                        <button
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                            onClick={handleSubmit}
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfoPayment;
