import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
const LoginModal = ({ show, onClose }) => {

    if (!show) return null;
    const navigate = useNavigate();

    const handleRedirect = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-white rounded-xl shadow-lg p-6 w-[360px] relative"
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        <button onClick={onClose} className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-black">&times;</button>
                        <h2 className="text-2xl font-bold text-center text-red-500 mb-2">ĐĂNG NHẬP</h2>
                        <img src="https://image.plo.vn/w460/Uploaded/2025/yqjvzdjwp/2014_08_01/MPUC20140731161420-logo-xiaomi.jpg.webp" alt="Mascot" className="mx-auto h-20 mb-4" />
                        <p className="text-center text-sm mb-6 text-gray-600">
                            Vui lòng đăng nhập tài khoản để xem ưu đãi và thanh toán dễ dàng hơn. Nếu bạn chưa có tài khoản, đăng ký ngay nhé!
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleRedirect('/register')}
                                className="w-1/2 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                            >
                                Đăng ký
                            </button>
                            <button
                                onClick={() => handleRedirect('/login')}
                                className="w-1/2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;
