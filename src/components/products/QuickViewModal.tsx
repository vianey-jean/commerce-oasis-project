
import React, { useState, useRef, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Heart, Star, Package, Truck, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { utiliserMagasin } from '@/contexts/StoreContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types/product';
import { toast } from '@/components/ui/sonner';
import { obtenirIdSecurise } from '@/services/secureIds';

interface ProprietesModalVueRapide {
  produit: Product;
  estOuverte: boolean;
  fermer: () => void;
}

const ModalVueRapide: React.FC<ProprietesModalVueRapide> = ({ produit, estOuverte, fermer }) => {
  const [quantite, setQuantite] = useState(1);
  const [imageSelectionnee, setImageSelectionnee] = useState(0);
  const refModal = useRef<HTMLDivElement>(null);
  const { ajouterAuPanier, basculerFavori, estFavori } = utiliserMagasin();
  const { isAuthenticated: estAuthentifie } = useAuth();
  const URL_BASE_API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (estOuverte) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [estOuverte]);

  const gererClicExterieur = (e: React.MouseEvent<HTMLDivElement>) => {
    if (refModal.current && !refModal.current.contains(e.target as Node)) {
      fermer();
    }
  };

  const gererAjoutPanier = () => {
    if (!estAuthentifie) {
      toast.error("Vous devez être connecté pour ajouter un produit au panier");
      return;
    }
    ajouterAuPanier(produit, quantite);
    toast.success(`${quantite} ${produit.name} ajouté${quantite > 1 ? 's' : ''} au panier`);
    fermer();
  };

  const gererBasculeFavori = () => {
    if (!estAuthentifie) {
      toast.error("Vous devez être connecté pour ajouter aux favoris");
      return;
    }
    basculerFavori(produit);
  };

  const obtenirUrlImageSecurisee = (cheminImage: string) => {
    if (!cheminImage) return '/placeholder.svg';
    if (cheminImage.startsWith('http')) return cheminImage;
    return `${URL_BASE_API}${cheminImage}`;
  };

  const obtenirUrlProduitSecurisee = (idProduit: string) => {
    return `/produit/${obtenirIdSecurise(idProduit)}`;
  };

  if (!estOuverte) return null;

  const images = produit.images && produit.images.length > 0 ? produit.images : [produit.image];
  const prixPromo = produit.promotion ? produit.price * (1 - produit.promotion / 100) : produit.price;
  const economie = produit.promotion ? produit.price - prixPromo : 0;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={gererClicExterieur}>
      <div ref={refModal} className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-xl font-bold truncate">{produit.name}</h2>
          <Button variant="ghost" size="sm" onClick={fermer} className="shrink-0">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={obtenirUrlImageSecurisee(images[imageSelectionnee])}
                  alt={produit.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setImageSelectionnee(index)}
                      className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === imageSelectionnee ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={obtenirUrlImageSecurisee(image)}
                        alt={`${produit.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{produit.category}</Badge>
                  {produit.promotion && (
                    <Badge variant="destructive">-{produit.promotion}%</Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 ml-2">(4.8)</span>
                </div>

                <div className="space-y-2">
                  {produit.promotion ? (
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-red-600">
                          {prixPromo.toFixed(2)} €
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          {produit.price.toFixed(2)} €
                        </span>
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        Vous économisez {economie.toFixed(2)} €
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-gray-800">
                      {produit.price.toFixed(2)} €
                    </div>
                  )}
                </div>
              </div>

              {produit.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{produit.description}</p>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium">Stock disponible</div>
                  <div className="text-gray-600">{produit.stock || 'En stock'}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantité:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantite(Math.max(1, quantite - 1))}
                      disabled={quantite <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantite}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantite(quantite + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-red-600 hover:bg-red-700" 
                    onClick={gererAjoutPanier}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={gererBasculeFavori}
                    className={estFavori(produit.id) ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${estFavori(produit.id) ? 'fill-red-500' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Livraison gratuite à partir de 50€</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Shield className="h-4 w-4" />
                  <span>Garantie satisfait ou remboursé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVueRapide;
