import { useState } from 'react'
import './App.css'
import Product from './components/products/Product'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home'
import { Toaster } from 'react-hot-toast'
import Cart from './components/cart/Cart'
import Login from './components/auth/Login'
import PrivateRoute from './components/PrivateRoute'
import Register from './components/auth/Register'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Product />} />
          <Route path='/cart' element={<Cart />} />

          <Route path='/' element={<PrivateRoute publicPage />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>
        </Routes>
      </Router>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App
