import React, { useEffect, useState } from 'react'
import ClippedDrawer from '../dashboard/DashboardLayoutBasic'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { changeOrderStatus, getOrderById } from '../../api/order-manager';

const OrderManagerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const data = await getOrderById(id);
            setOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        if (!window.confirm(`Bạn có chắc muốn đổi trạng thái thành "${newStatus}"?`)) return;

        try {
            setUpdating(true);
            await changeOrderStatus(id, newStatus);
            setOrder((prev) => ({ ...prev, status: newStatus }));
            alert("Cập nhật trạng thái thành công!");
        } catch (error) {
            alert("Cập nhật trạng thái thất bại: " + error.message);
        } finally {
            setUpdating(false);
        }
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
                        <button onClick={() => navigate('/order-manager')} className="hover:underline text-blue-600">
                            Quản lý đơn hàng
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Chi tiết đơn hàng</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Chi tiết đơn hàng #{order?.id}</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : error ? (
                    <div className="text-red-500">Lỗi: {error}</div>
                ) : (
                    <>
                        <div className="bg-white shadow rounded p-4 space-y-3">
                            <p><strong>Người nhận:</strong> {order.recipientName}</p>
                            <p><strong>SĐT:</strong> {order.recipientPhone}</p>
                            <p><strong>Địa chỉ giao hàng:</strong> {order.deliveryAddress}</p>
                            <p><strong>Ngày đặt:</strong> {new Date(order.orderTime).toLocaleString("vi-VN")}</p>
                            <p className="flex items-center space-x-2">
                                <strong>Trạng thái:</strong>
                                <select
                                    value={order.status}
                                    onChange={handleStatusChange}
                                    disabled={updating}
                                    className="border px-2 py-1 rounded"
                                >
                                    <option value="PENDING">Chờ xử lý</option>
                                    <option value="CONFIRMED">Đã xác nhận</option>
                                    <option value="PROCESSING">Đang xử lý</option>
                                    <option value="SHIPPED">Đã giao cho đơn vị vận chuyển</option>
                                    <option value="DELIVERED">Đã giao hàng</option>
                                    <option value="CANCELLED">Đã hủy</option>
                                    <option value="RETURNED">Đã trả hàng</option>
                                    <option value="REFUNDED">Đã hoàn tiền</option>
                                </select>
                                {updating && <span className="text-blue-500">Đang cập nhật...</span>}
                            </p>
                            <p><strong>Ghi chú:</strong> {order.note || "—"}</p>
                        </div>

                        <h2 className="text-xl font-semibold mt-6 mb-2">Sản phẩm</h2>
                        <table className="w-full table-auto bg-white shadow rounded">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">Ảnh</th>
                                    <th className="p-3">Tên sản phẩm</th>
                                    <th className="p-3">Số lượng</th>
                                    <th className="p-3">Đơn giá</th>
                                    <th className="p-3">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.orderItems.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-3">
                                            <img
                                                src={item.productVariant.imageUrl}
                                                alt={item.productVariant.name}
                                                className="h-12 w-auto object-contain"
                                            />
                                        </td>
                                        <td className="p-3">
                                            <Link to={`/products-manager/${item.productVariant.id}`} className="text-blue-500 hover:underline">
                                                {item.productVariant.name}
                                            </Link>
                                        </td>
                                        <td className="p-3">{item.quantity}</td>
                                        <td className="p-3">
                                            {item.unitAmount.toLocaleString("vi-VN")}₫
                                        </td>
                                        <td className="p-3">
                                            {(item.unitAmount * item.quantity).toLocaleString("vi-VN")}₫
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 text-right font-bold text-lg">
                            Tổng tiền: {order.finalAmount.toLocaleString("vi-VN")}₫
                        </div>
                    </>
                )}
            </div>
        </ClippedDrawer>
    );
}

export default OrderManagerDetailPage
