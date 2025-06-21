
import { useState, useEffect } from 'react';
import { StoreCartItem } from '@/types/cart';
import { Product } from '@/types/product';
import { cartAPI, productsAPI } from '@/services/api';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const utiliserPanier = () => {
  const [panier, setPanier] = useState<StoreCartItem[]>([]);
  const [articlesSelectionnes, setArticlesSelectionnes] = useState<StoreCartItem[]>([]);
  const [chargement, setChargement] = useState(true);
  const { user: utilisateur, isAuthenticated: estAuthentifie } = useAuth();

  const recupererPanier = async () => {
    if (!estAuthentifie || !utilisateur) {
      setPanier([]);
      setChargement(false);
      return;
    }
    
    setChargement(true);
    try {
      const reponse = await cartAPI.get(utilisateur.id);
      const donneesPanier = reponse.data;
      
      if (!donneesPanier || !Array.isArray(donneesPanier.items)) {
        setPanier([]);
        setChargement(false);
        return;
      }
      
      const promessesProduits = donneesPanier.items.map(async (article) => {
        try {
          const reponseProduit = await productsAPI.getById(article.productId);
          if (reponseProduit.data) {
            return {
              product: reponseProduit.data,
              quantity: article.quantity
            };
          }
        } catch (err) {
          console.error(`Erreur lors du chargement du produit ${article.productId}:`, err);
        }
        return null;
      });
      
      const resultats = await Promise.all(promessesProduits);
      const articlesPanier = resultats.filter(Boolean) as StoreCartItem[];
      
      setPanier(articlesPanier);
    } catch (erreur) {
      console.error("Erreur lors du chargement du panier:", erreur);
      setPanier([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (estAuthentifie && utilisateur) {
      recupererPanier();
    } else {
      setPanier([]);
      setChargement(false);
    }
  }, [estAuthentifie, utilisateur]);

  useEffect(() => {
    setArticlesSelectionnes([...panier]);
  }, [panier]);

  const ajouterAuPanier = async (produit: Product, quantite: number = 1) => {
    if (!estAuthentifie || !utilisateur) {
      toast.error('Vous devez être connecté pour ajouter un produit au panier', {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    if (produit.stock !== undefined && produit.stock < quantite) {
      toast.error(`Stock insuffisant. Disponible: ${produit.stock}`);
      return;
    }
    
    const indexArticleExistant = panier.findIndex(article => article.product.id === produit.id);
    const quantiteExistante = indexArticleExistant >= 0 ? panier[indexArticleExistant].quantity : 0;
    
    if (produit.stock !== undefined && (quantiteExistante + quantite) > produit.stock) {
      toast.error(`Stock insuffisant. Disponible: ${produit.stock}`);
      return;
    }
    
    try {
      await cartAPI.addItem(utilisateur.id, produit.id, quantite);
      
      if (indexArticleExistant >= 0) {
        const panierMisAJour = [...panier];
        panierMisAJour[indexArticleExistant].quantity += quantite;
        setPanier(panierMisAJour);
      } else {
        setPanier([...panier, { product: produit, quantity: quantite }]);
      }
      
      toast.success('Produit ajouté au panier');
    } catch (erreur) {
      console.error("Erreur lors de l'ajout au panier:", erreur);
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  const supprimerDuPanier = async (idProduit: string) => {
    if (!estAuthentifie || !utilisateur) return;
    
    try {
      await cartAPI.removeItem(utilisateur.id, idProduit);
      setPanier(panier.filter(article => article.product.id !== idProduit));
      toast.info('Produit supprimé du panier');
    } catch (erreur) {
      console.error("Erreur lors de la suppression du panier:", erreur);
      toast.error('Erreur lors de la suppression du produit');
    }
  };

  const mettreAJourQuantite = async (idProduit: string, quantite: number, produits: Product[]) => {
    if (!estAuthentifie || !utilisateur) return;
    
    if (quantite <= 0) {
      supprimerDuPanier(idProduit);
      return;
    }
    
    const produit = produits.find(p => p.id === idProduit);
    if (produit && produit.stock !== undefined && quantite > produit.stock) {
      toast.error(`Stock insuffisant. Disponible: ${produit.stock}`);
      return;
    }
    
    try {
      await cartAPI.updateItem(utilisateur.id, idProduit, quantite);
      
      const panierMisAJour = panier.map(article => {
        if (article.product.id === idProduit) {
          return { ...article, quantity: quantite };
        }
        return article;
      });
      
      setPanier(panierMisAJour);
    } catch (erreur) {
      console.error("Erreur lors de la mise à jour du panier:", erreur);
      toast.error('Erreur lors de la mise à jour de la quantité');
    }
  };

  const viderPanier = async () => {
    if (!estAuthentifie || !utilisateur) return;
    
    try {
      await cartAPI.clear(utilisateur.id);
      setPanier([]);
    } catch (erreur) {
      console.error("Erreur lors de la suppression du panier:", erreur);
      toast.error('Erreur lors de la suppression du panier');
    }
  };

  const obtenirTotalPanier = () => {
    return articlesSelectionnes.reduce((total, article) => {
      return total + (article.product.price * article.quantity);
    }, 0);
  };

  return {
    panier,
    articlesSelectionnes,
    chargement,
    ajouterAuPanier,
    supprimerDuPanier,
    mettreAJourQuantite,
    viderPanier,
    obtenirTotalPanier,
    setArticlesSelectionnes,
    recupererPanier
  };
};
