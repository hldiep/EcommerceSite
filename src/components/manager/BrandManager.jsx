import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { createBrand, fetchBrandsWithPaging, updateBrandById } from '../../api/brand';
import Table from '../ui/Table';
const BrandManager = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [keyword, setKeyword] = useState('');

    const [currentPage, setCurrentPage] = useState(1);  // Table: 1-based
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');
    const [editingBrand, setEditingBrand] = useState(null);

    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        logoUrl: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        loadBrands();
    }, [page, sortBy, direction, pageSize, keyword]);
    const loadBrands = async () => {
        setLoading(true);
        try {
            const data = await fetchBrandsWithPaging({
                page,
                size: pageSize,
                search: keyword,
                sortBy,
                direction,
            });
            setBrands(data.data);
            setTotalItems(data.totalElements || 0);
        } catch (error) {
            console.error('Lỗi tải danh mục:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        setPage(0);
        loadBrands();
    };

    const handleEditClick = (brand) => {
        setEditingBrand(brand);
        setEditForm({
            name: brand.name || '',
            description: brand.description || '',
            logoUrl: brand.logoUrl || '',
            status: brand.status || 'ACTIVE',
        });
    };
    const handleSubmit = async () => {
        try {
            const payload = {
                ...editForm,
            };

            if (editingBrand?.id) {
                await updateBrandById(editingBrand.id, payload);
                toast.success('Cập nhật thành công!');
            } else {
                await createBrand(payload);
                toast.success('Tạo mới thành công!');
            }

            setEditingBrand(null);
            loadBrands();
        } catch (error) {
            console.log('Lỗi:', error.message);
            try {
                const { data } = JSON.parse(error.message);
                if (data?.name || data?.seoName) {
                    toast.error(`${data.name || ''} ${data.seoName || ''}`);
                } else {
                    toast.error('Thao tác thất bại');
                }
            } catch {
                toast.error('Thao tác thất bại');
            }
        }
    };
    const handleSortByChange = (e) => {
        setSortBy(e.target.value);
        setPage(0); 
    };

    const handleDirectionChange = (e) => {
        setDirection(e.target.value);
        setPage(0); 
    };

    const columns = [
        {key: "id", label: "Id"},
        {key: "logoUrl", label: "Logo", render: (row) => <img src={row.logoUrl} className="w-5 h-5 object-contain rounded" />},
        {key: "name", label: "Tên thương hiệu"},
        {key: "description", label: "Mô tả"}
    ]
    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">

                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý danh mục sản phẩm</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý danh mục</h2>
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
                                name: '',
                                description: '',
                                logoUrl: '',
                                status: 'ACTIVE',
                            });
                            setEditingBrand({});
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
                    data={brands}
                    pageSize={pageSize}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    onPaging={(p) => {
                        setCurrentPage(p);
                        setPage(p - 1);
                    }}

                    onPagingSizeChange={(size) => {
                        setPageSize(size);
                        setCurrentPage(1);
                        setPage(0);   
                    }}
                    onRowClick={(row) => handleEditClick(row)}
                    />
                )}
                <Transition.Root show={!!editingBrand} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setEditingBrand(null)}>
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
                                            Chỉnh sửa thương hiệu
                                        </Dialog.Title>
                                        <button
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setEditingBrand(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên thương hiệu</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Tên thương hiệu"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                            <textarea
                                                rows={4}
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.description}
                                                onChange={(e) =>
                                                    setEditForm({
                                                        ...editForm,
                                                        description: e.target.value,
                                                    })
                                                }
                                                placeholder="Nhập mô tả chi tiết tại đây"
                                            />
                                        </div>
                                        <div>
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
                                            onClick={() => setEditingBrand(null)}
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


export default BrandManager