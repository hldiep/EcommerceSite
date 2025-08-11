import React, { useEffect, useState } from 'react'
import ClippedDrawer from '../dashboard/DashboardLayoutBasic'
import { useNavigate } from 'react-router-dom'
import { getOrder } from '../../api/order-manager';

const OrderManager = () => {
    const navigate = useNavigate();
    const [listOrder, setListOrder] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');
    const loadOrder = async () => {
        try {
            const data = await getOrder({
                page,
                size: 10,
                sortBy,
                direction,
            });
            setListOrder(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadOrder();
    }, [page, sortBy, direction]);
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setPage(0); // về trang đầu
    };

    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
        setPage(0); // về trang đầu
    };

    const statusMap = {
        PENDING: { label: "Chờ xử lý", color: "bg-yellow-500" },
        CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-500" },
        PROCESSING: { label: "Đang xử lý", color: "bg-indigo-500" },
        SHIPPED: { label: "Đã giao cho đơn vị vận chuyển", color: "bg-purple-500" },
        DELIVERED: { label: "Đã giao hàng", color: "bg-green-500" },
        CANCELLED: { label: "Đã hủy", color: "bg-red-500" },
        RETURNED: { label: "Đã trả hàng", color: "bg-orange-500" },
        REFUNDED: { label: "Đã hoàn tiền", color: "bg-pink-500" },
        COMPLETED: { label: "Hoàn tất", color: "bg-green-600" }
    };
    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý đơn hàng</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý đơn hàng</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Tìm theo tên danh mục..."
                            className="border px-4 py-2 rounded w-72 outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Tìm kiếm
                        </button>
                    </div>
                    <div className="flex gap-4 items-center justify-end">
                        <select
                            value={sortBy}
                            onChange={handleSortByChange}
                            className="border px-4 py-2 rounded w-48 outline-none"
                        >
                            <option value="id">Sắp xếp theo ID</option>
                            <option value="name">Sắp xếp theo tên</option>
                        </select>

                        <select
                            value={direction}
                            onChange={handleDirectionChange}
                            className="border px-4 py-2 rounded w-36 outline-none"
                        >
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <table className="w-full table-auto bg-white shadow rounded">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3">Mã đơn</th>
                                <th className="p-3">Ảnh sản phẩm</th>
                                <th className="p-3">Tên sản phẩm</th>
                                <th className="p-3">Số lượng</th>
                                <th className="p-3">Giá</th>
                                <th className="p-3">Người nhận</th>
                                <th className="p-3">SĐT</th>
                                <th className="p-3">Địa chỉ giao hàng</th>
                                <th className="p-3">Ngày đặt</th>
                                <th className="p-3">Tổng tiền</th>
                                <th className="p-3">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listOrder.length === 0 ? (
                                <tr>
                                    <td colSpan="11" className="text-center py-6">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <img
                                                src="https://www.shutterstock.com/image-vector/no-result-document-file-data-600nw-2293706569.jpg"
                                                alt="Không có dữ liệu"
                                                className="w-32 h-32 object-contain opacity-60"
                                            />
                                            <p className="text-gray-500">Không có dữ liệu</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                listOrder.map((order) =>
                                    order.orderItems.map((item) => (
                                        <tr
                                            key={`${order.id}-${item.id}`}
                                            className="border-t hover:bg-blue-50 cursor-pointer"
                                            onClick={() => navigate(`/order-manager/${order.id}`)}
                                        >
                                            <td className="p-3">{order.id}</td>
                                            <td className="p-3">
                                                <img
                                                    src={item.productVariant.imageUrl}
                                                    alt={item.productVariant.name}
                                                    className="h-10 w-auto object-contain"
                                                />
                                            </td>
                                            <td className="p-3">{item.productVariant.name}</td>
                                            <td className="p-3">{item.quantity}</td>
                                            <td className="p-3">
                                                {item.unitAmount.toLocaleString("vi-VN")}₫
                                            </td>
                                            <td className="p-3">{order.recipientName || "—"}</td>
                                            <td className="p-3">{order.recipientPhone || "—"}</td>
                                            <td className="p-3">{order.deliveryAddress}</td>
                                            <td className="p-3">
                                                {new Date(order.orderTime).toLocaleString("vi-VN")}
                                            </td>
                                            <td className="p-3 font-semibold text-red-500">
                                                {order.finalAmount.toLocaleString("vi-VN")}₫
                                            </td>
                                            <td className="p-3 w-36">
                                                <span
                                                    className={`px-1 py-1 rounded text-white ${statusMap[order.status]?.color || "bg-gray-500"}`}
                                                >
                                                    {statusMap[order.status]?.label || order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )
                            )}
                        </tbody>
                    </table>
                )}
                <div className="flex justify-between items-center pt-4">
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        className={`px-4 py-2 rounded ${page <= 0 ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
                    >
                        Trang trước
                    </button>
                    <span>Trang {page + 1} / {totalPages}</span>
                    <button
                        disabled={page + 1 >= totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className={`px-4 py-2 rounded ${page + 1 >= totalPages ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
        </ClippedDrawer>

    )
}

export default OrderManager