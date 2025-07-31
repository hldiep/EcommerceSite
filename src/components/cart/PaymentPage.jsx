import React from 'react'
import { FaChevronLeft } from 'react-icons/fa'

const PaymentPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className="container mt-20 mb-10 px-4">
                {/* Back & Heading */}
                <div className="flex items-center space-x-2 text-gray-700 mb-4">
                    <FaChevronLeft />
                    <h2 className="text-xl font-bold">Thông tin</h2>
                </div>

                <div className="p-4 rounded max-w-5xl mx-auto">

                    <div className="flex border-b border-gray-300 mb-4">
                        <div className="px-4 py-2 text-gray-500">1. THÔNG TIN</div>
                        <div className="px-4 py-2 text-red-600 font-semibold border-b-2 border-red-600">
                            2. THANH TOÁN
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4 mb-6">
                        <div className="mb-4">
                            <label className="text-gray-600 text-sm block mb-1">
                                Nhập mã giảm giá (chỉ áp dụng 1 lần)
                            </label>
                            <div className="flex">
                                <input
                                    type="text"
                                    className="flex-1 border px-3 py-2 rounded-l-md outline-none"
                                    placeholder="Nhập mã..."
                                />
                                <button className="bg-gray-200 px-4 py-2 rounded-r-md text-sm">
                                    Áp dụng
                                </button>
                            </div>
                        </div>

                        <div className="text-sm text-gray-700 space-y-2">
                            <div className="flex justify-between">
                                <span>Số lượng sản phẩm</span>
                                <span>01</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng tiền hàng</span>
                                <span>28.990.000đ</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>Miễn phí</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Giảm giá trực tiếp</span>
                                <span>-3.900.000đ</span>
                            </div>
                        </div>

                        <div className="flex justify-between mt-4 font-semibold text-lg">
                            <span className="text-black">Tổng tiền</span>
                            <span className="text-black">25.090.000đ</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Đã gồm VAT và được làm tròn
                        </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border mb-4">
                        <div className="flex items-center mb-2">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/633/633611.png"
                                alt="payment"
                                className="w-6 h-6 mr-2"
                            />
                            <span className="text-red-600 font-medium">
                                Chọn phương thức thanh toán
                            </span>
                        </div>
                        <div className="mt-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="payment" defaultChecked />
                                <span>Thanh toán khi nhận hàng (COD)</span>
                            </label>
                            <label className="flex items-center space-x-2 mt-2">
                                <input type="radio" name="payment" />
                                <span>Chuyển khoản ngân hàng</span>
                            </label>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border mb-4">
                        <h3 className="text-gray-800 font-semibold text-lg mb-3 border-b pb-1">THÔNG TIN NHẬN HÀNG</h3>
                        <div className="text-sm text-gray-800 space-y-2">
                            <div className="flex">
                                <span className="w-40 text-gray-500">Khách hàng</span>
                                <span>
                                    Hoàng Linh Điệp
                                </span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Số điện thoại</span>
                                <span>0385457894</span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Email</span>
                                <span>hoanglinhdiep8@gmail.com</span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Nhận hàng tại</span>
                                <span>102, Thị trấn Cần Thạnh, Huyện Cần Giờ, Hồ Chí Minh</span>
                            </div>
                            <div className="flex">
                                <span className="w-40 text-gray-500">Người nhận</span>
                                <span>Hoàng Linh Điệp - 0385457894</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 mb-4">
                        <label className="inline-flex items-center text-sm text-gray-700">
                            <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-red-600"
                            />
                            <span className="ml-2">Bằng việc Đặt hàng, bạn đồng ý với Điều khoản sử dụng của chúng tôi.</span>
                        </label>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 sticky bottom-0">
                        <div className="flex justify-between font-semibold text-lg">
                            <span>Tổng tiền tạm tính:</span>
                            <span className="text-red-600">25.090.000đ</span>
                        </div>
                        <button className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-3 rounded text-base font-semibold">
                            Thanh toán
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentPage
