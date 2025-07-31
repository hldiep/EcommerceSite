import React, { useEffect, useRef, useState } from 'react';
import { FaSearch, FaShoppingCart, FaThLarge, FaUser } from 'react-icons/fa';
import LoginModal from '../login/LoginModal';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Categories from './Categories';

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);
    const [showCategories, setShowCategories] = useState(false);
    const navigate = useNavigate();
    const categoryRef = useRef(null);
    const categoriesAreaRef = useRef(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Đóng menu nếu click ra ngoài cả khu vực
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                categoriesAreaRef.current &&
                !categoriesAreaRef.current.contains(e.target)
            ) {
                setShowCategories(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
        if (confirmed) {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            toast.info('Bạn đã đăng xuất tài khoản');
            navigate('/');
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3">
            <div className="container mx-auto flex items-center justify-between gap-3 flex-wrap">
                {/* Logo */}
                <div className="text-2xl font-bold flex items-center transition duration-200 hover:scale-95">
                    <Link to="/" className="mr-1">Logo</Link>
                </div>

                {/* Danh mục */}
                <div className="relative" ref={categoriesAreaRef} onMouseLeave={() => setShowCategories(false)}>
                    <button
                        className="bg-red-400 hover:bg-red-600 px-3 py-2 rounded-md flex items-center gap-2 text-white"
                        onMouseEnter={() => setShowCategories(true)}
                    >
                        <FaThLarge />
                        <span>Danh mục</span>
                    </button>

                    {showCategories && (
                        <div className="absolute left-0 top-full z-50" onMouseEnter={() => setShowCategories(true)}>
                            <Categories />
                        </div>
                    )}
                </div>

                {/* Thanh tìm kiếm */}
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

                {/* Giỏ hàng */}
                <button
                    onClick={() => {
                        if (user) {
                            navigate('/cart');
                        } else {
                            toast.info('Vui lòng đăng nhập để xem giỏ hàng');
                            setShowModal(true);
                        }
                    }}
                    className="relative flex items-center cursor-pointer hover:opacity-90 hover:bg-red-600 px-3 py-2 rounded-md"
                >
                    <FaShoppingCart className="text-xl" />
                    <span className="ml-1">Giỏ hàng</span>
                </button>

                {/* Người dùng */}
                {user ? (
                    <div className="flex items-center gap-3">
                        <Link to='/profile' className='flex items-center gap-2'>
                            <div className="bg-white text-red-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <span className="text-sm font-semibold">{user?.fullName || 'User'}</span>
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
