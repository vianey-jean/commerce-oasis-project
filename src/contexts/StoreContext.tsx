
import React, { createContext, useContext } from 'react';
import { utiliserProduits } from '@/hooks/useProducts';
import { utiliserPanier } from '@/hooks/useCart';
import { utiliserFavoris } from '@/hooks/useFavorites';
import { useOrders } from '@/hooks/useOrders';
import { Product } from '@/types/product';
import { StoreCartItem } from '@/types/cart';
import { Order } from '@/types/order';

interface TypeContexteMagasin {
  produits: Product[];
  favoris: Product[];
  panier: StoreCartItem[];
  articlesSelectionnes: StoreCartItem[];
  commandes: Order[];
  chargementProduits: boolean;
  chargementFavoris: boolean;
  chargementPanier: boolean;
  chargementCommandes: boolean;
  ajouterAuPanier: (produit: Product, quantite?: number) => void;
  supprimerDuPanier: (idProduit: string) => void;
  mettreAJourQuantite: (idProduit: string, quantite: number) => void;
  viderPanier: () => void;
  obtenirTotalPanier: () => number;
  basculerFavori: (produit: Product) => void;
  estFavori: (idProduit: string) => boolean;
  obtenirProduitParId: (id: string) => Product | undefined;
  recupererProduits: (nomCategorie?: string) => Promise<void>;
  recupererCommandes: () => Promise<void>;
  nombreFavoris: number;
  creerCommande: (
    adresseLivraison: any, 
    methodePaiement: string, 
    codePromo?: {code: string, productId: string, pourcentage: number}
  ) => Promise<Order | null>;
  setArticlesSelectionnes: (articles: StoreCartItem[]) => void;
  recupererPanier: () => Promise<void>;
  
  // Aliases pour compatibilité avec les composants existants
  cart: StoreCartItem[];
  addToCart: (produit: Product, quantite?: number) => void;
  removeFromCart: (idProduit: string) => void;
  updateQuantity: (idProduit: string, quantite: number) => void;
  toggleFavorite: (produit: Product) => void;
  isFavorite: (idProduit: string) => boolean;
  favoriteCount: number;
  loadingCart: boolean;
  selectedCartItems: StoreCartItem[];
  setSelectedCartItems: (articles: StoreCartItem[]) => void;
  getCartTotal: () => number;
  createOrder: (
    adresseLivraison: any, 
    methodePaiement: string, 
    codePromo?: {code: string, productId: string, pourcentage: number}
  ) => Promise<Order | null>;
  favorites: Product[];
  loadingFavorites: boolean;
}

const ContexteMagasin = createContext<TypeContexteMagasin | undefined>(undefined);

export const FournisseurMagasin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    produits, 
    chargement: chargementProduits, 
    recupererProduits, 
    obtenirProduitParId 
  } = utiliserProduits();

  const {
    panier,
    articlesSelectionnes,
    chargement: chargementPanier,
    ajouterAuPanier,
    supprimerDuPanier,
    mettreAJourQuantite: mettreAJourQuantitePanier,
    viderPanier,
    obtenirTotalPanier,
    setArticlesSelectionnes,
    recupererPanier
  } = utiliserPanier();

  const {
    favoris,
    chargement: chargementFavoris,
    basculerFavori,
    estFavori,
    nombreFavoris
  } = utiliserFavoris();

  const {
    commandes,
    chargement: chargementCommandes,
    recupererCommandes,
    creerCommande: creerNouvelleCommande
  } = useOrders();

  const mettreAJourQuantite = (idProduit: string, quantite: number) => {
    mettreAJourQuantitePanier(idProduit, quantite, produits);
  };

  const creerCommande = async (
    adresseLivraison: any,
    methodePaiement: string,
    codePromo?: { code: string; productId: string; pourcentage: number }
  ): Promise<Order | null> => {
    const resultat = await creerNouvelleCommande(adresseLivraison, methodePaiement, articlesSelectionnes, codePromo);
    
    if (resultat) {
      await recupererPanier();
      setArticlesSelectionnes([]);
      recupererProduits();
    }
    
    return resultat;
  };

  return (
    <ContexteMagasin.Provider value={{
      produits,
      favoris,
      panier,
      articlesSelectionnes,
      commandes,
      chargementProduits,
      chargementFavoris,
      chargementPanier,
      chargementCommandes,
      ajouterAuPanier,
      supprimerDuPanier,
      mettreAJourQuantite,
      viderPanier,
      obtenirTotalPanier,
      basculerFavori,
      estFavori,
      obtenirProduitParId,
      recupererProduits,
      recupererCommandes,
      nombreFavoris,
      creerCommande,
      setArticlesSelectionnes,
      recupererPanier,
      
      // Aliases pour compatibilité
      cart: panier,
      addToCart: ajouterAuPanier,
      removeFromCart: supprimerDuPanier,
      updateQuantity: mettreAJourQuantite,
      toggleFavorite: basculerFavori,
      isFavorite: estFavori,
      favoriteCount: nombreFavoris,
      loadingCart: chargementPanier,
      selectedCartItems: articlesSelectionnes,
      setSelectedCartItems: setArticlesSelectionnes,
      getCartTotal: obtenirTotalPanier,
      createOrder: creerCommande,
      favorites: favoris,
      loadingFavorites: chargementFavoris
    }}>
      {children}
    </ContexteMagasin.Provider>
  );
};

export const utiliserMagasin = () => {
  const contexte = useContext(ContexteMagasin);
  if (!contexte) {
    throw new Error('utiliserMagasin doit être utilisé dans un FournisseurMagasin');
  }
  return contexte;
};

// Exports pour la compatibilité
export const StoreProvider = FournisseurMagasin;
export const useStore = utiliserMagasin;
export type { Product };
