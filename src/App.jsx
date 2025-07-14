import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import Header from './components/home/Header'
import ScrollToTopButton from './components/home/ScrollToTopButton'
import Footer from './components/home/Footer'
import Mobile from './components/category/Mobile'
import ScrollToTop from './components/helper/ScrollToTop'
import Brand from './components/category/Brand'
import Register from './components/login/Register'
import Login from './components/login/Login'
import SearchResults from './components/search/SearchResults'
import Detail from './components/product/Detail'
import User from './components/user/User'
import { ToastContainer } from 'react-toastify'
function App() {
  const location = useLocation();
  const hideLayout = location.pathname === '/login' || location.pathname === '/register';

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      {!hideLayout && <Header />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mobile" element={<Mobile />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<User />} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
      <ScrollToTopButton />
      {!hideLayout && <Footer />}
    </>
  );

}

export default App
