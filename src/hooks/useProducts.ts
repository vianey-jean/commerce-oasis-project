
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';

export const utiliserProduits = (nomCategorie?: string) => {
  const [produits, setProduits] = useState<Product[]>([]);
  const [chargement, setChargement] = useState(true);

  const recupererProduits = async (nomCategorie?: string) => {
    setChargement(true);
    try {
      let reponse;
      if (nomCategorie) {
        reponse = await productsAPI.getByCategory(nomCategorie);
      } else {
        reponse = await productsAPI.getAll();
      }
      
      if (!reponse.data || !Array.isArray(reponse.data)) {
        throw new Error('Format de données incorrect pour les produits');
      }
      
      setProduits(reponse.data);
    } catch (erreur) {
      console.error("Erreur lors du chargement des produits:", erreur);
      toast.error('Erreur lors du chargement des produits');
      setProduits([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    recupererProduits(nomCategorie);
  }, [nomCategorie]);

  // Vérification périodique des promotions expirées - optimisée
  useEffect(() => {
    const verifierPromotions = () => {
      const maintenant = new Date();
      const produitsModifies = produits.map(produit => {
        if (produit.promotion && produit.promotionEnd && new Date(produit.promotionEnd) < maintenant) {
          return {
            ...produit,
            price: produit.originalPrice || produit.price,
            promotion: null,
            promotionEnd: null
          };
        }
        return produit;
      });
      
      // Optimisation: ne met à jour que si nécessaire
      if (JSON.stringify(produitsModifies) !== JSON.stringify(produits)) {
        setProduits(produitsModifies);
      }
    };
    
    if (produits.length > 0) {
      const intervalle = setInterval(verifierPromotions, 300000); // 5 minutes au lieu de 1
      return () => clearInterval(intervalle);
    }
  }, [produits]);

  const obtenirProduitParId = (id: string) => {
    return produits.find(p => p.id === id);
  };

  return {
    produits,
    chargement,
    recupererProduits,
    obtenirProduitParId
  };
};
