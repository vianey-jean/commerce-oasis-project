
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { favoritesAPI } from '@/services/favoritesAPI';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export const utiliserFavoris = () => {
  const [favoris, setFavoris] = useState<Product[]>([]);
  const [chargement, setChargement] = useState(true);
  const { user: utilisateur, isAuthenticated: estAuthentifie } = useAuth();

  const recupererFavoris = async () => {
    if (!estAuthentifie || !utilisateur) {
      setFavoris([]);
      setChargement(false);
      return;
    }
    
    setChargement(true);
    try {
      const reponse = await favoritesAPI.get(utilisateur.id);
      if (reponse.data && reponse.data.items && Array.isArray(reponse.data.items)) {
        setFavoris(reponse.data.items);
      } else {
        setFavoris([]);
      }
    } catch (erreur) {
      console.error("Erreur lors du chargement des favoris:", erreur);
      setFavoris([]);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    if (estAuthentifie && utilisateur) {
      recupererFavoris();
    } else {
      setFavoris([]);
      setChargement(false);
    }
  }, [estAuthentifie, utilisateur]);

  const basculerFavori = async (produit: Product) => {
    if (!estAuthentifie || !utilisateur) {
      toast.error('Vous devez être connecté pour ajouter un produit aux favoris', {
        style: { backgroundColor: '#EF4444', color: 'white', fontWeight: 'bold' },
        duration: 4000,
        position: 'top-center',
      });
      return;
    }
    
    const estDejaDansFavoris = favoris.some(fav => fav.id === produit.id);
    
    try {
      if (estDejaDansFavoris) {
        await favoritesAPI.removeItem(utilisateur.id, produit.id);
        setFavoris(favoris.filter(fav => fav.id !== produit.id));
        toast.info('Produit retiré des favoris');
      } else {
        await favoritesAPI.addItem(utilisateur.id, produit.id);
        setFavoris([...favoris, produit]);
        toast.success('Produit ajouté aux favoris');
      }
    } catch (erreur) {
      console.error("Erreur lors de la gestion des favoris:", erreur);
      toast.error('Erreur lors de la gestion des favoris');
    }
  };

  const estFavori = (idProduit: string) => {
    return favoris.some(fav => fav.id === idProduit);
  };

  return {
    favoris,
    chargement,
    basculerFavori,
    estFavori,
    nombreFavoris: favoris.length
  };
};
