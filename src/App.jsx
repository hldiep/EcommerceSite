import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import ScrollToTopButton from './components/home/ScrollToTopButton'
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
import InfoPayment from './components/cart/InfoPayment'
import PaymentPage from './components/cart/PaymentPage'
import LoginManager from './components/login/LoginManager'

import Tongquan from './components/dashboard/Tongquan'
import CategoriesManager from './components/manager/CategoriesManager'
import ProductManager from './components/manager/ProductManager'
import BrandManager from './components/manager/BrandManager'
import ProductManagerDetail from './components/manager/ProductManagerDetail'
import DiscountManager from './components/manager/DiscountManager'
import OptionManager from './components/manager/OptionManager'
import SlideManager from './components/manager/SlideManager'
import ProductCompare from './components/product/ProductCompare'
import Category from './components/category/Category'
import VerifyOtp from './components/login/VerifyOtp'
function App() {

  return (
    <>
      <PageLoader />
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 10000 }} />

      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verify-otp" element={<VerifyOtp />} />
        <Route path="/restore-password" element={<InputSdt />} />
        <Route path="/login-manager" element={<LoginManager />} />

        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="category/:categoryId" element={<Category />} />
          <Route path="brand/:brandId" element={<Brand />} />
          <Route path="detail/:id" element={<Detail />} />
          <Route path="/compare" element={<ProductCompare />} />
          <Route path="profile" element={<User />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="cart" element={<Cart />} />
          <Route path="payment-info" element={<InfoPayment />} />
          <Route path="payment-continue" element={<PaymentPage />} />
        </Route>

        <Route path='/tongquan' element={<Tongquan />} />
        <Route path="categories-manager" element={<CategoriesManager />} />
        <Route path="brands-manager" element={<BrandManager />} />
        <Route path="products-manager" element={<ProductManager />} />
        <Route path="products-manager/option" element={<OptionManager />} />
        <Route path="products-manager/slide" element={<SlideManager />} />
        <Route path="products-manager/:id" element={<ProductManagerDetail />} />
        <Route path="discount-manager" element={<DiscountManager />} />
      </Routes>
      <ScrollToTopButton />

    </>
  );

}

export default App
