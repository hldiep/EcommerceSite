import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { createCategory, fetchCategoriesWithPaging, updateCategoryById } from '../../api/categories';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-toastify';
const CategoriesManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState('id');
  const [direction, setDirection] = useState('asc');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    seoName: '',
    categoryParentId: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    loadCategories();
  }, [page, sortBy, direction]);
  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchCategoriesWithPaging({
        page,
        size: 10,
        search: keyword,
        sortBy,
        direction,
      });
      setCategories(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Lỗi tải danh mục:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    setPage(0);
    loadCategories();
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name || '',
      seoName: category.seoName || '',
      categoryParentId: category.category?.id || '',
      status: category.status || 'ACTIVE',
    });
  };
  const handleSubmit = async () => {
    try {
      const payload = {
        ...editForm,
        categoryParentId: editForm.categoryParentId || null, // chuyển '' -> null nếu không có
      };

      if (editingCategory?.id) {
        await updateCategoryById(editingCategory.id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await createCategory(payload);
        toast.success('Tạo mới thành công!');
      }

      setEditingCategory(null);
      loadCategories();
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
                seoName: '',
                categoryParentId: '',
                status: 'ACTIVE',
              });
              setEditingCategory({});
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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
                <th className="p-3">ID</th>
                <th className="p-3">Tên danh mục</th>
                <th className="p-3">SEO Name</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
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
                categories.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-blue-50 cursor-pointer"
                    onClick={() => handleEditClick(item)}
                  >
                    <td className="p-3">{item.id}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 text-gray-500">{item.seoName}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
        <Transition.Root show={!!editingCategory} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-[9999]" onClose={() => setEditingCategory(null)}>
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
                      Chỉnh sửa danh mục
                    </Dialog.Title>
                    <button
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => setEditingCategory(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục</label>
                      <input
                        className="border px-3 py-2 rounded w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Tên danh mục"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SEO Name</label>
                      <input
                        className="border px-3 py-2 rounded w-full"
                        value={editForm.seoName}
                        onChange={(e) => setEditForm({ ...editForm, seoName: e.target.value })}
                        placeholder="SEO Name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">ID danh mục cha</label>
                      <input
                        className="border px-3 py-2 rounded w-full"
                        value={editForm.categoryParentId}
                        onChange={(e) => setEditForm({ ...editForm, categoryParentId: e.target.value })}
                        placeholder="ID danh mục cha"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                      <select
                        className="border px-3 py-2 rounded w-full"
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
                      onClick={() => setEditingCategory(null)}
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

export default CategoriesManager;
