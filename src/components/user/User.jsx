import React, { useEffect, useState } from 'react'
import { FaHistory, FaHome, FaShoppingCart, FaSignOutAlt, FaTags, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getHistory } from '../../api/order';

const User = () => {
    const totalOrders = 0;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [orderHistory, setOrderHistory] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const handleLogout = () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmed) {
            localStorage.removeItem('CUSTOMER_user');
            localStorage.removeItem('CUSTOMER_token');
            setUser(null);
            toast.info('Bạn đã đăng xuất tài khoản');
            navigate('/');
        }
    };
    useEffect(() => {
        loadHistory();
    }, [page]);
    const loadHistory = async () => {
        try {
            const data = await getHistory({
                page,
            });
            setOrderHistory(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi tải lịch sử mua hàng:', error);
        }
    }
    useEffect(() => {
        const storedUser = localStorage.getItem('CUSTOMER_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

    }, []);
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
                            <p className="font-semibold text-lg">{user?.fullName}</p>
                            <p className="text-gray-600">{user?.phone}</p>
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

                <div className='mt-3 flex space-x-4 rounded-lg shadow-lg p-4 bg-white'>
                    <div className="w-full md:w-64 bg-white border-r min-h-screen">
                        <ul className="space-y-1 p-2 text-sm text-gray-700">
                            <li
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center space-x-2 py-2 px-2 rounded cursor-pointer ${activeTab === 'overview' ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <FaHome />
                                <span>Tổng quan</span>
                            </li>
                            <li
                                onClick={() => setActiveTab('history')}
                                className={`flex items-center space-x-2 py-2 px-2 rounded cursor-pointer ${activeTab === 'history' ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <FaHistory />
                                <span>Lịch sử mua hàng</span>
                            </li>

                            <li
                                onClick={() => setActiveTab('account')}
                                className={`flex items-center space-x-2 py-2 px-2 rounded cursor-pointer ${activeTab === 'account' ? 'bg-red-100 text-red-600 font-semibold' : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <FaUserCircle />
                                <span>Thông tin tài khoản</span>
                            </li>

                            <li
                                onClick={handleLogout}
                                className="flex items-center space-x-2 py-2 px-2 hover:bg-gray-100 rounded cursor-pointer text-red-600 font-medium mt-4"
                            >
                                <FaSignOutAlt />
                                <span>Đăng xuất</span>
                            </li>
                        </ul>
                    </div>
                    <div className='w-2/3'>
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="font-semibold text-lg mb-3">Tổng quan tài khoản</h2>

                                <div className="mb-5">
                                    <p className="text-gray-700 text-sm">Xin chào, <span className="font-medium">{user?.fullName}</span>!</p>
                                </div>

                                {orderHistory.length === 0 ? (
                                    <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 border">Mã đơn</th>
                                                    <th className="px-4 py-2 border">Ngày đặt</th>
                                                    <th className="px-4 py-2 border">Tổng tiền</th>
                                                    <th className="px-4 py-2 border">Trạng thái</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderHistory.map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border">{order.id}</td>
                                                        <td className="px-4 py-2 border">{order.date}</td>
                                                        <td className="px-4 py-2 border">{order.total.toLocaleString()} ₫</td>
                                                        <td className="px-4 py-2 border">{order.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <button
                                            onClick={() => setActiveTab('history')}
                                            className="mt-3 text-sm text-blue-500 hover:underline"
                                        >
                                            Xem tất cả đơn hàng
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'history' && (
                            <div>
                                <h2 className="font-semibold text-lg mb-3">Lịch sử mua hàng</h2>

                                {orderHistory.length === 0 ? (
                                    <p className='text-sm text-gray-500'>Bạn chưa có đơn hàng nào.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border text-sm text-left">
                                            <thead className="bg-gray-100 text-gray-700">
                                                <tr>
                                                    <th className="px-4 py-2 border">Mã đơn</th>
                                                    <th className="px-4 py-2 border">Ngày đặt</th>
                                                    <th className="px-4 py-2 border">Tổng tiền</th>
                                                    <th className="px-4 py-2 border">Trạng thái</th>
                                                    <th className="px-4 py-2 border">Chi tiết</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {orderHistory.map(order => (
                                                    <tr key={order.id} className="hover:bg-gray-50">
                                                        <td className="px-4 py-2 border">{order.id}</td>
                                                        <td className="px-4 py-2 border">{order.date}</td>
                                                        <td className="px-4 py-2 border">{order.total.toLocaleString()} ₫</td>
                                                        <td className="px-4 py-2 border">{order.status}</td>
                                                        <td className="px-4 py-2 border text-blue-500 cursor-pointer hover:underline">
                                                            Xem
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'account' && user && (
                            <div>
                                <h2 className="font-semibold text-lg mb-3">Thông tin tài khoản</h2>
                                <div className='space-y-2'>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><span className="font-medium">Họ tên:</span> {user.fullName}</div>
                                        <div><span className="font-medium">Số điện thoại:</span> {user.phone}</div>
                                        <div><span className="font-medium">Email:</span> {user.email}</div>
                                        <div><span className="font-medium">Giới tính:</span> {user.gender}</div>
                                        <div><span className="font-medium">Ngày sinh:</span> {user.birthday}</div>
                                        <div><span className="font-medium">Địa chỉ:</span> {user.address}</div>
                                        <div><span className="font-medium">Vai trò:</span> {user.role}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}

export default User