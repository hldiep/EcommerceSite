import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Soup, ShoppingCart, Laptop, Cpu } from 'lucide-react';
const ProductResponse = () => {
    const products = [
        {
            type: 'laptop',
            name: 'Laptop Gaming Pro X1',
            specs: 'CPU: i7-13700H, RAM: 16GB, SSD: 1TB, VGA: RTX 4060',
            price: '35.000.000đ',
            img: 'https://via.placeholder.com/150?text=Gaming+Laptop',
        },
        {
            type: 'laptop',
            name: 'Laptop Văn Phòng Ultra',
            specs: 'CPU: i5-13500U, RAM: 16GB, SSD: 512GB, Màn hình: 2K',
            price: '22.000.000đ',
            img: 'https://via.placeholder.com/150?text=Office+Laptop',
        },
        {
            type: 'phone',
            name: 'Smartphone S25 Ultra',
            specs: 'Chip: Snap 9 Gen 3, RAM: 12GB, Camera: 200MP',
            price: '28.990.000đ',
            img: 'https://via.placeholder.com/150?text=S25+Ultra',
        },
        {
            type: 'phone',
            name: 'Smartphone Mid-Range Z',
            specs: 'Chip: Dimensity 8300, RAM: 8GB, Pin: 5000mAh',
            price: '9.500.000đ',
            img: 'https://via.placeholder.com/150?text=Mid-Range+Phone',
        },
    ];
    return (
        <div className='w-full'>
            <h4 className="font-bold text-lg mb-3">Gợi ý sản phẩm phù hợp:</h4>
      
            <div className="space-y-4">
                {products.map((product) => (
                <div key={product.name} className="flex items-start space-x-3 border rounded-lg p-3 shadow-sm bg-white">
                    <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                    <p className="font-bold text-base text-blue-700">{product.name}</p>
                    <div className="flex items-center space-x-1 text-gray-600 mt-1">
                        <Cpu size={14} />
                        <p className="text-xs">{product.specs}</p>
                    </div>
                    <p className="text-red-600 font-bold text-lg mt-2">{product.price}</p>
                    </div>
                </div>
                ))}
            </div>
            
            <button className="flex items-center justify-center space-x-2 w-full bg-green-600 text-white p-2 rounded-lg mt-4 hover:bg-green-700">
                <ShoppingCart size={18} />
                <span>Xem tất cả sản phẩm</span>
            </button>
        </div>
    )
}
const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState([
        {
        id: 1,
        sender: 'bot',
        content: 'Chào bạn! Tôi là AI tư vấn điện tử. Bạn cần tìm điện thoại, máy tính hay phụ kiện gì?',
        },
    ]);
    
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        const newMsg = inputValue.trim();
        if (!newMsg) return;

        const newUserMessage = { id: Date.now(), sender: 'user', content: newMsg };
        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue('');

        setTimeout(() => {
        let botResponse;

        // Đây là logic mô phỏng mới
        if (newMsg.toLowerCase().includes('laptop gaming')) {
            botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            content: <ProductResponse />, 
            };
        } else {
            botResponse = {
            id: Date.now() + 1,
            sender: 'bot',
            content: 'Xin lỗi, tôi chưa có thông tin về sản phẩm này. Bạn thử hỏi "laptop gaming" nhé!',
            };
        }
        
        setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <>
        <div className="min-h-screen bg-gray-50 flex justify-center">
            <div className='container mt-28 mb-10'>
 
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
                    aria-label="Mở chatbot"
                >
                    {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                </button>

                {isOpen && (
                    <div className="fixed bottom-20 right-5 w-full max-w-md h-[70vh] bg-white rounded-lg shadow-xl flex flex-col z-40">
                    
                    <header className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                        <Laptop size={20} />
                        <h3 className="font-bold">AI Tư vấn Điện tử</h3>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:opacity-75">
                        <X size={20} />
                        </button>
                    </header>

                    <main className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
                        {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                            className={`max-w-[85%] p-3 rounded-xl ${
                                msg.sender === 'user'
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-transparent text-gray-800' 
                            }`}
                            >
                            {/* Nội dung có thể là text hoặc component JSX */}
                            {typeof msg.content === 'string' ? (
                                // Nếu là tin nhắn text (như lời chào)
                                <p className={`text-sm p-3 rounded-xl ${msg.sender === 'bot' ? 'bg-gray-200 rounded-bl-none' : ''}`}>
                                {msg.content}
                                </p>
                            ) : (
                                msg.content
                            )}
                            </div>
                        </div>
                        ))}
                        <div ref={chatEndRef} />
                    </main>

                    <footer className="border-t p-3 bg-white rounded-b-lg">
                        <form onSubmit={handleSend} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Bạn tìm sản phẩm gì..."
                            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                            disabled={!inputValue.trim()}
                        >
                            <Send size={18} />
                        </button>
                        </form>
                    </footer>
                    </div>
                )}
                </div>
            </div>
        </>
    );
};

export default Chatbot;