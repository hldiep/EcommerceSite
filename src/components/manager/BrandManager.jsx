import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchBrandsWithPaging } from '../../api/brand';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';

const BrandManager = () => {
    const navigate = useNavigate();
    const [brands, setBrands] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBrands();
    }, [page]);

    const loadBrands = async () => {
        setLoading(true);
        try {
            const data = await fetchBrandsWithPaging({ page, size: 10, search: keyword });
            setBrands(data.data || []);
            setTotalPages(data.totalPages || 1);
        } catch (error) {
            console.error('Lỗi tải brands:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(0);
        loadBrands();
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
                        <span className="text-gray-700 font-medium">Quản lý Brand</span>
                    </div>
                    <h2 className="text-xl font-semibold p-4">Quản lý Brand</h2>
                </div>

                {/* Search + Add */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="Tìm theo tên brand..."
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

                    <button
                        onClick={() => {
                            // TODO: Mở form thêm mới brand (nếu có modal/tab)
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
                ) : brands.length === 0 ? (
                    <div className="text-center text-gray-600 py-10">Không có brand nào được tìm thấy.</div>
                ) : (
                    <table className="w-full table-auto bg-white shadow rounded">
                        <thead className="bg-gray-100">
                            <tr className="text-left">
                                <th className="p-3">ID</th>
                                <th className="p-3">Tên Brand</th>
                                <th className="p-3">Logo</th>
                                <th className="p-3">Mô tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-blue-50 cursor-pointer"
                                    onClick={() => {
                                        // TODO: Chuyển sang trang chỉnh sửa brand hoặc mở modal
                                        console.log('Chỉnh sửa:', item);
                                    }}
                                >
                                    <td className="p-3">{item.id}</td>
                                    <td className="p-3">{item.name}</td>
                                    <td className="p-3">
                                        <img src={item.logoUrl} alt={item.name} className="h-10 w-auto object-contain" />
                                    </td>
                                    <td className="p-3">{item.description || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
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
}

export default BrandManager