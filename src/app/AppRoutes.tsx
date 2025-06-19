
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import AllProductsPage from '@/pages/AllProductsPage';
import CategoryPage from '@/pages/CategoryPage';
import ProductDetail from '@/pages/ProductDetail';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import RegisterBlockPage from '@/pages/RegisterBlockPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ProfilePage from '@/pages/ProfilePage';
import ProfilPage from '@/pages/ProfilPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderPage from '@/pages/OrderPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ContactPage from '@/pages/ContactPage';
import FAQPage from '@/pages/FAQPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import MentionsLegalesPage from '@/pages/MentionsLegalesPage';
import CookiesPage from '@/pages/CookiesPage';
import ReturnsPage from '@/pages/ReturnsPage';
import DeliveryPage from '@/pages/DeliveryPage';
import CarriersPage from '@/pages/CarriersPage';
import CustomerServicePage from '@/pages/CustomerServicePage';
import ChatPage from '@/pages/ChatPage';
import NewArrivalsPage from '@/pages/NewArrivalsPage';
import PopularityPage from '@/pages/PopularityPage';
import PromotionalProductsPage from '@/pages/PromotionalProductsPage';
import HistoryPage from '@/pages/HistoryPage';
import BlogPage from '@/pages/BlogPage';
import FlashSalePage from '@/pages/FlashSalePage';
import MaintenancePage from '@/pages/MaintenancePage';
import MaintenanceLoginPage from '@/pages/MaintenanceLoginPage';
import NotFound from '@/pages/NotFound';

// Admin pages
import AdminLayout from '@/pages/admin/AdminLayout';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminCategoriesPage from '@/pages/admin/AdminCategoriesPage';
import AdminCodePromosPage from '@/pages/admin/AdminCodePromosPage';
import AdminFlashSalesPage from '@/pages/admin/AdminFlashSalesPage';
import AdminMessagesPage from '@/pages/admin/AdminMessagesPage';
import AdminChatPage from '@/pages/admin/AdminChatPage';
import AdminClientChatPage from '@/pages/admin/AdminClientChatPage';
import AdminRefundsPage from '@/pages/admin/AdminRefundsPage';
import AdminRemboursementsPage from '@/pages/admin/AdminRemboursementsPage';
import AdminPubLayoutPage from '@/pages/admin/AdminPubLayoutPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';

import ProtectedRoute from '@/components/ProtectedRoute';
import SecureRoute from '@/components/SecureRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<AllProductsPage />} />
      <Route path="/category/:categoryName" element={<CategoryPage />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register-block" element={<RegisterBlockPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
      <Route path="/cookies" element={<CookiesPage />} />
      <Route path="/returns" element={<ReturnsPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/carriers" element={<CarriersPage />} />
      <Route path="/customer-service" element={<CustomerServicePage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/new-arrivals" element={<NewArrivalsPage />} />
      <Route path="/popularity" element={<PopularityPage />} />
      <Route path="/promotional-products" element={<PromotionalProductsPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/flash-sale" element={<FlashSalePage />} />
      <Route path="/maintenance" element={<MaintenancePage />} />
      <Route path="/maintenance-login" element={<MaintenanceLoginPage />} />

      {/* Protected routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/profil" element={
        <ProtectedRoute>
          <ProfilPage />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <OrdersPage />
        </ProtectedRoute>
      } />
      <Route path="/order/:id" element={
        <ProtectedRoute>
          <OrderPage />
        </ProtectedRoute>
      } />
      <Route path="/history" element={
        <ProtectedRoute>
          <HistoryPage />
        </ProtectedRoute>
      } />

      {/* Admin routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <SecureRoute>
            <AdminLayout />
          </SecureRoute>
        </ProtectedRoute>
      }>
        <Route index element={<AdminUsersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="code-promos" element={<AdminCodePromosPage />} />
        <Route path="flash-sales" element={<AdminFlashSalesPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="chat" element={<AdminChatPage />} />
        <Route path="client-chat" element={<AdminClientChatPage />} />
        <Route path="refunds" element={<AdminRefundsPage />} />
        <Route path="remboursements" element={<AdminRemboursementsPage />} />
        <Route path="pub-layout" element={<AdminPubLayoutPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
