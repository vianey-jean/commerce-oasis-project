import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { ordersAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { StoreCartItem } from '@/types/cart';

export const useOrders = () => {
  const [commandes, setCommandes] = useState<Order[]>([]);
  const [chargement, setChargement] = useState(true);
  const { user: utilisateur, isAuthenticated: estAuthentifie } = useAuth();

  const recupererCommandes = async () => {
    if (!estAuthentifie || !utilisateur) {
      setCommandes([]);
      setChargement(false);
      return;
    }
    
    setChargement(true);
    try {
      const reponse = await ordersAPI.getUserOrders(utilisateur.id);
      if (reponse.data && Array.isArray(reponse.data)) {
        setCommandes(reponse.data);
      } else {
        setCommandes([]);
      }
    } catch (erreur) {
      console.error("Erreur lors du chargement des commandes:", erreur);
      setCommandes([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (estAuthentifie && utilisateur) {
      recupererCommandes();
    } else {
      setCommandes([]);
      setChargement(false);
    }
  }, [estAuthentifie, utilisateur]);

  const creerCommande = async (
    adresseLivraison: any,
    methodePaiement: string,
    articlesSelectionnes: StoreCartItem[],
    codePromo?: { code: string; productId: string; pourcentage: number }
  ): Promise<Order | null> => {
    if (!estAuthentifie || !utilisateur) {
      toast.error('Vous devez être connecté pour passer une commande');
      return null;
    }
    
    try {
      const donneesCommande = {
        userId: utilisateur.id,
        items: articlesSelectionnes.map(article => ({
          productId: article.product.id,
          quantity: article.quantity,
          price: article.product.price
        })),
        shippingAddress: adresseLivraison,
        paymentMethod: methodePaiement,
        promoCode: codePromo
      };

      const reponse = await ordersAPI.create(donneesCommande);
      
      if (reponse.data) {
        toast.success('Commande créée avec succès');
        await recupererCommandes();
        return reponse.data;
      }
      
      return null;
    } catch (erreur) {
      console.error("Erreur lors de la création de la commande:", erreur);
      toast.error('Erreur lors de la création de la commande');
      return null;
    }
  };

  return {
    commandes,
    chargement,
    recupererCommandes,
    creerCommande
  };
};

// Alias pour compatibilité
export const utiliserCommandes = useOrders;
