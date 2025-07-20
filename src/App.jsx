import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import ScrollToTopButton from './components/home/ScrollToTopButton'
import Mobile from './components/category/Mobile'
import ScrollToTop from './components/helper/ScrollToTop'
import Brand from './components/category/Brand'
import Register from './components/login/Register'
import Login from './components/login/Login'
import SearchResults from './components/search/SearchResults'
import Detail from './components/product/Detail'
import User from './components/user/User'
import { ToastContainer } from 'react-toastify'
import Cart from './components/cart/Cart'
import PageLoader from './components/helper/PageLoader'
import InputSdt from './components/login/InputSdt'
import CustomerLayout from './components/layout/CustomerLayout'
function App() {


  return (
    <>
      <PageLoader />
      <ToastContainer position="top-right" autoClose={3000} />

      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restore-password" element={<InputSdt />} />

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="mobile" element={<Mobile />} />
          <Route path="brand" element={<Brand />} />
          <Route path="detail" element={<Detail />} />
          <Route path="profile" element={<User />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
      <ScrollToTopButton />

    </>
  );

}

export default App
