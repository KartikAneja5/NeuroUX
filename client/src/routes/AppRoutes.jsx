import { Routes, Route } from 'react-router-dom';
// Public
import HomePage from '../pages/public/HomePage';
import AboutPage from '../pages/public/AboutPage';
import ServicesPage from '../pages/public/ServicesPage';
import MarketplacePage from '../pages/public/MarketplacePage';
import ProductDetailsPage from '../pages/public/ProductDetailsPage';
import ContactPage from '../pages/public/ContactPage';
// Auth
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
// Cart & Checkout
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
// Customer
import CustomerDashboardPage from '../pages/customer/CustomerDashboardPage';
import ProfilePage from '../pages/customer/ProfilePage';
import WishlistPage from '../pages/customer/WishlistPage';
import OrdersPage from '../pages/customer/OrdersPage';
import DownloadsPage from '../pages/customer/DownloadsPage';
import RecommendedProductsPage from '../pages/customer/RecommendedProductsPage';
import CustomerSettingsPage from '../pages/customer/CustomerSettingsPage';
// Admin
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminAnalyticsPage from '../pages/admin/AdminAnalyticsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';

// Guards
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/marketplace/:id" element={<ProductDetailsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Customer Routes (Protected) */}
      <Route path="/customer/cart" element={<CartPage />} />
      <Route path="/customer/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboardPage /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/customer/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/customer/downloads" element={<ProtectedRoute><DownloadsPage /></ProtectedRoute>} />
      <Route path="/customer/recommended" element={<ProtectedRoute><RecommendedProductsPage /></ProtectedRoute>} />
      <Route path="/customer/settings" element={<ProtectedRoute><CustomerSettingsPage /></ProtectedRoute>} />

      {/* Admin Routes (Protected) */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
      <Route path="/admin/categories" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
      <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
    </Routes>
  );
}
