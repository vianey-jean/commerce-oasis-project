// Importation du composant Toaster (notifications UI)
import { Toaster } from "@/components/ui/toaster";
// Importation d’un second système de notifications (nommé ici "Sonner")
import { Toaster as Sonner } from "@/components/ui/sonner";
// Fournisseur de contextes pour les tooltips dans toute l'application
import { TooltipProvider } from "@/components/ui/tooltip";
// Importation de React Query pour la gestion des données asynchrones côté client
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Importation des composants nécessaires à la gestion du routage
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Composant personnalisé permettant la déconnexion automatique après inactivité
import AutoLogout from "./components/AutoLogout";
// Composant d’interface pour la barre de navigation principale
import Navbar from "./components/Navbar";
// Composant d’interface pour le pied de page
import Footer from "./components/Footer";

// Importation des différentes pages de l’application
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import NotFoundPage from "./pages/Notfound";

// Création d’un client React Query pour gérer les requêtes réseau, le cache, etc.
const queryClient = new QueryClient();

// Composant principal de l’application
const App = () => (
  // Fournit le contexte React Query à toute l’application
  <QueryClientProvider client={queryClient}>
    {/* Fournit le contexte pour les info-bulles */}
    <TooltipProvider>
      {/* Composant pour afficher les notifications (toasts) standards */}
      <Toaster />
      {/* Composant alternatif de notifications (possiblement pour un style ou comportement différent) */}
      <Sonner />
      {/* Fournit le contexte de routage à l’application */}
      <BrowserRouter>
        {/* Gestion automatique de la déconnexion après inactivité */}
        <AutoLogout />
        {/* Structure générale de la page avec flexbox pour disposer la navbar, le contenu et le footer */}
        <div className="flex flex-col min-h-screen">
          {/* Barre de navigation toujours visible */}
          <Navbar />
          {/* Zone principale où s’affichent les différentes pages */}
          <main className="flex-1">
            {/* Définition des routes de l’application */}
            <Routes>
              <Route path="/" element={<HomePage />} />                       {/* Page d’accueil */}
              <Route path="/a-propos" element={<AboutPage />} />              {/* Page "À propos" */}
              <Route path="/contact" element={<ContactPage />} />             {/* Page de contact */}
              <Route path="/connexion" element={<LoginPage />} />             {/* Page de connexion */}
              <Route path="/inscription" element={<RegisterPage />} />        {/* Page d’inscription */}
              <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} /> {/* Page de récupération de mot de passe */}
              <Route path="/dashboard" element={<DashboardPage />} />         {/* Tableau de bord (accès après connexion) */}
              <Route path="*" element={<NotFoundPage />} />                   {/* Page 404 pour les routes inconnues */}
            </Routes>
          </main>
          {/* Pied de page toujours visible en bas de la page */}
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Export du composant App pour qu’il soit utilisé comme point d’entrée dans index.tsx
export default App;
