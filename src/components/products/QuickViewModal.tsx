
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, X, Share2, Eye } from 'lucide-react';
import { Product } from '@/types/product';
import { useStore } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getSecureProductId } from '@/services/secureIds';

interface ProprietesModalVueRapide {
  produit: Product | null;
  estOuvert: boolean;
  fermer: () => void;
}

const ModalVueRapideProduit: React.FC<ProprietesModalVueRapide> = ({ produit, estOuvert, fermer }) => {
  const [indexImageSelectionnee, setIndexImageSelectionnee] = useState(0);
  const [quantite, setQuantite] = useState(1);
  const { ajouterAuPanier, basculerFavori, estFavori } = useStore();
  const { estAuthentifie } = useAuth();
  const URL_BASE_API = import.meta.env.VITE_API_BASE_URL;

  if (!produit) return null;

  const imagesProduit = produit.images && produit.images.length > 0 
    ? produit.images 
    : produit.image ? [produit.image] : [];

  const obtenirUrlImage = (cheminImage: string) => {
    if (!cheminImage) return '/placeholder.svg';
    if (cheminImage.startsWith('http')) return cheminImage;
    return `${URL_BASE_API}${cheminImage}`;
  };

  const gererAjoutPanier = () => {
    if (!estAuthentifie) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier");
      return;
    }

    for (let i = 0; i < quantite; i++) {
      ajouterAuPanier(produit);
    }
    toast.success(`${quantite} ${quantite > 1 ? 'exemplaires ajoutés' : 'exemplaire ajouté'} au panier`);
  };

  const gererBasculerFavori = () => {
    if (!estAuthentifie) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    basculerFavori(produit);
    toast.success(estFavori(produit.id) ? "Retiré des favoris" : "Ajouté aux favoris");
  };

  const promotionActive = produit.promotion && 
    produit.promotionEnd && 
    new Date(produit.promotionEnd) > new Date();

  const enStock = produit.isSold && (produit.stock === undefined || produit.stock > 0);
  const estNouveau = produit.dateAjout && 
    new Date().getTime() - new Date(produit.dateAjout).getTime() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Dialog open={estOuvert} onOpenChange={fermer}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
        >
          {/* Section Images */}
          <div className="relative bg-gray-50 p-6">
            <button
              onClick={fermer}
              className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="relative mb-4">
              <AnimatePresence mode="wait">
                <motion.img
                  key={indexImageSelectionnee}
                  src={obtenirUrlImage(imagesProduit[indexImageSelectionnee])}
                  alt={produit.name}
                  className="w-full h-80 object-contain rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onError={(e) => {
                    const cible = e.target as HTMLImageElement;
                    cible.src = '/placeholder.svg';
                  }}
                />
              </AnimatePresence>
              
              {promotionActive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  -{produit.promotion}%
                </div>
              )}
            </div>

            {imagesProduit.length > 1 && (
              <div className="flex gap-2 justify-center">
                {imagesProduit.slice(0, 4).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setIndexImageSelectionnee(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                      index === indexImageSelectionnee ? 'border-red-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={obtenirUrlImage(image)}
                      alt={`${produit.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const cible = e.target as HTMLImageElement;
                        cible.src = '/placeholder.svg';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {produit.category}
                </Badge>
                {estNouveau && (
                  <Badge className="bg-blue-600 text-white text-xs">Nouveau</Badge>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold">{produit.name}</DialogTitle>
            </DialogHeader>

            {promotionActive ? (
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <p className="text-lg text-gray-500 line-through">
                    {typeof produit.originalPrice === 'number'
                      ? produit.originalPrice.toFixed(2)
                      : produit.price.toFixed(2)} €
                  </p>
                  <span className="bg-red-600 text-white px-2 py-0.5 text-xs font-bold rounded">
                    -{produit.promotion}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {produit.price.toFixed(2)} €
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-4">
                {produit.price.toFixed(2)} €
              </p>
            )}

            <div className="mb-4 max-h-24 overflow-y-auto text-sm text-gray-700">
              {produit.description}
            </div>

            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">Disponibilité:</p>
                <span className={enStock ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
                  {enStock ? 'En stock' : 'Rupture de stock'}
                </span>
              </div>

              {produit.stock !== undefined && (
                <p className="text-sm text-gray-600">
                  {produit.stock} unité{produit.stock !== 1 ? 's' : ''} disponible{produit.stock !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantite(Math.max(1, quantite - 1))}
                  disabled={quantite <= 1}
                  className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                >
                  -
                </button>
                <span className="px-4 py-1 border-x border-gray-300 min-w-[40px] text-center">
                  {quantite}
                </span>
                <button
                  onClick={() => setQuantite(quantite + 1)}
                  disabled={produit.stock !== undefined && quantite >= produit.stock}
                  className="px-3 py-1 text-gray-600 disabled:text-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                onClick={gererAjoutPanier} 
                disabled={!enStock}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Ajouter au panier
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={gererBasculerFavori}
                className="rounded-full"
              >
                <Heart
                  className={`h-4 w-4 ${estFavori(produit.id) ? 'fill-red-500 text-red-500' : ''}`}
                />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const url = window.location.origin + `/${getSecureProductId(produit.id)}`;
                  navigator.clipboard.writeText(url);
                  toast.success("Lien copié!");
                }}
                className="rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button variant="link" asChild>
                <Link to={`/${getSecureProductId(produit.id)}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir la page produit
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalVueRapideProduit;
