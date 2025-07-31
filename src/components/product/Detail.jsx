import React, { useEffect, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoginModal from '../login/LoginModal';
import { fetchProductPublicById } from '../../api/product';
import SpecificationTable from '../helper/SpecificationTable';

const Detail = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await fetchProductPublicById(id);
                setProduct(data);
                setSelectedVariant(data?.variants?.[0] || null);
            } catch (error) {
                console.error('Lỗi khi load chi tiết sản phẩm:', error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [id]);
    if (loading) return <div className="p-10 text-center">Đang tải sản phẩm...</div>;
    if (!product) return <div className="p-10 text-center text-red-500">Không tìm thấy sản phẩm</div>;
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-20 mb-10'>
                <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                    <FaHome className="text-gray-400" />
                    <button onClick={() => navigate('/')}
                        className="text-gray-700">Trang chủ</button>
                    <span className="text-gray-700">/</span>
                    <button onClick={() => navigate('/mobile')}
                        className="text-gray-700">Điện thoại</button>
                    <span className="text-gray-700">/</span>
                    <button
                        onClick={() => navigate(`/brand/${product.brand?.id}`)}
                        className="text-gray-700"
                    >
                        {product.brand?.name}
                    </button>
                    <span className="text-gray-700">/</span>
                    <span className="font-medium">{product.name}</span>
                </div>
                <div className="max-w-6xl mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
                    <div className="flex flex-col md:flex-row gap-6">

                        <div className="md:w-1/2 ">
                            <div className="flex gap-2 mb-4">
                                {["Yêu thích", "Thông số", "So sánh"].map(label => (
                                    <button key={label} className="text-sm border px-3 py-1 rounded-full hover:bg-gray-100">
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <img
                                src={selectedImage || product.imageUrl}
                                alt={product.name}
                                className="w-full h-[300px] max-w-md object-contain rounded-lg"
                            />
                            {selectedVariant?.productImages?.length > 0 && (
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {selectedVariant.productImages.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.imageUrl}
                                            alt={image.name}
                                            onClick={() => setSelectedImage(image.imageUrl)}
                                            className={`w-20 h-20 object-cover rounded border cursor-pointer transition-transform duration-200 hover:scale-105 ${selectedImage === image.imageUrl ? 'ring-2 ring-red-500' : ''
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="md:w-1/2 space-y-4">
                            {/* Giá sản phẩm */}
                            <div>
                                <p className="text-gray-600 font-medium mb-2">Giá sản phẩm</p>
                                {product?.productVariants?.length > 0 ? (
                                    product.productVariants.map((variant, index) => (
                                        <div key={index} className="flex items-center space-x-2 mb-1">
                                            <p className="text-red-600 text-2xl font-bold">
                                                {variant.price ? `${variant.price.toLocaleString()}₫` : '—'}
                                            </p>
                                            {variant.priceSale && (
                                                <p className="line-through text-gray-400 text-lg">
                                                    {variant.priceSale.toLocaleString()}₫
                                                </p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Không có biến thể sản phẩm</p>
                                )}
                            </div>

                            {/* Phiên bản */}
                            <div>
                                <p className="font-semibold">Thương hiệu: {product.brand?.name}</p>
                                <p className='text-gray-500 mb-5'> {product.brand?.description}</p>
                                <p className="font-semibold">Phiên bản</p>
                                <div className="flex gap-2 mt-2">
                                    {product?.productVariants?.map((variant) => {
                                        const isSelected = selectedVariant?.name === variant.name;
                                        return (
                                            <button
                                                key={variant.name}
                                                className={`px-3 py-1 border rounded-full transition ${isSelected ? "bg-red-600 text-white" : "bg-white text-gray-700"
                                                    }`}
                                                onClick={() =>
                                                    setSelectedVariant(isSelected ? null : variant)
                                                }
                                            >
                                                {variant.name}
                                            </button>
                                        );
                                    })}
                                </div>
                                {/* <p>{product?.productVariants?.description}</p> */}
                            </div>

                            <div className="flex gap-4 mt-6">
                                <button onClick={() => {
                                    if (user) {
                                        navigate('/payment');
                                    } else {
                                        toast.info('Vui lòng đăng nhập để mua sản phẩm');
                                        setShowModal(true);
                                    }
                                }}
                                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition">
                                    Mua ngay
                                </button>
                                <LoginModal show={showModal} onClose={() => setShowModal(false)} />
                                <button onClick={() => {
                                    if (user) {
                                        toast.success('Thêm vào giỏ thành công')
                                    } else {
                                        toast.info('Vui lòng đăng nhập để thêm vào giỏ');
                                        setShowModal(true);
                                    }
                                }}
                                    className="flex-1 border border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition">
                                    Thêm vào giỏ
                                </button>
                            </div>
                        </div>

                    </div>
                    <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-2">Thông số kỹ thuật</h2>
                        {product?.specifications?.value && (
                            <SpecificationTable specString={product.specifications.value} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Detail