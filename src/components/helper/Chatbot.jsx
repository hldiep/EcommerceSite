import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import { fetchChatAICompare } from "../../api/chat-ai";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion"; // 💫 thêm dòng này

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { type: "bot", text: "Xin chào Anh/Chị! Em là trợ lý AI của cửa hàng 😊" },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetchChatAICompare(userMessage.text); // gửi text
      const botMessage = {
        type: "bot",
        text: res || "Em chưa có câu trả lời ạ.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Xin lỗi, hiện tại không thể kết nối tới AI 😢" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setOpen(true)}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-[10000]"
        >
          <FaRobot size={20} />
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbox"
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              duration: 0.4,
            }}
            className="fixed bottom-5 right-5 w-[400px] h-[500px] bg-white shadow-xl border flex flex-col rounded-t-xl z-[9999]"
          >
            <div className="flex justify-between items-center p-3 bg-blue-600 text-white rounded-t-xl">
              <span className="font-semibold">Trợ lý AI</span>
              <button
                onClick={() => setOpen(false)}
                className="hover:text-gray-300 transition"
              >
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm bg-gray-50">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.type === "bot" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl shadow-sm max-w-[75%] ${
                      msg.type === "bot" ? "bg-blue-100" : "bg-pink-100"
                    }`}
                  >
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="text-gray-500 text-sm italic">
                  Đang xử lý...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 border px-3 py-2 rounded-full text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-blue-600 text-white px-3 py-2 rounded-full hover:bg-blue-700 text-sm"
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

export default Chatbot;
