import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProductById } from '../../api/product';
import ClippedDrawer from '../dashboard/DashboardLayoutBasic';
import SpecificationTable from '../helper/SpecificationTable';

const ProductManagerDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(true);
        const loadProduct = async () => {
            try {
                const data = await fetchProductById(id);
                setProduct(data);
            } catch (error) {
                console.error('Lỗi khi load chi tiết sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    return (
        <ClippedDrawer>
            <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50 min-h-[calc(100vh-80px)]">
                <div className="sticky top-16 z-10 bg-white border-b shadow-sm">
                    <div className="flex items-center text-sm text-gray-600 space-x-2 px-4 pt-2">
                        <button onClick={() => navigate('/tongquan')} className="hover:underline text-blue-600">
                            Dashboard
                        </button>
                        <span>/</span>
                        <button onClick={() => navigate('/products-manager')} className="hover:underline text-blue-600">Quản lý sản phẩm</button>
                        <span>/</span>
                        <span className="text-gray-700 font-medium">Quản lý sản phẩm</span>
                    </div>
                    {!loading && product && (
                        <h2 className="text-xl font-semibold p-4">{product.name}</h2>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <div className="p-6 max-w-4xl mx-auto space-y-4">
                        <button
                            onClick={() => navigate(-1)}
                            className=" px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            ← Quay lại
                        </button>
                        <img src={product.imageUrl} alt={product.name} className="w-64" />

                        <div className=" p-4 rounded">
                            <p><strong>Thương hiệu:</strong> {product.brand?.name}</p>
                            <p><strong>Người tạo:</strong> {product.createdBy?.fullName}</p>
                            <p><strong>Ngày tạo:</strong> {new Date(product.createdAt).toLocaleString()}</p>
                            <p><strong>Thông số:</strong></p>
                            <SpecificationTable specString={product.specifications.value} />
                        </div>
                        <h2 className="text-xl font-semibold mt-6">Biến thể</h2>
                        {product.productVariants?.length ? (
                            <table className="w-full table-auto border text-sm mt-2">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-2 py-1 text-left">Tên</th>
                                        <th className="px-2 py-1 text-left">Giá</th>
                                        <th className="px-2 py-1 text-left">Giảm giá</th>
                                        <th className="px-2 py-1 text-left">Ảnh</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {product.productVariants.map((variant) => (
                                        <tr key={variant.id} className="border-t hover:bg-gray-50">
                                            <td className="px-2 py-1">{variant.name}</td>
                                            <td className="px-2 py-1 text-red-600">
                                                {variant.price?.toLocaleString()}₫
                                            </td>
                                            <td className="px-2 py-1 text-red-500">
                                                {variant.priceSale?.toLocaleString()}₫
                                            </td>
                                            <td className="px-2 py-1">
                                                {variant.imageUrl ? (
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                                        {variant.productImages.map((image) => (
                                                            <img
                                                                key={image.id}
                                                                src={image.imageUrl}
                                                                alt={image.name}
                                                                className="w-full object-cover rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
                                                            />
                                                        ))}
                                                    </div>
                                                ) : (
                                                    '-'
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="italic text-gray-500">Không có biến thể.</p>
                        )}
                    </div>)}
            </div>
        </ClippedDrawer>
    )
}

export default ProductManagerDetail