import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesWithPaging } from '../../api/categories';
import { fetchBrandsWithPaging } from '../../api/brand';
import { fetchProductsWithPaging } from '../../api/product';

const ProductManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // States
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [products, setProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [brandId, setBrandId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [status, setStatus] = useState('');
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sortBy, setSortBy] = useState('id');
    const [direction, setDirection] = useState('desc');
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await fetchCategoriesWithPaging({ page: 0, size: 100 });
                setCategories(res.data);
            } catch (error) {
                console.error('Lỗi tải danh mục:', error);
            }
        };

        loadCategories();
    }, []);

    const flattenCategories = (categories, level = 0) => {
        return categories.flatMap(cat => [
            { ...cat, level },
            ...(cat.children ? flattenCategories(cat.children, level + 1) : [])
        ]);
    };
    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await fetchBrandsWithPaging({ page: 0, size: 100 });
                setBrands(data.data || []);
            } catch (error) {
                console.error('Lỗi tải thương hiệu:', error);
            }
        };

        loadBrands();
    }, []);
    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await fetchProductsWithPaging({
                page,
                size,
                keyword,
                brandId: brandId || undefined,
                categoryId: categoryId || undefined,
                status: status || undefined,
                minPrice: minPrice || undefined,
                maxPrice: maxPrice || undefined,
                sortBy,
                direction,
            });
            console.log('data trả về', data);
            setProducts(data.data || []);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [page, size, keyword, brandId, categoryId, status, sortBy, direction]);
    const handleChange = (e) => {
        const { name, value, options, type, multiple } = e.target;
        if (multiple) {
            const selectedValues = Array.from(options)
                .filter((option) => option.selected)
                .map((option) => option.value);
            setForm({ ...form, [name]: selectedValues });
        } else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleSearch = () => setPage(0);
    const [expandedRows, setExpandedRows] = useState([]);

    const toggleRow = (productId) => {
        setExpandedRows((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };
    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                {/* Header */}
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý sản phẩm</span>
                    </div>
                    <div className='flex justify-between items-center'>
                        <h2 className="text-xl font-semibold p-4">Quản lý sản phẩm</h2>
                        <div className='flex space-x-2 mr-2'>
                            <button onClick={() => navigate('/products-manager/slide')}
                                className='px-2 py-1 bg-green-600 rounded-lg text-white'>Slide</button>
                            <button onClick={() => navigate('/products-manager/option')}
                                className='px-2 py-1 bg-blue-600 rounded-lg text-white'>Option</button>
                        </div>
                    </div>

                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-between items-start gap-4">
                    {/* Bộ lọc tìm kiếm */}
                    <div className="flex flex-wrap gap-4 items-center">
                        <input
                            type="text"
                            placeholder="Tìm theo tên..."
                            className="border px-4 py-2 rounded w-60 outline-none"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />

                        <select
                            value={brandId}
                            onChange={(e) => setBrandId(e.target.value)}
                            className="border px-4 py-2 rounded w-52 outline-none"
                        >
                            <option value="">-- Thương hiệu --</option>
                            {brands.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>

                        {/* <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="border px-4 py-2 rounded w-52 outline-none"
                        >
                            <option value="">-- Danh mục --</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select> */}
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="border px-4 py-2 rounded w-60 outline-none"
                        >
                            <option value="">-- Danh mục --</option>
                            {flattenCategories(categories).map((c) => (
                                <option key={c.id} value={c.id}>
                                    {`${'-- '.repeat(c.level)}${c.name}`}
                                </option>
                            ))}
                        </select>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border px-4 py-2 rounded w-40 outline-none"
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="ACTIVE">Hoạt động</option>
                            <option value="INACTIVE">Ngừng bán</option>
                        </select>

                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border px-4 py-2 rounded w-48 outline-none"
                        >
                            <option value="id">Sắp xếp theo ID</option>
                            <option value="name">Sắp xếp theo tên</option>
                            <option value="price">Sắp xếp theo giá</option>
                        </select>

                        <select
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
                            className="border px-4 py-2 rounded w-36 outline-none"
                        >
                            <option value="asc">Tăng dần</option>
                            <option value="desc">Giảm dần</option>
                        </select>

                        <input
                            type="number"
                            min="0"
                            placeholder="Giá tối thiểu"
                            value={minPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setMinPrice(value < 0 ? 0 : value);
                            }}
                            className="border rounded px-3 py-1 w-40 outline-none"
                        />

                        <input
                            type="number"
                            min="0"
                            placeholder="Giá tối đa"
                            value={maxPrice}
                            onChange={(e) => {
                                const value = Number(e.target.value);
                                setMaxPrice(value < 0 ? 0 : value);
                            }}
                            className="border rounded px-3 py-1 w-40 outline-none"
                        />

                        <button
                            onClick={handleSearch}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            Lọc
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/products-manager/add')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded h-fit"
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
                    <table className="w-full table-auto border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Tên sản phẩm</th>
                                <th className="px-4 py-2 text-left">Thương hiệu</th>
                                <th className="px-4 py-2 text-left">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
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
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-t hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/products-manager/${product.id}`)}
                                    >
                                        <td className="px-4 py-2">{product.name}</td>
                                        <td className="px-4 py-2">{product.brand?.name || '-'}</td>
                                        <td className="px-4 py-2">
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    className="px-2 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleAddVariant(product.id);
                                                    }}
                                                >
                                                    + Biến thể
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditProduct(product);
                                                    }}
                                                >
                                                    Sửa
                                                </button>
                                                <button
                                                    className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 text-white rounded"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteProduct(product.id);
                                                    }}
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}

                {/* Pagination */}
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                        disabled={page === 0}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <span className="px-3 py-1">Trang {page + 1} / {totalPages}</span>
                    <button
                        onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
                        disabled={page + 1 >= totalPages}
                        className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </ClippedDrawer>
    );
};

export default ProductManager;
