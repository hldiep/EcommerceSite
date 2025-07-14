import React, { useEffect, useState } from 'react'
import { FaSearch, FaShoppingCart, FaThLarge, FaUser } from 'react-icons/fa'
import LoginModal from '../login/LoginModal';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-3 flex-wrap">
                <div className="text-2xl font-bold flex items-center transition duration-200 hover:scale-95">
                    <Link to="/" className="mr-1">Logo</Link>
                </div>

                <button className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md flex items-center gap-2">
                    <FaThLarge />
                    <span>Danh mục</span>
                </button>

                <div className="flex-1 max-w-lg">
                    <div className="flex items-center bg-white rounded-md px-3 py-2">
                        <FaSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Bạn muốn mua gì?"
                            className="ml-2 w-full outline-none text-black placeholder-gray-400"
                        />
                    </div>
                </div>

                <div className="relative flex items-center cursor-pointer hover:opacity-90 hover:bg-red-600 px-3 py-2 rounded-md">
                    <FaShoppingCart className="text-xl" />
                    <span className="ml-1">Giỏ hàng</span>
                </div>

                {user ? (
                    <div className="flex items-center gap-3">
                        <Link to='/profile' className='flex items-center gap-2'>
                            <div className="bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                {user.name.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold">{user.name}</span>
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md text-sm"
                        >
                            Đăng xuất
                        </button>
                    </div>
                ) : (
                    <>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md flex items-center gap-2"
                        >
                            <FaUser />
                            <span>Đăng nhập</span>
                        </button>
                        <LoginModal show={showModal} onClose={() => setShowModal(false)} />
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;
