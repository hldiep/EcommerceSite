import React, { useState } from 'react'
import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const InfoPayment = () => {
    const navigate = useNavigate();
    const user = {
        name: "Hoàng Linh Điệp",
        gender: null, // hoặc 'Nam' / 'Nữ'
        phone: "0385457894",
        email: "hoanglinhdiep8@gmail.com"
    };

    const product = {
        name: "iPhone 16 Pro 128GB | Chính hãng VN/A - Titan Sa Mạc",
        price: 25090000,
        oldPrice: 28900000,
        quantity: 1,
        image: "https://cdn2.cellphones.com.vn/insecure/rs:fill:350:0/q:80/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-titan-sa-mac.png"
    };

    const formatCurrency = (num) =>
        num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        city: "",
        district: "",
        ward: "",
        address: "",
        note: "",
        method: "delivery", // or "pickup"
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        navigate('/payment-continue')
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center space-x-2 text-gray-700 mb-4">
                    <FaChevronLeft />
                    <h2 className="text-center text-2xl font-bold">Thông tin</h2>
                </div>
                <div className="p-4 rounded max-w-5xl mx-auto">
                    <div className="flex border-b border-gray-300 mb-4">
                        <div className="px-4 py-2 text-red-600 font-semibold border-b-2 border-red-600">1. THÔNG TIN</div>
                        <div className="px-4 py-2 text-gray-500">2. THANH TOÁN</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow mb-4 flex">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded" />
                        <div className="ml-4 flex-1">
                            <h2 className="font-semibold">{product.name}</h2>
                            <div className="flex items-center space-x-2 mt-1">
                                <p className="text-red-600 text-lg font-bold">{formatCurrency(product.price)}</p>
                                <del className="text-gray-400 text-sm">{formatCurrency(product.oldPrice)}</del>
                            </div>
                            <p className="mt-2 text-sm">Số lượng: <span className="font-semibold">{product.quantity}</span></p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow mb-4">
                        <h3 className="font-semibold mb-2 text-gray-700">THÔNG TIN KHÁCH HÀNG</h3>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="font-medium">{user.name}</span>
                                <span className="bg-pink-200 text-pink-600 text-xs px-2 py-1 rounded-full">
                                    {user.gender ? user.gender : 'S-NULL'}
                                </span>
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

                        <div className="flex space-x-4">

                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="method"
                                    value="delivery"
                                    checked={formData.method === "delivery"}
                                    onChange={handleChange}
                                />
                                <span>Giao hàng tận nơi</span>
                            </label>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label>Tên người nhận</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label>SĐT người nhận</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                />
                            </div>

                            <div>
                                <label>Tỉnh / Thành phố</label>
                                <select
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                >
                                    <option value="">Chọn tỉnh/thành</option>
                                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                    <option value="Hà Nội">Hà Nội</option>
                                </select>
                            </div>

                            <div>
                                <label>Quận / Huyện</label>
                                <select
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    <option value="Quận 1">Quận 1</option>
                                    <option value="Thủ Đức">Thủ Đức</option>
                                </select>
                            </div>

                            <div>
                                <label>Phường / Xã</label>
                                <select
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                >
                                    <option value="">Chọn phường/xã</option>
                                    <option value="Phường Linh Trung">Phường Linh Trung</option>
                                    <option value="Phường Linh Đông">Phường Linh Đông</option>
                                </select>
                            </div>

                            <div>
                                <label>Số nhà, tên đường</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="border w-full p-2 rounded"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label>Ghi chú khác (nếu có)</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                className="border w-full p-2 rounded"
                                rows="3"
                            />
                        </div>
                    </form>
                    <div className="bg-white rounded-lg shadow p-4 sticky bottom-0">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Tổng tiền tạm tính:</span>
                            <span className="text-red-600">{formatCurrency(product.price)}</span>
                        </div>
                        <button
                            className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
                            onClick={handleSubmit} // dùng hàm này để xử lý submit thủ công
                        >
                            Tiếp tục
                        </button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default InfoPayment