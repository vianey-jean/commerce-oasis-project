
import React, { useEffect } from 'react';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecureRoute from './components/SecureRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { resetSecureIds, getSecureId, getSecureRoute } from './services/secureIds';

import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import ChatPage from './pages/ChatPage';
import ContactPage from './pages/ContactPage';
import OrderPage from './pages/OrderPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import DeliveryPage from './pages/DeliveryPage';
import ReturnsPage from './pages/ReturnsPage';
import CustomerServicePage from './pages/CustomerServicePage';
import BlogPage from './pages/BlogPage';
import CarriersPage from './pages/CarriersPage';
import HistoryPage from './pages/HistoryPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import FAQPage from './pages/FAQPage';

import AdminLayout from './pages/admin/AdminLayout';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminMessagesPage from './pages/admin/AdminMessagesPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminClientChatPage from './pages/admin/AdminClientChatPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Création d'un nouveau QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Routes sécurisées avec leurs noms réels
const secureRoutes = {
  admin: getSecureRoute('/admin'),
  adminProducts: getSecureRoute('/admin/produits'),
  adminUsers: getSecureRoute('/admin/utilisateurs'),
  adminMessages: getSecureRoute('/admin/messages'),
  adminSettings: getSecureRoute('/admin/parametres'),
  adminChat: getSecureRoute('/admin'),
  adminClientChat: getSecureRoute('/admin/service-client'),
  adminOrders: getSecureRoute('/admin/commandes'),
  profile: getSecureRoute('/profil'),
  orders: getSecureRoute('/commandes'),
  cart: getSecureRoute('/panier'),
  favorites: getSecureRoute('/favoris'),
  checkout: getSecureRoute('/paiement'),
};

function AppRoutes() {
  const location = useLocation();
  
  // Réinitialiser les IDs sécurisés à chaque changement de route
  useEffect(() => {
    resetSecureIds();
    console.log("IDs sécurisés réinitialisés");
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/produit/:productId" element={<ProductDetail />} />
      <Route path="/categorie/:categoryName" element={<CategoryPage />} />
      
      {/* Pages d'information */}
      <Route path="/livraison" element={<DeliveryPage />} />
      <Route path="/retours" element={<ReturnsPage />} />
      <Route path="/service-client" element={<CustomerServicePage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/carrieres" element={<CarriersPage />} />
      <Route path="/notre-histoire" element={<HistoryPage />} />
      <Route path="/conditions-utilisation" element={<TermsPage />} />
      <Route path="/politique-confidentialite" element={<PrivacyPage />} />
      <Route path="/politique-cookies" element={<CookiesPage />} />
      <Route path="/faq" element={<FAQPage />} />

      <Route path="/chat" element={
        <ProtectedRoute>
          <ChatPage />
        </ProtectedRoute>
      } />
      
      {/* Routes protégées avec URLs sécurisés */}
      <Route path={secureRoutes.cart.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute>
            <CartPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/panier" element={<Navigate to={secureRoutes.cart} replace />} />
      
      <Route path={secureRoutes.favorites.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/favoris" element={<Navigate to={secureRoutes.favorites} replace />} />
      
      <Route path={secureRoutes.checkout.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/paiement" element={<Navigate to={secureRoutes.checkout} replace />} />
      
      <Route path={secureRoutes.orders.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute>
            <OrdersPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/commandes" element={<Navigate to={secureRoutes.orders} replace />} />
      
      <Route path="/commande/:orderId" element={
        <ProtectedRoute>
          <OrderPage />
        </ProtectedRoute>
      } />
      
      <Route path={secureRoutes.profile.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/profil" element={<Navigate to={secureRoutes.profile} replace />} />
      
      {/* Pages Admin avec URLs sécurisés */}
      <Route path={secureRoutes.adminProducts.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminProductsPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/produits" element={<Navigate to={secureRoutes.adminProducts} replace />} />
      
      <Route path={secureRoutes.adminUsers.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminUsersPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/utilisateurs" element={<Navigate to={secureRoutes.adminUsers} replace />} />
      
      <Route path={secureRoutes.adminMessages.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminMessagesPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/messages" element={<Navigate to={secureRoutes.adminMessages} replace />} />
      
      <Route path={secureRoutes.adminSettings.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminSettingsPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/parametres" element={<Navigate to={secureRoutes.adminSettings} replace />} />
      
      <Route path={`${secureRoutes.adminChat.substring(1)}/:adminId?`} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminChatPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/:adminId?" element={<Navigate to={secureRoutes.adminChat} replace />} />
      
      <Route path={secureRoutes.adminOrders.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminOrdersPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/commandes" element={<Navigate to={secureRoutes.adminOrders} replace />} />
      
      <Route path={secureRoutes.adminClientChat.substring(1)} element={
        <SecureRoute>
          <ProtectedRoute requireAdmin>
            <AdminClientChatPage />
          </ProtectedRoute>
        </SecureRoute>
      } />
      <Route path="/admin/service-client" element={<Navigate to={secureRoutes.adminClientChat} replace />} />
      
      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
          <Toaster />
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
