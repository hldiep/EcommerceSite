import React, { useState } from 'react'
import { FaClipboardList, FaGem, FaHistory, FaHome, FaLink, FaMapMarkerAlt, FaMedal, FaSearch, FaShoppingCart, FaSignOutAlt, FaTags, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const User = () => {
    const totalOrders = 0;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        toast.info('Bạn đã đăng xuất tài khoản');
        navigate('/login');
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex space-x-3  rounded-lg shadow-lg p-4 items-center bg-white">
                    <div className="flex space-x-4 border-r-2 border-red-600 pr-6 items-center">
                        <img
                            src="https://i.pinimg.com/564x/dd/2d/0a/dd2d0a59ad7e79453110b2968af72d89.jpg"
                            alt="avatar"
                            className="rounded-full w-24 h-24"
                        />
                        <div>
                            <p className="font-semibold text-lg">Hoàng Linh Điệp</p>
                            <p className="text-gray-600">0123456789</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3 px-6">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 text-red-500">
                            <FaShoppingCart className="text-xl" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-gray-700">{totalOrders}</p>
                            <p className="text-sm text-gray-500">Tổng số đơn hàng đã mua</p>
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex space-x-4 justify-center rounded-lg shadow-lg p-4 items-center bg-white text-sm text-gray-700">
                    <div className="flex flex-row space-x-2 items-center text-center justify-center hover:text-red-600 cursor-pointer">
                        <FaMedal className="text-xl" />
                        <span>Hạng thành viên</span>
                    </div>
                    <div className="flex flex-row space-x-2 items-center justify-center hover:text-red-600 cursor-pointer">
                        <FaTags className="text-xl" />
                        <span>Mã giảm giá</span>
                    </div>
                    <div className="flex flex-row space-x-2 items-center justify-center hover:text-red-600 cursor-pointer">
                        <FaHistory className="text-xl" />
                        <span>Lịch sử mua hàng</span>
                    </div>
                    <div className="flex flex-row space-x-2 items-center justify-center hover:text-red-600 cursor-pointer">
                        <FaMapMarkerAlt className="text-xl" />
                        <span>Địa chỉ</span>
                    </div>
                    <div className="flex flex-row space-x-2 items-center justify-center hover:text-red-600 cursor-pointer">
                        <FaLink className="text-xl" />
                        <span>Liên kết tài khoản</span>
                    </div>
                </div>
                <div className='mt-3 flex space-x-4 rounded-lg shadow-lg p-4 bg-white'>
                    <div className="w-full md:w-64 bg-white border-r min-h-screen">
                        <ul className="space-y-1 p-2 text-sm text-gray-700">
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaHome />
                                <span>Tổng quan</span>
                            </li>
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaHistory />
                                <span>Lịch sử mua hàng</span>
                            </li>
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaGem />
                                <span>Hạng thành viên và ưu đãi</span>
                            </li>
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaUserCircle />
                                <span>Thông tin tài khoản</span>
                            </li>
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaSearch />
                                <span>Tìm kiếm cửa hàng</span>
                            </li>
                            <li className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded">
                                <FaClipboardList />
                                <span>Chính sách bảo hành</span>
                            </li>
                            <li
                                onClick={handleLogout}
                                className="flex items-center space-x-2 py-2 hover:bg-gray-100 rounded cursor-pointer text-red-600 font-medium mt-4"
                            >
                                <FaSignOutAlt />
                                <span>Đăng xuất</span>
                            </li>
                        </ul>
                    </div>
                    <div className='w-2/3 border-r'>
                        <span className='font-semibold'>Đơn hàng gần đây</span>
                    </div>
                    <div className='w-1/3'>
                        <span className='font-semibold'>Ưu đãi của bạn</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default User