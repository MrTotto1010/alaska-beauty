import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Home from './pages/Home/Home'
import Catalog from './pages/Catalog/Catalog'
import Product from './pages/Product/Product'
import Cart from './pages/Cart/Cart'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminPanel from './pages/Admin/AdminPanel'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { CartProvider } from './contexts/CartContext'

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/producto/:id" element={<Product />} />
            <Route path="/carrito" element={<Cart />} />
          </Route>

          <Route path="/admin" element={<AdminLogin />} />

          <Route
            path="/admin/panel"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}

export default App