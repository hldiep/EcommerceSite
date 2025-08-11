import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { upload } from '../../api/upload-file';
import { createEmployee, fetchEmployeeWithPaging, updateEmployeeById } from '../../api/employee';
const EmployeeManager = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');
    const [editing, setEditing] = useState(null);
    const [editForm, setEditForm] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        fullName: '',
        gender: '',
        birthday: '',
        address: '',
        roleId: ''
    });

    useEffect(() => {
        loadEmployee();
    }, [page, sortBy, direction]);
    const loadEmployee = async () => {
        setLoading(true);
        try {
            const data = await fetchEmployeeWithPaging({
                page,
                size: 10,
                search: keyword,
                sortBy,
                direction,
            });
            setEmployees(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi tải nhân viên:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        setPage(0);
        loadEmployee();
    };

    const handleEditClick = (employee) => {
        setEditing(employee);
        setEditForm({
            username: employee.username || '',
            password: '',
            email: employee.email || '',
            phone: employee.phone || '',
            fullName: employee.fullName || '',
            gender: employee.gender === "Nam" ? "Nam" : "Nu",
            birthday: employee.birthday || '',
            address: employee.address || '',
            roleId: employee.role.id || ''
        });
    };
    const handleSubmit = async () => {
        try {
            const payload = {
                ...editForm,
            };
            if (!payload.password) {
                delete payload.password;
            }
            console.log("Payload gửi đi:", payload);
            if (!editForm.username || !editForm.username.trim()) {
                toast.error("Vui lòng nhập tên đăng nhập!");
                return;
            }
            if (!editForm.email || !editForm.email.trim()) {
                toast.error("Vui lòng nhập email!");
                return;
            }
            if (!editForm.phone || !editForm.phone.trim()) {
                toast.error("Vui lòng nhập số điện thoại!");
                return;
            }
            if (!editForm.fullName || !editForm.fullName.trim()) {
                toast.error("Vui lòng nhập họ và tên!");
                return;
            }
            if (!editForm.gender || !editForm.gender.trim()) {
                toast.error("Vui lòng chọn giới tính!");
                return;
            }
            if (!editForm.birthday) {
                toast.error("Vui lòng chọn ngày sinh!");
                return;
            }
            if (!editForm.address || !editForm.address.trim()) {
                toast.error("Vui lòng nhập địa chỉ!");
                return;
            }
            if (!editForm.roleId) {
                toast.error("Vui lòng chọn vai trò!");
                return;
            }

            if (editing?.id) {
                await updateEmployeeById(editing.id, payload);
                toast.success('Cập nhật thành công!');
            } else {
                await createEmployee(payload);
                toast.success('Tạo mới thành công!');
            }
            setEditing(null);
            loadEmployee();
        } catch (error) {
            console.log('Lỗi:', error.message);
            try {
                const { data } = JSON.parse(error.message);
                if (data?.name) {
                    toast.error(`${data.name || ''}`);
                } else {
                    toast.error('Thao tác thất bại. Vui lòng kiểm tra đầy đủ thông tin');
                }
            } catch {
                toast.error('Thao tác thất bại. Vui lòng kiểm tra đầy đủ thông tin');
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

    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý nhân viên</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý nhân viên</h2>
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
                            onClick={handleSearch}
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
                    <button
                        onClick={() => {
                            setEditForm({
                                username: '',
                                password: '',
                                email: '',
                                phone: '',
                                fullName: '',
                                gender: '',
                                birthday: '',
                                address: '',
                                roleId: ''
                            });
                            setEditing({});
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
                    <table className="w-full table-auto bg-white shadow rounded">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3">Tên đăng nhập</th>
                                <th className="p-3">Họ và tên</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Số điện thoại</th>
                                <th className="p-3">Giới tính</th>
                                <th className="p-3">Ngày sinh</th>
                                <th className="p-3">Địa chỉ</th>
                                <th className="p-3">Vai trò</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-6">
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
                                employees.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-blue-50 cursor-pointer"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <td className="p-3">{item.username}</td>
                                        <td className="p-3">{item.fullName}</td>
                                        <td className="p-3">{item.email}</td>
                                        <td className="p-3">{item.phone}</td>
                                        <td className="p-3">{item.gender}</td>
                                        <td className="p-3">{item.birthday ? item.birthday.split('T')[0] : ''}</td>
                                        <td className="p-3">{item.address}</td>
                                        <td className="p-3">{item.role.name}</td>
                                        <td className="p-3">{item.status}</td>
                                        <td className="p-3 flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(item)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(item.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded"
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
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
                                <Dialog.Panel className="pointer-events-auto w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                                    <div className="flex items-start justify-between">
                                        <Dialog.Title className="text-lg font-medium text-gray-900">
                                            Thông tin
                                        </Dialog.Title>
                                        <button
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setEditing(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="mt-6 grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.username}
                                                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                                placeholder="Nhập tên đăng nhập"
                                            />
                                        </div>

                                        {!editing?.id && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                                                <input
                                                    type="password"
                                                    className="border px-3 py-2 rounded w-full outline-none"
                                                    value={editForm.password}
                                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                    placeholder="Nhập mật khẩu"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                placeholder="Nhập email"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                                placeholder="Nhập số điện thoại"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.fullName}
                                                onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                                placeholder="Nhập họ và tên"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                            <select
                                                value={editForm.gender}
                                                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                                                className="border px-3 py-2 rounded w-full outline-none"
                                            >
                                                <option value="">-- Chọn giới tính --</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nu">Nữ</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                            <input
                                                type="date"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.birthday}
                                                onChange={(e) => setEditForm({ ...editForm, birthday: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
                                            <select
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.roleId}
                                                onChange={(e) => setEditForm({ ...editForm, roleId: e.target.value })}
                                            >
                                                <option value="">-- Chọn vai trò --</option>
                                                <option value={1}>Quản lý</option>
                                            </select>
                                        </div>

                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                            <textarea
                                                rows={2}
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.address}
                                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                                                placeholder="Nhập địa chỉ"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mật khẩu
                                            </label>
                                            <input
                                                type="password"
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.password}
                                                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                                placeholder={"Nhập mật khẩu"}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                            <select
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.status}
                                                onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                            >
                                                <option value="ACTIVE">ACTIVE</option>
                                                <option value="INACTIVE">INACTIVE</option>
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
                                            onClick={() => setEditing(null)}
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
    );
};


export default EmployeeManager