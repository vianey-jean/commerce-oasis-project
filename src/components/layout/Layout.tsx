import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import PromoBanner from './PromoBanner';
import BenefitsSection from './BenefitsSection';
import PaymentBadges from './PaymentBadges';
import LayoutPrompts from './LayoutPrompts';
import ClientServiceChatWidget from '@/components/chat/ClientServiceChatWidget';
import AdminServiceChatWidget from '@/components/chat/AdminServiceChatWidget';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SEOHead from '@/components/seo/SEOHead';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@/contexts/StoreContext';
import { productsAPI } from '@/services/api';
import pubLayoutAPI, { PubLayout } from '@/services/pubLayoutAPI';
import { useScrollDetection } from '@/hooks/useScrollDetection';

interface ProprietesLayout {
  enfants?: React.ReactNode;
  children?: React.ReactNode;
  masquerInvites?: boolean;
  // Propriétés SEO
  titrePage?: string;
  descriptionPage?: string;
  motsClesPage?: string;
  imageOGPage?: string;
  typeContenuPage?: string;
}

const Layout: React.FC<ProprietesLayout> = ({ 
  enfants, 
  children,
  masquerInvites = false,
  titrePage,
  descriptionPage,
  motsClesPage,
  imageOGPage,
  typeContenuPage
}) => {
  // Use enfants if provided, otherwise use children
  const content = enfants || children;

  const { data: produitsTendance } = useQuery({
    queryKey: ['produits-tendance'],
    queryFn: async (): Promise<Product[]> => {
      try {
        const reponse = await productsAPI.getMostFavorited();
        return reponse.data || [];
      } catch (erreur) {
        console.error('Erreur lors du chargement des produits populaires:', erreur);
        return [];
      }
    },
    enabled: !masquerInvites,
    staleTime: 15 * 60 * 1000, // Augmenté de 10min à 15min pour réduire les requêtes
    retry: 1, // Réduit de 2 à 1 tentative
    retryDelay: 2000, // Réduit le délai de retry
  });

  const { data: elementsPubLayout = [], isLoading: chargementPubLayout } = useQuery({
    queryKey: ['pub-layout'],
    queryFn: async (): Promise<PubLayout[]> => {
      try {
        return await pubLayoutAPI.getAll();
      } catch (erreur) {
        console.error('Erreur lors du chargement des publicités:', erreur);
        return [
          { id: "1", icon: "ThumbsUp", text: "Livraison gratuite à partir de 50€ d'achat" },
          { id: "2", icon: "Gift", text: "-10% sur votre première commande avec le code WELCOME10" },
          { id: "3", icon: "Clock", text: "Satisfait ou remboursé sous 30 jours" }
        ];
      }
    },
    staleTime: 60 * 1000, // Augmenté de 30s à 60s
    refetchInterval: 60 * 1000, // Augmenté de 30s à 60s pour réduire la charge
    refetchOnWindowFocus: false, // Désactivé pour améliorer les performances
  });

  const aDefileVue = useScrollDetection(200, masquerInvites);

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <SEOHead
        titre={titrePage}
        description={descriptionPage}
        motsCles={motsClesPage}
        imageOG={imageOGPage}
        typeContenu={typeContenuPage}
      />
      
      <header className="sticky top-0 z-50">
        <Navbar />
        <PromoBanner pubLayoutItems={elementsPubLayout} isLoading={chargementPubLayout} />
      </header>
      
      <main className="flex-grow" role="main">
        {content}
        <BenefitsSection />
        <PaymentBadges />
      </main>
      
      <Footer />
      
      <LayoutPrompts 
        hidePrompts={masquerInvites}
        trendingProducts={produitsTendance}
        hasScrolled={aDefileVue}
      />

      <ClientServiceChatWidget />
      <AdminServiceChatWidget />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
