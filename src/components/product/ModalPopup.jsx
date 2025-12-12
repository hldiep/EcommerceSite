import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ModalAICompare({
    open,
    onClose,
    loading,
    compareQuery,
    setCompareQuery,
    aiResult,
    onAnalyze,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

            <div
                className="
                    bg-white 
                    rounded-2xl 
                    shadow-2xl 
                    w-[1100px]
                    h-[580px]
                    p-6
                    overflow-y-auto
                    animate-fadeIn
                "
            >

                <h2 className="text-xl font-semibold mb-4">
                    AI giúp bạn chọn sản phẩm tốt hơn
                </h2>

                <div className="flex items-center gap-2 mt-2 mb-4">
                    <input
                        value={compareQuery}
                        onChange={(e) => setCompareQuery(e.target.value)}
                        placeholder="Nhập yêu cầu cần AI phân tích…"
                        className="
                            border border-gray-300 
                            px-3 py-2 
                            rounded-lg 
                            w-[420px] 
                            outline-none text-sm
                        "
                    />

                    <button
                        disabled={loading}
                        onClick={onAnalyze}
                        className="
                            px-4 py-2 
                            bg-red-500 hover:bg-red-600 
                            text-white 
                            rounded-lg text-sm
                        "
                    >
                        Phân tích ngay
                    </button>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                        Đang xử lý yêu cầu...
                    </div>
                )}

                {aiResult && (
                    <div className="prose max-w-none prose-slate mt-4">
                        <div
                            className="
                                border border-gray-300 
                                rounded-xl 
                                p-4 
                                bg-white 
                                shadow-sm
                                max-h-[380px]
                                overflow-y-auto
                            "
                        >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {aiResult}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="
                            px-4 py-2 
                            rounded-xl 
                            bg-gray-200 
                            hover:bg-gray-300 
                            transition
                        "
                    >
                        Đóng
                    </button>
                </div>

            </div>
        </div>
    );
}
