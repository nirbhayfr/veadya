import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from './components/layout/Layout';
import OfferModal from './components/common/OfferModal';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Cart from './pages/Cart';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPassword from './pages/auth/ForgotPassword';
import CheckoutPage from './pages/Checkout';
import Contact from './pages/Contact';
import ProductDetails from './pages/ProductDetails';
import AdminPanel from './pages/AdminPanel';

import { api } from './utils/api';
import { login, logout } from './store/slices/authSlice';
import { setProducts } from './store/slices/productSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Fetch products
    const loadProducts = async () => {
      try {
        const res = await api.get('/product?limit=100');
        if (res.data) {
          const normalized = res.data.map((p) => ({
            id: p.sku && p.sku.startsWith("VEADYA-") ? parseInt(p.sku.replace("VEADYA-", "")) : p._id,
            _id: p._id,
            name: p.title,
            price: p.price,
            image: p.images?.[0]?.url || "/p-1.png",
            category: p.categoryName,
            tag: p.categoryName,
            problem: p.tags?.[0] || "General Wellness",
            shortDescription: p.description,
            originalPrice: p.originalPrice,
            size: p.size,
            notes: p.notes,
            sku: p.sku,
            bg: p.bg,
            accent: p.accent,
            textColor: p.textColor,
            subColor: p.subColor,
            rating: p.ratingAverage,
            reviews: p.ratingCount,
          }));
          dispatch(setProducts(normalized));
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    // 2. Restore Auth Session
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/user/me');
        dispatch(login(res.data));
      } catch (err) {
        console.error("Session restore failed:", err);
        localStorage.removeItem('token');
        dispatch(logout());
      }
    };

    loadProducts();
    restoreSession();
  }, [dispatch]);

  return (
    <Layout>
      <Routes>
        <Route path="/"               element={<Home />} />
        <Route path="/shop"           element={<Shop />} />
        <Route path="/about"          element={<About />} />
        <Route path="/contact"        element={<Contact />} />
        <Route path="/cart"           element={<Cart />} />
        <Route path="/checkout"       element={<CheckoutPage />} />
        <Route path="/product/:id"    element={<ProductDetails />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/*"        element={<AdminPanel />} />
        {/* Fallback to Home for simplicity in this demo */}
        <Route path="*"              element={<Home />} />
      </Routes>
      <OfferModal />
    </Layout>
  );
}

export default App;
