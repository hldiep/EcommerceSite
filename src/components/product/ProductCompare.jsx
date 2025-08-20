import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { fetchChatAICompare } from "../../api/chat-ai";

const ProductCompare = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const products = location.state?.products || [];
    console.log("Products to compare:", products);
    const [aiResult, setAiResult] = useState("");
    const [loading, setLoading] = useState(false);
    const [showDetails, setShowDetails] = useState(true);

    const toggleDetails = () => setShowDetails(!showDetails);

    const allKeys = Array.from(
        new Set(products.flatMap((p) => Object.keys(p.specifications || {})))
    );

    useEffect(() => {
        const fetchCompare = async () => {
            if (!products.length) return;

            const query = `So sánh ${products.length} sản phẩm: ${products
                .map((p) => p.name)
                .join(", ")}`;

            try {
                setLoading(true);
                const result = await fetchChatAICompare(query);
                let enhancedResult = result?.data?.message || "";

                if (typeof enhancedResult === "string") {
                    products.forEach((p) => {
                        const link = `/product/${p.id}`;
                        enhancedResult = enhancedResult.replace(
                            new RegExp(p.name, "g"),
                            `${p.name} (xem chi tiết: ${link})`
                        );
                    });
                }

                setAiResult(enhancedResult);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompare();
    }, [products]);

    if (products.length === 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">Chưa có sản phẩm nào để so sánh.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center px-2">
            <div className="container mt-28 mb-10">
                <div className="overflow-x-auto mt-6">
                    <table className="table-fixed w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-t border-b bg-gray-50">
                                <th className="p-4 text-left align-top w-64">
                                    <h2 className="text-xl font-semibold mb-4">So sánh sản phẩm</h2>
                                    <div className="space-y-2 mb-4">
                                        {products.map((item, index) => (
                                            <div key={index} className="font-bold">
                                                {item.name}
                                                {index < products.length - 1 && (
                                                    <span className="text-gray-600"> & </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </th>
                                {products.map((product, index) => {
                                    const variant = product.productVariants?.[0] || {};
                                    return (
                                        <th
                                            key={index} onClick={() => navigate(`/detail/${product.id}`)}
                                            className="p-4 text-center align-top border-l w-64"
                                        >
                                            <img
                                                src={variant.imageUrl || product.imageUrl}
                                                alt={product.name}
                                                className="h-32 object-contain mx-auto mb-2"
                                            />
                                            <h3 className="font-bold text-lg">{product.name}</h3>
                                            <p className="text-sm text-gray-500">
                                                {product.brand?.name || product.brand}
                                            </p>
                                            <div className="mt-2">
                                                {variant.priceSale ? (
                                                    <>
                                                        <span className="text-blue-600 font-semibold mr-2">
                                                            {variant.priceSale.toLocaleString()}₫
                                                        </span>
                                                        <span className="line-through text-gray-400">
                                                            {variant.price.toLocaleString()}₫
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-blue-600 font-semibold">
                                                        {variant.price?.toLocaleString()}₫
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    );
                                })}

                            </tr>
                        </thead>
                    </table>
                </div>

                <div className="border rounded-md shadow-sm bg-white mt-10">
                    <div
                        className="flex items-center justify-between px-4 py-2 border-b cursor-pointer"
                        onClick={toggleDetails}
                    >
                        <div className="flex items-center gap-2 font-semibold text-lg">
                            <span
                                className={`transition-transform duration-300 ${showDetails ? "rotate-90" : ""
                                    }`}
                            >
                                ▶
                            </span>
                            <span>SO SÁNH NHANH</span>
                        </div>
                    </div>

                    {showDetails && (
                        <div className="overflow-x-auto">
                            <table className="table-fixed w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-t border-b bg-gray-100">
                                        <th className="p-3 text-left w-64">Tiêu chí</th>
                                        {products.map((p, idx) => (
                                            <th key={idx} className="p-3 text-left border-l w-64">
                                                {p.name}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {allKeys.map((key) => (
                                        <tr key={key} className="border-t">
                                            <td className="p-3 font-medium">{key}</td>
                                            {products.map((p, idx) => (
                                                <td key={idx} className="p-3 border-l">
                                                    {typeof p.specifications[key] === "object"
                                                        ? JSON.stringify(p.specifications[key])
                                                        : p.specifications[key] || "-"}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                    {loading && (
                                        <tr>
                                            <td
                                                colSpan={products.length + 1}
                                                className="p-3 text-center text-blue-600"
                                            >
                                                Đang tải dữ liệu AI...
                                            </td>
                                        </tr>
                                    )}

                                    {!loading && aiResult && (
                                        <tr>
                                            <td
                                                colSpan={products.length + 1}
                                                className="p-3 text-left text-green-600 whitespace-pre-wrap"
                                            >
                                                {aiResult}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCompare;
