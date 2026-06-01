// src/App.js — Main Application Router
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import PrivateRoute from './routes/PrivateRoute';
import AdminRoute from './routes/AdminRoute';

// Public pages
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  fontFamily: 'var(--font-body)',
                  borderRadius: '4px',
                  border: '1px solid #e8e4dc',
                },
              }}
            />
            <Routes>
              {/* ── Public Routes ─────────────────────────── */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:category" element={<ShopPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/order-success/:id" element={<OrderSuccessPage />} />

              {/* ── Protected Customer Routes ─────────────── */}
              <Route path="/checkout" element={
                <PrivateRoute><CheckoutPage /></PrivateRoute>
              } />

              {/* ── Admin Routes ──────────────────────────── */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={
                <AdminRoute><AdminDashboardPage /></AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute><AdminProductsPage /></AdminRoute>
              } />
              <Route path="/admin/products/add" element={
                <AdminRoute><AdminAddProductPage /></AdminRoute>
              } />
              <Route path="/admin/products/edit/:id" element={
                <AdminRoute><AdminEditProductPage /></AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute><AdminOrdersPage /></AdminRoute>
              } />
              <Route path="/admin/orders/:id" element={
                <AdminRoute><AdminOrderDetailPage /></AdminRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminRoute><AdminCategoriesPage /></AdminRoute>
              } />

              {/* ── 404 ──────────────────────────────────── */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
