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

      {/* Customer Routes (Will be protected later) */}
      <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
      <Route path="/customer/profile" element={<ProfilePage />} />
      <Route path="/customer/wishlist" element={<WishlistPage />} />
      <Route path="/customer/orders" element={<OrdersPage />} />
      <Route path="/customer/downloads" element={<DownloadsPage />} />
      <Route path="/customer/recommended" element={<RecommendedProductsPage />} />
      <Route path="/customer/settings" element={<CustomerSettingsPage />} />

      {/* Admin Routes (Will be protected later) */}
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<AdminProductsPage />} />
      <Route path="/admin/users" element={<AdminUsersPage />} />
      <Route path="/admin/orders" element={<AdminOrdersPage />} />
      <Route path="/admin/categories" element={<AdminCategoriesPage />} />
      <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      <Route path="/admin/settings" element={<AdminSettingsPage />} />
    </Routes>
  );
}
