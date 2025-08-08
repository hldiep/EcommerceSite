import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';

const ChatBotBox = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { type: 'bot', text: 'Xin chào Anh/Chị! Em là trợ lý AI của cửa hàng.' },
        { type: 'bot', text: 'Em rất sẵn lòng hỗ trợ Anh/Chị 😊' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    // Auto scroll khi có tin nhắn mới
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Scroll khi mở khung chat
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [open]);

    const handleSend = () => {
        if (input.trim() === '') return;

        // Gửi tin nhắn người dùng
        setMessages(prev => [...prev, { type: 'user', text: input }]);
        setInput('');

        // Giả lập phản hồi từ bot
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text: 'Cảm ơn bạn đã gửi tin nhắn. Em sẽ hỗ trợ ngay!' }]);
        }, 1000);
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-24 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none"
            >
                <FaRobot size={20} />
            </button>

            <div className="fixed bottom-24 right-6 z-50">
                <AnimatePresence>
                    {open && (
                        <motion.div
                            key="chatbox"
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 50, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="w-80 h-[400px] bg-white shadow-xl rounded-xl border flex flex-col overflow-hidden"
                        >
                            <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-xl">
                                <div className="font-semibold">Trợ lý AI</div>
                                <button onClick={() => setOpen(false)}>
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`break-words whitespace-pre-wrap max-w-full px-3 py-2 rounded-lg ${msg.type === 'bot'
                                            ? 'bg-gray-100 text-black self-start'
                                            : 'bg-yellow-300 text-black self-end ml-auto'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))}
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
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                >
                                    Gửi
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
};

export default ChatBotBox;
