import React, { useState, useEffect } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';
const InfoPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const singleProduct = location.state?.product;
    const cartProducts = location.state?.cartProducts;
    const products = singleProduct ? [singleProduct] : cartProducts;

    useEffect(() => {
        if (!products || products.length === 0) {
            navigate('/');
        }
    }, [products, navigate]);

    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    const [addressOption, setAddressOption] = useState("new");
    const [provinceOptions, setProvinceOptions] = useState([]);
    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);
    const formatCurrency = (num) =>
        num.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    useEffect(() => {
        const storedUser = localStorage.getItem('CUSTOMER_user');
        const storedRole = 'CUSTOMER';
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setRole(storedRole);

            // Nếu user có địa chỉ, mặc định chọn "saved"
            if (parsedUser.address) {
                setAddressOption("saved");
            }
        } else {
            setUser(null);
            setRole(null);
            setAddressOption("new");
        }
    }, []);

    const [formData, setFormData] = useState({
        recipientName: "",
        recipientPhone: "",
        city: "",
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


    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then(res => res.json())
            .then(data => {
                setProvinceOptions(data);
            })
            .catch(err => console.error("Lỗi tải tỉnh/thành:", err));
    }, []);
    useEffect(() => {
        if (formData.city) {
            fetch(`https://provinces.open-api.vn/api/p/${formData.city}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setDistrictOptions(data.districts || []);
                    setWardOptions([]);
                    setFormData(prev => ({ ...prev, district: "", ward: "" }));
                })
                .catch(err => console.error("Lỗi tải quận/huyện:", err));
        }
    }, [formData.city]);
    useEffect(() => {
        if (formData.district) {
            fetch(`https://provinces.open-api.vn/api/d/${formData.district}?depth=2`)
                .then(res => res.json())
                .then(data => {
                    setWardOptions(data.wards || []);
                    setFormData(prev => ({ ...prev, ward: "" }));
                })
                .catch(err => console.error("Lỗi tải phường/xã:", err));
        }
    }, [formData.district]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let deliveryAddress = "";
        let recipientName = "";
        let recipientPhone = "";

        if (addressOption === "saved") {
            if (!user?.address || !user?.fullName || !user?.phone) {
                toast.error("Địa chỉ lưu không hợp lệ, vui lòng nhập địa chỉ mới.");
                setAddressOption("new");
                return;
            }
            deliveryAddress = user.address;
            recipientName = user.fullName;
            recipientPhone = user.phone;
        } else {
            if (
                !formData.recipientName.trim() ||
                !formData.recipientPhone.trim() ||
                !formData.city ||
                !formData.district ||
                !formData.ward ||
                !formData.address.trim()
            ) {
                toast.error("Vui lòng nhập đầy đủ thông tin nhận hàng!");
                return;
            }

            const cityName = provinceOptions.find(p => p.code === Number(formData.city))?.name || "";
            const districtName = districtOptions.find(d => d.code === Number(formData.district))?.name || "";
            const wardName = wardOptions.find(w => w.code === Number(formData.ward))?.name || "";

            deliveryAddress = [formData.address, wardName, districtName, cityName]
                .filter(Boolean)
                .join(", ");
            recipientName = formData.recipientName;
            recipientPhone = formData.recipientPhone;
        }

        const items = products.map((item) => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            discountCode: ""
        }));

        const orderData = {
            items,
            discountCode: "",
            orderTime: new Date().toISOString(),
            note: formData.note || "",
            deliveryAddress,
            recipientName,
            recipientPhone,
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

                    {/* Chọn địa chỉ nhận hàng */}
                    <div className="bg-white p-4 rounded shadow space-y-4 mb-5">
                        <h2 className="text-xl font-bold">THÔNG TIN NHẬN HÀNG</h2>

                        {user?.address && (
                            <label className="flex items-start space-x-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="addressOption"
                                    value="saved"
                                    checked={addressOption === "saved"}
                                    onChange={() => setAddressOption("saved")}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="font-medium">{user.fullName} - {user.phone}</p>
                                    <p className="text-sm text-gray-600">{user.address}</p>
                                </div>
                            </label>
                        )}

                        <label className="flex items-start space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name="addressOption"
                                value="new"
                                checked={addressOption === "new"}
                                onChange={() => setAddressOption("new")}
                                className="mt-1"
                            />
                            <span className="font-medium">Nhập địa chỉ mới</span>
                        </label>

                        {addressOption === "new" && (
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label>Tên người nhận</label>
                                        <input
                                            type="text"
                                            name="recipientName"
                                            value={formData.recipientName}
                                            onChange={handleChange}
                                            className="border w-full p-2 rounded outline-none mt-2"
                                            required={addressOption === "new"}
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
                                            required={addressOption === "new"}
                                        />
                                    </div>
                                    <div>
                                        <label>Tỉnh / Thành phố</label>
                                        <Select
                                            options={provinceOptions.map(p => ({
                                                value: p.code, // lưu ID
                                                label: p.name  // hiển thị tên
                                            }))}
                                            value={provinceOptions
                                                .map(p => ({ value: p.code, label: p.name }))
                                                .find(opt => opt.value === Number(formData.city)) || null
                                            }
                                            className='mt-2'
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({ ...prev, city: selectedOption.value }))
                                            }
                                            placeholder="Chọn tỉnh/thành"
                                        />
                                    </div>
                                    <div>
                                        <label>Quận / Huyện</label>
                                        <Select
                                            options={districtOptions.map(d => ({
                                                value: d.code,
                                                label: d.name
                                            }))}
                                            value={districtOptions
                                                .map(d => ({ value: d.code, label: d.name }))
                                                .find(opt => opt.value === Number(formData.district)) || null
                                            }
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({ ...prev, district: selectedOption.value }))
                                            }
                                            className='mt-2'
                                            placeholder="Chọn quận/huyện"
                                        />
                                    </div>
                                    <div>
                                        <label>Phường / Xã</label>
                                        <Select
                                            options={wardOptions.map(w => ({
                                                value: w.code,
                                                label: w.name
                                            }))}
                                            value={wardOptions
                                                .map(w => ({ value: w.code, label: w.name }))
                                                .find(opt => opt.value === Number(formData.ward)) || null
                                            }
                                            onChange={(selectedOption) =>
                                                setFormData(prev => ({ ...prev, ward: selectedOption.value }))
                                            }
                                            className='mt-2'
                                            placeholder="Chọn phường/xã"
                                        />
                                    </div>
                                    <div>
                                        <label>Số nhà, tên đường</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="border w-full p-2 rounded outline-none mt-2" required />
                                    </div>
                                </div>
                                <div>
                                    <label>Ghi chú khác (nếu có)</label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={handleChange}
                                        className="border w-full p-2 rounded outline-none mt-2"
                                        rows="3"
                                    />
                                </div>
                            </form>
                        )}
                    </div>

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
