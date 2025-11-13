import './App.css'
import Product from './components/products/Product'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Home from './components/home/Home'
import { Toaster } from 'react-hot-toast'
import Cart from './components/cart/Cart'
import Login from './components/auth/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/auth/Register'
import CheckOut from './components/checkout/CheckOut'
import Navbar from './components/shared/Navbar'
import PaymentConfirmation from './components/checkout/PaymentConfirmation'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './components/admin/dashboard/Dashboard'
import AdminProducts from './components/admin/products/AdminProducts'
import Sellers from './components/admin/sellers/Sellers'
import Category from './components/admin/categories/Category'
import Orders from './components/admin/orders/Orders'

const AppContent = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <> <Navbar />

      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/products' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/' element={<PrivateRoute />}>
          <Route path='/checkout' element={<CheckOut />} />
          <Route path='/order-confirm' element={<PaymentConfirmation />} />
        </Route>

        <Route path='/' element={<PrivateRoute publicPage />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route path='/' element={<PrivateRoute adminOnly />}>
          <Route path='/admin' element={<AdminLayout />}>
            <Route path='' element={<Dashboard />} />
            <Route path='products' element={<AdminProducts />} />
            <Route path='sellers' element={<Sellers />} />
            <Route path='orders' element={<Orders />} />
            <Route path='categories' element={<Category />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position='top-right' reverseOrder={false} />
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

