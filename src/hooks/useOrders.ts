
/**
 * @fileoverview Hook personnalisé pour la gestion des commandes utilisateur
 * 
 * Ce hook gère toute la logique liée aux commandes d'un utilisateur.
 * Il inclut la récupération de l'historique, la création de nouvelles commandes
 * et la synchronisation avec le panier.
 * 
 * Fonctionnalités principales:
 * - Récupération automatique des commandes au login
 * - Création de commandes avec validation complète
 * - Gestion des codes promo et remises
 * - Synchronisation panier après commande
 * - Calcul automatique des totaux et sous-totaux
 * - Gestion des adresses de livraison
 * - Support multiple méthodes de paiement
 * - Nettoyage automatique du panier post-commande
 * - Notifications de succès/erreur
 * - État de chargement pour UX
 * 
 * @version 2.0.0
 * @author Equipe Riziky-Boutic
 */

import { useState, useEffect } from 'react';
import { Order } from '@/types/order';
import { ordersAPI, cartAPI } from '@/services/api';
import { StoreCartItem } from '@/types/cart';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await ordersAPI.getUserOrders();
      if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setOrders([]);
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Crée une nouvelle commande avec calcul TVA
   * 
   * Le calcul de prix fonctionne ainsi:
   * - subtotalHT = prix TTC * 0.80 (prix hors taxe)
   * - taxAmount = prix TTC * 0.20 (TVA 20%)
   * - total = subtotalHT + taxAmount + deliveryPrice
   */
  const createOrder = async (
    shippingAddress: any,
    paymentMethod: string,
    selectedCartItems: StoreCartItem[],
    codePromo?: { code: string; productId: string; pourcentage: number },
    deliveryPrice?: number
  ): Promise<Order | null> => {
    if (!isAuthenticated || !user || selectedCartItems.length === 0) {
      toast.error('Impossible de créer la commande: utilisateur non connecté ou panier vide');
      return null;
    }

    try {
      console.log('Preparing order payload with items:', selectedCartItems.length);
      
      // Taux de TVA (20%)
      const TAX_RATE = 0.20;
      
      const orderItems = selectedCartItems.map(item => {
        // Prix avec code promo si applicable
        const finalPrice = codePromo && codePromo.productId === item.product.id
          ? item.product.price * (1 - codePromo.pourcentage / 100)
          : item.product.price;
        
        const itemSubtotal = finalPrice * item.quantity;

        return {
          productId: item.product.id,
          name: item.product.name,
          price: finalPrice,
          originalPrice: item.product.originalPrice || item.product.price,
          quantity: item.quantity,
          image: item.product.images && item.product.images.length > 0 
            ? item.product.images[0] 
            : item.product.image,
          subtotal: itemSubtotal,
          codePromoApplied: codePromo && codePromo.productId === item.product.id
        };
      });
      
      console.log('Order items mapped:', orderItems);
      
      // Calculer les totaux avec TVA
      const totalTTC = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
      const subtotalHT = totalTTC * (1 - TAX_RATE); // Prix HT (sans TVA)
      const taxAmount = totalTTC * TAX_RATE; // TVA 20%
      const finalDeliveryPrice = deliveryPrice !== undefined ? deliveryPrice : 0;
      const orderTotal = subtotalHT + taxAmount + finalDeliveryPrice;

      const orderPayload = {
        items: orderItems,
        shippingAddress,
        paymentMethod,
        codePromo: codePromo || null,
        // Informations de TVA pour la base de données
        subtotalHT: subtotalHT,
        taxRate: TAX_RATE,
        taxAmount: taxAmount,
        deliveryPrice: finalDeliveryPrice,
        orderTotal: orderTotal
      };

      console.log('Sending order payload with tax info:', orderPayload);
      
      const response = await ordersAPI.create(orderPayload);

      if (response.data) {
        // Supprimer seulement les produits commandés du panier
        console.log('Suppression des produits commandés du panier...');
        for (const item of selectedCartItems) {
          try {
            await cartAPI.removeItem(user.id, item.product.id);
            console.log(`Produit ${item.product.id} supprimé du panier`);
          } catch (error) {
            console.error(`Erreur lors de la suppression du produit ${item.product.id} du panier:`, error);
          }
        }
        
        toast.success('Commande créée avec succès');
        fetchOrders();
        return response.data;
      } else {
        toast.error('Échec de la création de la commande');
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      toast.error('Erreur lors de la création de la commande');
      return null;
    }
  };

  return {
    orders,
    loading,
    fetchOrders,
    createOrder
  };
};
