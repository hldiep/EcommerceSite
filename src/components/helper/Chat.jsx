import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';

const SimpleChatWindow = () => {
  const initialMessages = [
    { sender: 'bot', text: 'Chào bạn! Tôi có thể giúp bạn tìm kiếm thông tin hoặc hỗ trợ sản phẩm.' },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // API configuration
  const API_URL = 'YOUR_API_URL_HERE'; // Thay thế bằng URL API của bạn

  // Fetch AI response from API
  const fetchChatAICompare = async (text) => {
    try {
      const queryParam = encodeURIComponent(text);
      const response = await fetch(`${API_URL}-2?query=${queryParam}`, {
        method: "GET",
        headers: {
          Accept: "*/*",
        },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const json = await response.json();
      console.log("AI compare response:", json);
      return json.data;
    } catch (error) {
      console.error("Error fetching AI compare:", error);
      throw error;
    }
  };

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const userMessage = { sender: 'user', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Simulate bot response after 1 second
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: generateBotResponse(inputMessage)
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userText) => {
    const responses = [
      'Cảm ơn bạn đã liên hệ! Tôi đang xử lý yêu cầu của bạn.',
      'Để tôi kiểm tra thông tin cho bạn nhé.',
      'Tôi hiểu rồi. Bạn có cần thêm thông tin gì không?',
      'Đây là một câu hỏi hay! Hãy để tôi tìm hiểu thêm.',
      'Tôi luôn sẵn sàng hỗ trợ bạn!'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white rounded-t-lg p-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <h3 className="font-semibold">Chatbot Hỗ Trợ</h3>
        </div>
        <button
          onClick={toggleMinimize}
          className="hover:bg-indigo-700 rounded-full p-1 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Message Area */}
      {!isMinimized && (
        <>
          <div className="h-[400px] overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="flex p-3 border-t border-gray-200 bg-white rounded-b-lg">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
            />
            <button
              onClick={handleSend}
              className="bg-indigo-600 text-white rounded-full p-2 ml-2 hover:bg-indigo-700 transition-colors flex items-center justify-center"
            >
              <Send size={24} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleChatWindow;