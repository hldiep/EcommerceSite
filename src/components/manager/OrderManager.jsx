import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { getOrder } from '../../api/order-manager';
import Table from '../ui/Table';

const OrderManager = () => {
    const navigate = useNavigate();

    const [listOrder, setListOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    const [keyword, setKeyword] = useState('');

    const [currentPage, setCurrentPage] = useState(1);  // Table: 1-based
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(0); // API: 0-based
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');

    const loadOrder = async () => {
        try {
            const data = await getOrder({
                page,
                size: pageSize,
                sortBy,
                direction,
                keyword,
            });

            setListOrder(data.data || []);
            setTotalItems(data.totalElements || 0);
        } catch (error) {
            console.error('Lỗi tải đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrder();
    }, [page, pageSize, sortBy, direction]);

    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setPage(0);
    };

    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
        setPage(0);
    };

    const handleSearch = () => {
        setPage(0);
        loadOrder();
    };

    const convertToTableData = (orders) =>
        orders.flatMap(order =>
            order.orderItems?.map(item => ({
                orderId: order.id,
                image: item.productVariant.imageUrl,
                name: item.productVariant.name,
                quantity: item.quantity,
                price: item.unitAmount,
                recipient: order.recipientName,
                phone: order.recipientPhone,
                address: order.deliveryAddress,
                orderTime: order.orderTime,
                finalAmount: order.finalAmount,
                status: order.status,
            })) || []
        );

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

    const columns = [
        { key: "orderId", label: "Mã đơn" },
        {
            key: "image",
            label: "Ảnh",
            render: (row) => <img src={row.image} className="w-10 h-10 object-contain rounded" />
        },
        { key: "name", label: "Tên sản phẩm" },
        { key: "quantity", label: "Số lượng" },
        {
            key: "price",
            label: "Giá",
            render: (row) => row.price.toLocaleString("vi-VN") + "₫",
        },
        { key: "recipient", label: "Người nhận" },
        { key: "phone", label: "SĐT" },
        { key: "address", label: "Địa chỉ" },
        {
            key: "orderTime",
            label: "Ngày đặt",
            render: (row) => new Date(row.orderTime).toLocaleString("vi-VN"),
        },
        {
            key: "finalAmount",
            label: "Tổng tiền",
            render: (row) => <span className="text-red-500 font-semibold">{row.finalAmount.toLocaleString("vi-VN")}₫</span>,
        },
        {
            key: "status",
            label: "Trạng thái",
            render: (row) => (
                <span
                    className={`px-2 py-1 text-xs rounded-full text-white whitespace-nowrap ${statusMap[row.status]?.color}`}
                    style={{
                        display: "inline-block",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {statusMap[row.status]?.label}
                </span>
            ),
        },
    ];

    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                {/* Breadcrumb */}
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

                {/* Search + Sort */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Tìm theo tên sản phẩm..."
                            className="border px-4 py-2 rounded w-72 outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                            Tìm kiếm
                        </button>
                    </div>

                    <div className="flex gap-4 items-center justify-end">
                        <select value={sortBy} onChange={handleSortByChange} className="border px-4 py-2 rounded w-48">
                            <option value="id">Sắp xếp theo ID</option>
                            <option value="name">Sắp xếp theo tên</option>
                        </select>

                        <select value={direction} onChange={handleDirectionChange} className="border px-4 py-2 rounded w-36">
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        data={convertToTableData(listOrder)}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        onPaging={(p)=>{
                            setCurrentPage(p)
                            setPage(p-1)
                        }}
                        onPagingSizeChange={(size)=>{
                            setPageSize(size)
                            setCurrentPage(1)
                            setPage(0)
                        }}
                        onRowClick={(row) => navigate(`/order-manager/${row.orderId}`)}
                    />
                )}

            </div>
        </ClippedDrawer>
    );
};

export default OrderManager;
