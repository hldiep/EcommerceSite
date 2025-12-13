import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { fetchDiscountsWithPaging } from '../../api/discounts.js';
import { updateDiscountById } from '../../api/discounts.js';
import { createDiscount } from '../../api/discounts.js';
import Table from '../ui/Table.jsx';
const DiscountManager = () => {
    const navigate = useNavigate();
    const [discounts, setDiscounts] = useState([]);
    const [keyword, setKeyword] = useState('');

    const [currentPage, setCurrentPage] = useState(1);  // Table: 1-based
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0); 

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');
    const [editingDiscount, setEditingDiscount] = useState(null);
    const [editForm, setEditForm] = useState({
        code: '',
        title: '',
        type: '',
        value: '',
        startAt: '',
        endAt: '',
        scope: '',
        usageLimit: '',
        minOrderAmount: '',
        description: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        loadDiscounts();
    }, [page, sortBy, direction, pageSize, keyword]);
    const loadDiscounts = async () => {
        setLoading(true);
        try {
            const data = await fetchDiscountsWithPaging({
                page,
                size: pageSize,
                keyword: keyword,
                sortBy,
                direction,
            });
            setDiscounts(data.data);
            setTotalItems(data.totalElements);
        } catch (error) {
            console.error('Lỗi tải danh sách mã giảm giá:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (discount) => {
        setEditingDiscount(discount);
        setEditForm({
            code: discount.code || '',
            title: discount.title || '',
            type: discount.type || '',
            value: discount.value || '',
            startAt: discount.startAt || '',
            endAt: discount.endAt || '',
            scope: discount.scope || '',
            usageLimit: discount.usageLimit || '',
            minOrderAmount: discount.minOrderAmount || '',
            description: discount.description || '',
            status: discount.status || 'ACTIVE',
        });
    };
    const handleSubmit = async () => {
        try {
            const formatDateTime = (value) => {
                return value ? new Date(value).toISOString() : null;
            };

            const payload = {
                ...editForm,
                value: Number(editForm.value),
                usageLimit: Number(editForm.usageLimit),
                minOrderAmount: Number(editForm.minOrderAmount),
                startAt: formatDateTime(editForm.startAt),
                endAt: formatDateTime(editForm.endAt),
            };
            console.log('Payload', payload);
            if (editingDiscount?.id) {
                await updateDiscountById(editingDiscount.id, payload);
                toast.success('Cập nhật thành công!');
            } else {
                await createDiscount(payload);
                toast.success('Tạo mới thành công!');
            }

            setEditingDiscount(null);
            loadDiscounts();
        } catch (error) {
            console.log('Lỗi:', error);

            try {
                const parsed = typeof error.message === 'string' ? JSON.parse(error.message) : {};
                const data = parsed?.data || {};

                if (data?.code || data?.title) {
                    toast.error(`${data.code || ''} ${data.title || ''}`);
                } else {
                    toast.error('Thao tác thất bại');
                }
            } catch (e) {
                toast.error('Thao tác thất bại');
            }
        }
    };
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setPage(0); // về trang đầu
    };

    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
        setPage(0); // về trang đầu
    };

    const columns = [
        { key: "code", label: "Code" },
        { key: "title", label: "Title" },
        {
            key: "date",
            label: "Thời gian",
            render: (row) => {
                const start = new Date(row.startAt).toLocaleDateString("vi-VN");
                const end = new Date(row.endAt).toLocaleDateString("vi-VN");
                return `${start} - ${end}`;
            },
        },
        { key: "description", label: "Mô tả" },
        { key: "usageLimit", label: "Giới hạn" },
    ];
    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý mã giảm giá</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý mã giảm giá</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Nhập tìm kiếm..."
                            className="border px-4 py-2 rounded w-72 outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter'}
                        />
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
                    <button
                        onClick={() => {
                            setEditForm({
                                code: '',
                                title: '',
                                type: '',
                                value: '',
                                startAt: '',
                                endAt: '',
                                scope: '',
                                usageLimit: '',
                                minOrderAmount: '',
                                description: '',
                                status: 'ACTIVE',
                            });
                            setEditingDiscount({});
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded ml-2"
                    >
                        Thêm
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        pageSize={pageSize}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        data={discounts}
                        onPaging={(p)=>{
                            setCurrentPage(p);
                            setPage(p-1)
                        }}
                        onPagingSizeChange={(size) => setPageSize(size)}
                        onRowClick={(row) => handleEditClick(row)}
                    />
                )}
                <Transition.Root show={!!editingDiscount} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setEditingDiscount(null)}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-300"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="transform transition ease-in-out duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-full max-w-5xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                    <div className="flex items-start justify-between">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                            Thông tin mã giảm giá
                                        </Dialog.Title>
                                        <button
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setEditingDiscount(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-6">
                                        {/* Cột trái */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mã code</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.code}
                                                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                                                placeholder="Mã code"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.title}
                                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                                placeholder="Tiêu đề"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                                            <select
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.type}
                                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                            >
                                                <option value="">-- Chọn loại --</option>
                                                <option value="FIXED">Cố định (VNĐ)</option>
                                                <option value="PERCENTAGE">Phần trăm (%)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị giảm</label>
                                            <input
                                                type="number"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.value}
                                                onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                                                placeholder="Số tiền hoặc %"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Bắt đầu</label>
                                            <input
                                                type="datetime-local"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.startAt}
                                                onChange={(e) => setEditForm({ ...editForm, startAt: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Kết thúc</label>
                                            <input
                                                type="datetime-local"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.endAt}
                                                onChange={(e) => setEditForm({ ...editForm, endAt: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn sử dụng</label>
                                            <input
                                                type="number"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.usageLimit}
                                                onChange={(e) => setEditForm({ ...editForm, usageLimit: e.target.value })}
                                                placeholder="Tối đa lượt dùng"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn hàng tối thiểu</label>
                                            <input
                                                type="number"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.minOrderAmount}
                                                onChange={(e) => setEditForm({ ...editForm, minOrderAmount: e.target.value })}
                                                placeholder="Giá trị tối thiểu"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phạm vi áp dụng</label>
                                            <select
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.scope}
                                                onChange={(e) => setEditForm({ ...editForm, scope: e.target.value })}
                                            >
                                                <option value="">-- Chọn phạm vi --</option>
                                                <option value="ALL">Tất cả</option>
                                                <option value="CATEGORY">Theo danh mục</option>
                                                <option value="PRODUCT">Theo sản phẩm</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                            <select
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                <option value="ACTIVE">Đang hoạt động</option>
                                                <option value="INACTIVE">Ngưng hoạt động</option>
                                                <option value="DELETED">Đã xóa</option>
                                            </select>
                                        </div>

                                        {/* Mô tả (chiếm 2 cột) */}
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                            <textarea
                                                rows={4}
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.description}
                                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                                placeholder="Nhập mô tả chi tiết tại đây"
                                            />
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditingDiscount(null)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>
                
            </div>
        </ClippedDrawer>
    );
};

export default DiscountManager