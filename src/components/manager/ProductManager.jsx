import React, { useEffect, useState } from 'react';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import { useNavigate } from 'react-router-dom';
import { fetchCategoriesWithPaging } from '../../api/categories';
import { fetchBrandsWithPaging } from '../../api/brand';
import { changeProductStatus, fetchProductsWithPaging } from '../../api/product';
import { toast } from 'react-toastify';
import Table from '../ui/Table';
const ProductManager = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    // States
    const [keyword, setKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [page, setPage] = useState(0);
    const [products, setProducts] = useState([]);
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
                size: pageSize,
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
            setTotalItems(data.totalElements || 0);
        } catch (error) {
            console.error('Lỗi tải sản phẩm:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [page, pageSize, keyword, brandId, categoryId, status, sortBy, direction]);
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

    const handleDeleteProduct = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;

        const status = 'DELETED';
        console.log("Gửi yêu cầu đổi trạng thái sản phẩm:", { id, status }); // log ra id và status

        try {
            await changeProductStatus(id, status);
            toast.success("Đã xoá sản phẩm thành công");
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái:", error);
            toast.error("Xoá sản phẩm thất bại");
        }
    };

    const columns = [
        {
            key: "name",
            label: "Tên sản phẩm",
            render: (row) => row.name
        },
        {
            key: "brand",
            label: "Thương hiệu",
            render: (row) => row.brand?.name || "-"
        },
        {
            key: "actions",
            label: "Thao tác",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/products-manager/edit/${row.id}`);
                        }}
                    >
                        Sửa
                    </button>

                    <button
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProduct(row.id);
                        }}
                    >
                        Xoá
                    </button>
                </div>
            )
        }
    ];
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

                <div className="flex flex-wrap justify-between items-start gap-4">
               
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
                    <Table
                        columns={columns}
                        data={products}
                        currentPage={currentPage}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        onPaging={(p) => {
                            setCurrentPage(p);
                            setPage(p-1)
                        }}
                        onPagingSizeChange={(size) => setPageSize(size)}
                        onRowClick={(row) => navigate(`/products-manager/${row.id}`)}
                    />
                )}
            </div>
        </ClippedDrawer>
    );
};

export default ProductManager;
