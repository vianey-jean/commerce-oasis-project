
/**
 * ============================================================================
 * COMPOSANT RACINE DE L'APPLICATION RIZIKY AGENDAS
 * ============================================================================
 * 
 * Ce fichier est le point d'entrée principal de l'application React.
 * Il configure l'architecture globale, les providers, et le système de routage.
 * 
 * ARCHITECTURE GLOBALE :
 * - Configuration du routeur React Router pour la navigation SPA
 * - Provider React Query pour la gestion des requêtes API et du cache
 * - Context d'authentification pour la gestion des utilisateurs
 * - Provider de thème pour le mode sombre/clair
 * - Système de notifications toast global
 * 
 * COMPOSANTS LAYOUT :
 * - Navbar : Navigation principale en haut de l'application
 * - Footer : Pied de page avec informations légales
 * - ScrollToTop : Bouton de retour en haut de page
 * - Toaster : Système de notifications toast
 * 
 * GESTION DES ROUTES :
 * - Routes publiques : Accueil, À propos, Contact, etc.
 * - Routes d'authentification : Connexion, Inscription, Mot de passe oublié
 * - Routes protégées : Tableau de bord, Calendrier, Clients, Messages
 * - Système de protection des routes avec redirection automatique
 * 
 * SÉCURITÉ ET PERFORMANCE :
 * - Protection des routes sensibles
 * - Lazy loading des pages (si nécessaire)
 * - Optimisation du cache avec React Query
 * - Gestion d'état global centralisée
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Index from './pages/Index';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AutoLogout from './components/AutoLogout';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './contexts/AuthContext';
import { AdvancedNotificationService } from './services/AdvancedNotificationService';

function App() {
  // Initialize advanced notifications
  useEffect(() => {
    AdvancedNotificationService.initializeNotifications();
    
    // Cleanup on unmount
    return () => {
      AdvancedNotificationService.clearAllTimers();
    };
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-react-theme">
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Navbar />
          <Index />
          <Footer />
          <AutoLogout />
          <ScrollToTop />
          <Toaster />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
