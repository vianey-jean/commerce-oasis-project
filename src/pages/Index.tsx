
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import DashboardPage from './DashboardPage';
import NotFoundPage from './NotFoundPage';
import ClientsPage from './ClientsPage';
import CalendarPage from './CalendarPage';
import MissionPage from './MissionPage';
import PrivacyPage from './PrivacyPage';
import TermsPage from './TermsPage';
import SupportPage from './SupportPage';
import MessagesPage from './MessagesPage';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/connexion" />;
  }
  return <>{children}</>;
};

const Index = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/mission" element={<MissionPage />} />
      <Route path="/confidentialite" element={<PrivacyPage />} />
      <Route path="/conditions" element={<TermsPage />} />
      <Route path="/support" element={<SupportPage />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <ProtectedRoute>
            <CalendarPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default Index;
