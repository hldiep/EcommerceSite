import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import Brand from './components/category/Brand'
import Register from './components/login/Register'
import Login from './components/login/Login'
import SearchResults from './components/search/SearchResults'
import Detail from './components/product/Detail'
import User from './components/user/User'
import { ToastContainer } from 'react-toastify'
import Cart from './components/cart/Cart'
import PageLoader from './components/helper/PageLoader'
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
import PaymentSuccess from './components/cart/PaymentSuccess'
import OrderManager from './components/manager/OrderManager'
import OrderManagerDetailPage from './components/manager/OrderManagerDetailPage'
import CreditCardPayment from './components/cart/CreditCardPayment'
import EmployeeManager from './components/manager/EmployeeManager'
import RevenueManager from './components/manager/RevenueManager'
import ProductManagerAdd from './components/manager/ProductManagerAdd'
import CustomerManager from './components/manager/CustomerManager'
import ProductManagerAddVariant from './components/manager/ProductManagerAddVariant'
import InputEmail from './components/login/InputEmail'
import XacMinhEmail from './components/login/XacMinhEmail'
import NewPass from './components/login/NewPass'
import QuickOrder from './components/product/QuickOrder'
import ThanhToan from './components/product/ThanhToan'
import VerifyOtp2 from './components/product/VerifyOtp2'
import ConfirmOrder from './components/product/ConfirmOrder'
import ProductManagerEdit from './components/manager/ProductEdit'
import ProductManagerEditVariant from './components/manager/ProductManagerEditVariant'
function App() {

  return (
    <>
      <PageLoader />
      <ToastContainer position="top-right" autoClose={3000} style={{ zIndex: 10000 }} />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/verify-otp" element={<VerifyOtp />} />
        <Route path="/restore-password" element={<InputEmail />} />
        <Route path="/restore-password/otp" element={<XacMinhEmail />} />
        <Route path="/restore-password/otp/newpass" element={<NewPass />} />
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
          <Route path="quick-order" element={<QuickOrder />} />
          <Route path="quick-order/verify-otp" element={<VerifyOtp2 />} />
          <Route path="checkout/confirm" element={<ConfirmOrder />} />
          <Route path="quick-order/continue" element={<ThanhToan />} />
          <Route path="payment-info" element={<InfoPayment />} />
          <Route path="payment-continue" element={<PaymentPage />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="credit-card-payment" element={<CreditCardPayment />} />
        </Route>

        <Route path='/tongquan' element={<Tongquan />} />
        <Route path="categories-manager" element={<CategoriesManager />} />
        <Route path="brands-manager" element={<BrandManager />} />
        <Route path="products-manager" element={<ProductManager />} />
        <Route path="products-manager/option" element={<OptionManager />} />
        <Route path="products-manager/slide" element={<SlideManager />} />
        <Route path="products-manager/:id" element={<ProductManagerDetail />} />
        <Route path="products-manager/edit/:id" element={<ProductManagerEdit />} />
        <Route path="products-manager/add" element={<ProductManagerAdd />} />
        <Route path="products-manager/add/variant/:id" element={<ProductManagerAddVariant />} />
        <Route path="products-manager/edit/variant/:id" element={<ProductManagerEditVariant />} />
        <Route path="discount-manager" element={<DiscountManager />} />
        <Route path="order-manager" element={<OrderManager />} />
        <Route path="order-manager/:id" element={<OrderManagerDetailPage />} />
        <Route path="employee-manager" element={<EmployeeManager />} />
        <Route path="customer-manager" element={<CustomerManager />} />
        <Route path="analytics" element={<RevenueManager />} />
      </Routes>
    </>
  );

}

export default App
