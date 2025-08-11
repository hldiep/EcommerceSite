import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaCompress, FaExpand, FaRobot, FaTimes, FaWindowMaximize } from 'react-icons/fa';
import { fetchChatAICompare } from '../../api/chat-ai';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const ChatBotBox = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Xin chào Anh/Chị! Em là trợ lý AI của cửa hàng.' },
        { type: 'bot', text: 'Em rất sẵn lòng hỗ trợ Anh/Chị 😊' }
    ]);

    const [sizeMode, setSizeMode] = useState('small');
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (open) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open]);

    const handleSend = async () => {
        if (input.trim() === '') return;

        const userMessage = input;
        setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetchChatAICompare(userMessage);
            console.log("Dữ liệu API trả về:", res.message);
            console.log("Dữ liệu API trả về:", res.dataJson);

            if (res?.message) {
                setMessages(prev => [...prev, { type: 'bot', text: res.message }]);
            }

            if (Array.isArray(res?.dataJson)) {
                setMessages(prev => [...prev, { type: 'bot', products: res.dataJson }]);
            } else if (typeof res?.dataJson === 'string') {
                setMessages(prev => [...prev, { type: 'bot', text: res.dataJson }]);
            } else {
                setMessages(prev => [...prev, { type: 'bot', text: 'Em chưa có câu trả lời.' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { type: 'bot', text: 'Xin lỗi, hiện tại không thể kết nối tới AI.' }]);
        } finally {
            setLoading(false);
        }
    };

    const toggleSizeMode = () => {
        if (sizeMode === 'small') setSizeMode('large');
        else if (sizeMode === 'large') setSizeMode('fullscreen');
        else setSizeMode('small');
    };

    const getChatBoxClass = () => {
        switch (sizeMode) {
            case 'small':
                return 'w-[500px] h-[450px] rounded-xl';
            case 'large':
                return 'w-[80vw] h-[80vh] rounded-xl';
            case 'fullscreen':
                return 'w-screen h-screen rounded-none';
            default:
                return 'w-[500px] h-[450px] rounded-xl';
        }
    };

    const renderMessage = (msg) => (
        <div className="flex flex-col gap-3">
            {msg.text && (
                <div className="text-sm whitespace-pre-line">
                    <ReactMarkdown
                        components={{
                            a: ({ node, ...props }) => (
                                <a
                                    {...props}
                                    className="text-blue-600 underline hover:text-blue-800"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                />
                            ),
                        }}
                    >
                        {msg.text}
                    </ReactMarkdown>

                </div>
            )}

            {Array.isArray(msg.products) && (
                msg.products.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {msg.products.map((p, idx) => (
                            <div
                                key={idx}
                                className="border rounded-lg p-3 bg-white shadow-sm w-full text-xs flex gap-3"
                            >
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="w-20 h-20 object-contain rounded"
                                />

                                <div className="flex flex-col flex-1">
                                    <h3 className="font-semibold mb-1 text-sm">{p.name}</h3>
                                    <p className="text-gray-500 text-[11px] mb-2 leading-snug line-clamp-3">
                                        {p.description}
                                    </p>

                                    <p className="text-red-600 font-bold text-sm mb-2">
                                        {p.priceSale.toLocaleString()} đ
                                    </p>

                                    <button
                                        className="mt-auto w-full bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                                        onClick={() => {
                                            setOpen(false);
                                            navigate(`/detail/${p.id}`);
                                        }}
                                    >
                                        Xem
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic">Vui lòng nhập thông tin lại nhé!!!</p>
                )
            )}
        </div>
    );

    return (
        <>
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="fixed bottom-24 right-6 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
                    aria-label="Mở chat trợ lý AI"
                    tabIndex={0}
                >
                    <FaRobot size={20} />
                </button>
            )}

            <AnimatePresence>
                {open && (
                    <motion.div
                        key="chatbox"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className={`${getChatBoxClass()} bg-white shadow-xl border flex flex-col overflow-hidden fixed bottom-0 right-0 z-[9999]`}
                    >
                        <div className="flex justify-between items-center p-4 bg-gray-600 text-white rounded-t-xl">
                            <div className="font-semibold">Trợ lý AI</div>
                            <div className="flex justify-end items-center space-x-4">
                                <button
                                    onClick={toggleSizeMode}
                                    className="p-1 rounded text-center hover:bg-gray-700"
                                    title={
                                        sizeMode === 'small'
                                            ? 'Phóng to'
                                            : sizeMode === 'large'
                                                ? 'Toàn màn hình'
                                                : 'Thu nhỏ'
                                    }
                                    aria-label="Thay đổi kích thước chatbox"
                                    tabIndex={0}
                                >
                                    {sizeMode === 'small' && <FaExpand size={16} />}
                                    {sizeMode === 'large' && <FaWindowMaximize size={16} />}
                                    {sizeMode === 'fullscreen' && <FaCompress size={16} />}
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded hover:bg-gray-700"
                                    title="Đóng"
                                    aria-label="Đóng chat trợ lý AI"
                                    tabIndex={0}
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                            {messages.map((msg, idx) => {
                                const isBot = msg.type === 'bot';
                                return (
                                    <div
                                        key={idx}
                                        className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[75%] px-4 py-2 rounded-2xl shadow ${isBot
                                                ? 'bg-blue-100 text-black rounded-bl-none'
                                                : 'bg-pink-100 text-black rounded-br-none'
                                                }`}
                                        >
                                            {renderMessage(msg)}
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-blue-100 text-gray-500 px-4 py-2 rounded-2xl rounded-bl-none shadow">
                                        Đang xử lý...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 border-t flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 border border-gray-300 px-3 py-2 rounded-full text-sm focus:outline-none focus:ring focus:border-blue-300"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading}
                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                                Gửi
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBotBox;
