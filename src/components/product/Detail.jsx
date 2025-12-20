import React, { useEffect, useRef, useState } from 'react'
import { FaHome } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import LoginModal from '../login/LoginModal';
import { fetchProductPublicById } from '../../api/product';
import SpecificationTable from '../helper/SpecificationTable';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import CompareBar from './CompareBar';
import Review from './Review';
import RecentlyViewed from './RecentlyViewed ';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Detail = () => {
    const navigate = useNavigate();
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showCompareBar, setShowCompareBar] = useState(false);
    const [compareItems, setCompareItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const specificationRef = useRef(null);
    const swiperRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('CUSTOMER_user');
        const storedRole = 'CUSTOMER';
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setRole(storedRole);
        } else {
            setUser(null);
            setRole(null);
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
    useEffect(()=>{
        if(!product) return;
        let viewed = JSON.parse(localStorage.getItem("recentViewed")) || [];

        viewed = viewed.filter(item => item.id !== product.id);
        viewed.unshift({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            brand: product.brand,
            price: product.productVariants?.[0]?.priceSale ?? null
        });

        viewed = viewed.slice(0, 10);
        localStorage.setItem("recentViewed", JSON.stringify(viewed));
    }), [product];
    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);
    const currentVariant = selectedVariant || product?.variants?.[0];
    if (!product) return <div className="p-10 text-center text-red-500">Không tìm thấy sản phẩm</div>;
    const handleAddToCart = ({
        user, role, selectedVariant, product, setShowModal
    }) => {
        if (!selectedVariant) {
            toast.info('Vui lòng chọn phiên bản trước khi thêm vào giỏ');
            return;
        }

        //  if (user && role === 'CUSTOMER') {
        toast.success('Thêm vào giỏ thành công');
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        const cartItem = {
            productId: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            variantName: selectedVariant.name,
            productVariantId: selectedVariant.id,
            price: selectedVariant.price,
            oldPrice: selectedVariant.oldPrice || null,
            brand: product.brand?.name,
            quantity: 1,
        };

        const existingIndex = cart.findIndex(
            item => item.productId === cartItem.productId && item.productVariantId === cartItem.productVariantId
        );

        if (existingIndex !== -1) {
            cart[existingIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        // } else {
        //     toast.info('Vui lòng đăng nhập để thêm vào giỏ');
        //     setShowModal(true);
        // }
    };
    const handleScrollToSpecification = () => {
        if (specificationRef.current) {
            const offset = 100;
            const elementPosition = specificationRef.current.getBoundingClientRect().top;
            const offsetPosition = window.pageYOffset + elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };
    //so sánh
    const handleAddToCompare = () => {
        if (!compareItems.some(item => item.id === product.id)) {
            setCompareItems(prev => [...prev, product]);
            setShowCompareBar(true);
        }
    };

    const handleRemove = (id) => {
        const updated = compareItems.filter(item => item.id !== id);
        setCompareItems(updated);
        if (updated.length === 0) setShowCompareBar(false);
    };

    const handleClearAll = () => {
        setCompareItems([]);
        setShowCompareBar(false);
    };
    const handleAdd = (product) => {
        setCompareItems((prev) => [...prev, product]);
    };
    const handleCompare = async () => {
        if (!compareItems.length) return;

        // Chuyển sang trang ProductCompare và truyền compareItems qua state
        navigate('/compare', { state: { products: compareItems } });
    };
    const handleClose = async () => {
        setShowCompareBar(false);
        setCompareItems([]);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-28 mb-10'>
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
                        <div className="ml-4 text-blue-600 font-medium text-lg">Đang tải dữ liệu...</div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center text-sm text-gray-700 mb-4 gap-2">
                            <FaHome className="text-gray-400" />
                            <button onClick={() => navigate('/')}
                                className="text-gray-700">Trang chủ</button>
                            {/* <span className="text-gray-700">/</span>
                    <button onClick={() => navigate('/mobile')}
                        className="text-gray-700">Điện thoại</button> */}
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
                                            <button
                                                key={label}
                                                className="text-sm border px-3 py-1 rounded-full hover:bg-gray-100"
                                                onClick={() => {
                                                    if (label === "So sánh") handleAddToCompare();
                                                    if (label === "Thông số") handleScrollToSpecification();
                                                }}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                    <Swiper
                                        modules={[Navigation, Thumbs]}
                                        navigation
                                        thumbs={{ swiper: thumbsSwiper }}
                                        className="w-full h-[300px] max-w-md rounded-lg"
                                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                                    >

                                        {selectedVariant?.productImages?.length > 0 ? (
                                            selectedVariant.productImages.map((img, i) => (
                                                <SwiperSlide key={i}>
                                                    <img
                                                        src={img.imageUrl}
                                                        alt={img.name}
                                                        className="w-full h-[300px] object-contain rounded-lg"
                                                    />
                                                </SwiperSlide>
                                            ))
                                        ) : (
                                            <SwiperSlide>
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.name}
                                                    className="w-full h-[300px] object-contain rounded-lg"
                                                />
                                            </SwiperSlide>
                                        )}
                                    </Swiper>
                                    {currentVariant?.productImages?.length > 0 && (
                                        <div className="mt-4 max-w-md items-center justify-center">
                                            <Swiper
                                                onSwiper={setThumbsSwiper}
                                                spaceBetween={10}
                                                slidesPerView={10}
                                                watchSlidesProgress
                                                freeMode
                                                modules={[Thumbs]}
                                            >
                                                {currentVariant.productImages.map((img, index) => (
                                                    <SwiperSlide key={index}>
                                                        <img
                                                            src={img.imageUrl}
                                                            alt={img.name}
                                                            onClick={() => {
                                                                swiperRef.current?.slideTo(index);
                                                                setActiveIndex(index);
                                                            }}
                                                            className={`w-10 h-10 object-cover rounded border-2 cursor-pointer transition-transform duration-200 hover:scale-105 ${activeIndex === index ? 'border-red-500' : 'border-transparent'
                                                                }`}
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>
                                        </div>
                                    )}
                                </div>
                                <div className="md:w-1/2 space-y-4">
                                    <div>
                                        <p className="text-gray-600 font-medium mb-2">Giá sản phẩm</p>
                                        {product?.productVariants?.length > 0 ? (
                                            product.productVariants.map((variant, index) => (
                                                <div key={index} className="flex items-center space-x-2 mb-1">
                                                    <p className="text-red-600 text-2xl font-bold">
                                                        {variant.priceSale ? `${variant.priceSale.toLocaleString()}₫` : '—'}
                                                    </p>
                                                    {variant.price && (
                                                        <p className="line-through text-gray-400 text-lg">
                                                            {variant.price.toLocaleString()}₫
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">Không có biến thể sản phẩm</p>
                                        )}
                                    </div>

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
                                    </div>

                                    <div className="flex gap-4 mt-6">
                                        <button
                                            onClick={() => {
                                                if (!selectedVariant) {
                                                    toast.info('Vui lòng chọn phiên bản trước khi mua');
                                                    return;
                                                }

                                                if (user && role === 'CUSTOMER') {
                                                    navigate('/payment-info', {
                                                        state: {
                                                            product: {
                                                                name: product.name,
                                                                imageUrl: product.imageUrl,
                                                                price: selectedVariant.priceSale,
                                                                oldPrice: selectedVariant.price,
                                                                quantity: 1,
                                                                productVariantId: selectedVariant.id,
                                                                variantName: selectedVariant.name,
                                                                brand: product.brand?.name,
                                                            },
                                                        },
                                                    });
                                                } else {
                                                    navigate('/quick-order', {
                                                        state: {
                                                            product: {
                                                                name: product.name,
                                                                imageUrl: product.imageUrl,
                                                                price: selectedVariant.priceSale,
                                                                oldPrice: selectedVariant.price,
                                                                quantity: 1,
                                                                productVariantId: selectedVariant.id,
                                                                variantName: selectedVariant.name,
                                                                brand: product.brand?.name,
                                                            },
                                                        },
                                                    });
                                                }
                                            }}
                                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                                        >
                                            Mua ngay
                                        </button>
                                        <LoginModal show={showModal} onClose={() => setShowModal(false)} />
                                        <button
                                            onClick={() =>
                                                handleAddToCart({
                                                    user,
                                                    role,
                                                    selectedVariant,
                                                    product,
                                                    setShowModal
                                                })
                                            }
                                            className="flex-1 border border-red-600 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-50 transition"
                                        >
                                            Thêm vào giỏ
                                        </button>

                                    </div>
                                </div>

                            </div>
                            <div className="flex flex-col md:flex-row gap-6 mt-5">
                                <div className='w-2/3'>
                                    <div className='mt-10 space-y-4'>
                                        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>

                                        {/* <div
                                        className="prose prose-sm max-w-none text-justify prose-img:rounded-xl prose-img:max-w-full prose-img:h-auto"
                                        dangerouslySetInnerHTML={{ __html: product.description }}
                                        ></div> */}
                                        
                                        <div className="prose prose-sm max-w-none text-justify prose-img:rounded-xl">
                                            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                                                {product.description.replace(/\\n/g, "\n")}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    <div className="mt-10" ref={specificationRef}>
                                        <h2 className="text-xl font-semibold mb-2">Thông số kỹ thuật</h2>
                                        {product?.specifications && Object.keys(product.specifications).length > 0 && (
                                            <SpecificationTable
                                                specifications={
                                                    typeof product.specifications === 'string'
                                                        ? JSON.parse(product.specifications)
                                                        : product.specifications
                                                }
                                            />
                                        )}
                                    </div>
                                    
                                </div>
                                <div className="md:w-1/3 w-full">
                                    <RecentlyViewed />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-2 mt-4">Đánh giá</h2>
                                <Review productId={id} />
                            </div>
                        </div>
                    </div>
                )}
                {showCompareBar && (
                    <CompareBar
                        compareItems={compareItems}
                        onRemove={(id) => setCompareItems(prev => prev.filter(p => p.id !== id))}
                        onClearAll={() => setCompareItems([])}
                        onCompare={handleCompare}
                        onAdd={handleAdd}
                        onClose={handleClose}
                    />
                )}
            </div>
        </div>
    )
}

export default Detail