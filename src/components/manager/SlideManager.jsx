import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
import { createSlides, fetchSlidesWithPaging, updateSlidesById } from '../../api/slide';
import { upload } from '../../api/upload-file';
const SlideManager = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('asc');
    const [editingSlide, setEditingSlide] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        imageUrl: '',
        link: '',
        description: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        loadSlide();
    }, [page, sortBy, direction]);
    const loadSlide = async () => {
        setLoading(true);
        try {
            const data = await fetchSlidesWithPaging({
                page,
                size: 10,
                search: keyword,
                sortBy,
                direction,
            });
            setSlides(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi tải slide:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = () => {
        setPage(0);
        loadSlide();
    };

    const handleEditClick = (slide) => {
        setEditingSlide(slide);
        setEditForm({
            name: slide.name || '',
            imageUrl: slide.imageUrl || '',
            link: slide.link || '',
            description: slide.description || '',
            status: slide.status || 'ACTIVE',
        });
    };
    const handleSubmit = async () => {
        try {
            const payload = {
                ...editForm,
            };
            console.log("Payload gửi đi:", payload);
            if (!editForm.name.trim()) {
                toast.error("Vui lòng nhập tiêu đề!");
                return;
            }
            if (!editForm.link.trim()) {
                toast.error("Vui lòng nhập link!");
                return;
            }
            if (editingSlide?.id) {
                await updateSlidesById(editingSlide.id, payload);
                toast.success('Cập nhật thành công!');
            } else {
                await createSlides(payload);
                toast.success('Tạo mới thành công!');
            }

            setEditingSlide(null);
            loadSlide();
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);

        try {
            const imageUrl = await upload(file);
            console.log("Link ảnh trả về từ upload:", imageUrl);

            setEditForm((prev) => ({
                ...prev,
                imageUrl: imageUrl,
            }));

            setError('');
        } catch (err) {
            console.error("Lỗi upload ảnh:", err);
            setError("Không thể tải ảnh lên. Vui lòng thử lại.");
        } finally {
            setIsUploading(false);
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
                        <button onClick={() => navigate('/products-manager')} className="hover:underline text-blue-600">
                            Quản lý sản phẩm
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý slide</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý slide</h2>
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
                                imageUrl: '',
                                link: '',
                                status: 'ACTIVE',
                            });
                            setEditingSlide({});
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
                                <th className="p-3">Name</th>
                                <th className="p-3">Image</th>
                                <th className="p-3">Link</th>
                                <th className="p-3">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {slides.length === 0 ? (
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
                                slides.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="border-t hover:bg-blue-50 cursor-pointer"
                                        onClick={() => handleEditClick(item)}
                                    >
                                        <td className="p-3">{item.name}</td>
                                        <td className="p-3">
                                            <img src={item.imageUrl} alt="slide" className="w-20 h-14 object-cover rounded" />
                                        </td>
                                        <td className="p-3">
                                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                                {item.link}
                                            </a>
                                        </td>
                                        <td className="p-3">{item.description}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
                <Transition.Root show={!!editingSlide} as={Fragment}>
                    <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setEditingSlide(null)}>
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
                                            Thông tin
                                        </Dialog.Title>
                                        <button
                                            className="text-gray-400 hover:text-gray-500"
                                            onClick={() => setEditingSlide(null)}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="mt-6 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                placeholder="Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Thêm ảnh</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
               file:rounded file:border-0 file:text-sm file:font-semibold
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            {isUploading && (
                                                <p className="text-blue-600 text-sm mt-1">Đang tải ảnh lên...</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                                            <input
                                                className="border px-3 py-2 rounded w-full outline-none"
                                                value={editForm.link}
                                                onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                                                placeholder="Link"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                            <textarea
                                                rows={3}
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
                                            onClick={() => setEditingSlide(null)}
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


export default SlideManager