import React, { useEffect, useState } from "react";
import { FaHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { fetchProductByCategory } from "../../api/product";

const BanPhim = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProductByCategory(28, 0, 10, "id", "asc");
        setProducts(data.data);
      } catch (err) {
        setError("Lỗi tải sản phẩm");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  if (loading)
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-r-transparent"></div>
        <div className="ml-4 text-blue-600 font-medium text-lg">
          Đang tải dữ liệu...
        </div>
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="px-4 mt-10">
      <button
        onClick={() => navigate("/category/28")}
        className="text-2xl font-bold mb-4"
      >
        BÀN PHÍM CHẤT LƯỢNG
      </button>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => {
          const variant = product.productVariants?.[0] || {};
          const discount = variant.price
            ? Math.round(
                ((variant.price - variant.priceSale) / variant.price) * 100
              )
            : 0;

          return (
            <div
              key={product.id}
              onClick={() => navigate(`/detail/${product.id}`)}
              className="bg-white rounded-xl shadow-lg transition p-3 relative group cursor-pointer"
            >
              <div className="absolute top-0 left-0 bg-red-600 text-white text-xs px-2 py-1 rounded-xl">
                Giảm {discount}%
              </div>

              <img
                src={variant.imageUrl || product.imageUrl}
                alt={product.name}
                className="w-full h-[240px] object-contain mb-2 transition-transform duration-300 group-hover:scale-[1.015]"
              />

              <h3 className="text-sm font-medium mb-1 h-[40px] line-clamp-2">
                {product.name}
              </h3>

              <div className="text-red-600 font-bold text-lg">
                {variant.priceSale.toLocaleString()}đ
              </div>
              <div className="text-gray-400 text-sm line-through">
                {variant.price.toLocaleString()}đ
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar className="text-xs" /> 4.9
                </div>
                <div className="text-red-500 flex items-center gap-1">
                  <FaHeart className="text-xs" /> Yêu thích
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BanPhim;
