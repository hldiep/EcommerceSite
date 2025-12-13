import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { changeCustomersStatus, fetchCustomersWithPaging } from '../../api/customer';
import Table from '../ui/Table';
const CustomerManager = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);  // Table: 1-based
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);  

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({
        status: ''
    });

    useEffect(() => {
        loadCustomer();
    }, [page, sortBy, direction, keyword, pageSize]);
    const loadCustomer = async () => {
        setLoading(true);
        try {
            const data = await fetchCustomersWithPaging({
                page,
                size: pageSize,
                keyword,
                sortBy,
                direction,
            });
            setCustomers(data.data);
            setTotalItems(data.totalElements || 0);
        } catch (error) {
            console.error('Lỗi tải nhân viên:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (customer) => {
        setEditing(customer);
        setEditForm({
            status: customer.status || '',
        });
    };
    const handleSubmit = async () => {
        try {
            if (!editing?.id) {
                toast.error('Không tìm thấy khách hàng để cập nhật');
                return;
            }

            await changeCustomersStatus(editing.id, editForm.status);
            toast.success('Cập nhật trạng thái thành công');
            setEditing(null);
            loadCustomer();
        } catch (error) {
            toast.error('Cập nhật trạng thái thất bại');
            console.error(error);
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
        { key: "username", label: "Tên đăng nhập" },
        { key: "fullName", label: "Họ và tên" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Số điện thoại" },
        { key: "gender", label: "Giới tính" },
        { 
            key: "birthday", 
            label: "Ngày sinh",
            render: (row) => row.birthday ? row.birthday.split("T")[0] : "" 
        },
        { key: "address", label: "Địa chỉ" },
        { key: "role", label: "Vai trò" },
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
                        <span className="text-gray-700 font-medium">Quản lý khách hàng</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý khách hàng</h2>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <label htmlFor="">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Tìm theo tên..."
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
                            <option value="fullName">Sắp xếp theo tên</option>
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
                    <Table
                        columns={columns}
                        pageSize={pageSize}
                        totalItems={totalItems}
                        currentPage={currentPage}
                        data={customers}
                        onPaging={(p)=>{
                            setCurrentPage(p);
                            setPage(p-1)
                        }}
                        onPagingSizeChange={(size)=>{
                            setPageSize(size);
                            setCurrentPage(1);
                            setPage(0);
                        }}
                        onRowClick={(row)=>handleEditClick(row)}
                     />
                )}
                <Transition.Root show={!!editing} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setEditing(null)}>
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
                                <Dialog.Panel className="pointer-events-auto w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                    <div className="flex items-start justify-between">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                            Thay đổi trạng thái
                                        </Dialog.Title>
                                        <button
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setEditing(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="mt-6">

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                            <select
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                                className="border px-3 py-2 rounded w-full outline-none"
                                            >
                                                <option value="ACTIVE">ACTIVE</option>
                                                <option value="PENDING">PENDING</option>
                                                <option value="BLOCKED">BLOCKED</option>
                                                <option value="DELETED">DELETED</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex gap-2">
                                        <button
                                            onClick={handleSubmit}
                                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Lưu
                                        </button>
                                        <button
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


export default CustomerManager