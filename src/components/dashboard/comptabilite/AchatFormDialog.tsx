import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ShoppingCart, DollarSign, Package, Receipt, CheckCircle, Calculator, Plus } from 'lucide-react';
import { Product } from '@/types/product';
import { NouvelleAchatFormData } from '@/types/comptabilite';

interface AchatFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
  onSubmit: (data: NouvelleAchatFormData, selectedProduct: Product | null) => Promise<void>;
  formatEuro: (value: number) => string;
}

export const AchatFormDialog: React.FC<AchatFormDialogProps> = ({
  open,
  onOpenChange,
  products,
  onSubmit,
  formatEuro
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductList, setShowProductList] = useState(false);
  const [achatForm, setAchatForm] = useState<NouvelleAchatFormData>({
    productDescription: '',
    purchasePrice: 0,
    quantity: 0,
    fournisseur: '',
    caracteristiques: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrer les produits pour la recherche
  const filteredProducts = searchTerm.length >= 3 && showProductList
    ? products.filter(p => p.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product.description);
    setShowProductList(false);
    setAchatForm(prev => ({
      ...prev,
      productId: product.id,
      productDescription: product.description,
      purchasePrice: 0,
      quantity: 0,
      fournisseur: prev.fournisseur || '',
      caracteristiques: prev.caracteristiques || product.description
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowProductList(value.length >= 3);
    if (value.length < 3) {
      setSelectedProduct(null);
    }
  };

  const handleFormChange = (field: keyof NouvelleAchatFormData, value: string | number) => {
    setAchatForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!achatForm.productDescription || achatForm.quantity <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(achatForm, selectedProduct);
      // Reset form
      setAchatForm({
        productDescription: '',
        purchasePrice: 0,
        quantity: 0,
        fournisseur: '',
        caracteristiques: ''
      });
      setSelectedProduct(null);
      setSearchTerm('');
      setShowProductList(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setAchatForm({
      productDescription: '',
      purchasePrice: 0,
      quantity: 0,
      fournisseur: '',
      caracteristiques: ''
    });
    setSelectedProduct(null);
    setSearchTerm('');
    setShowProductList(false);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            Nouvel Achat Produit
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Enregistrez un nouvel achat de produit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Recherche de produit */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              <Search className="h-4 w-4 inline mr-2" />
              Rechercher un produit
            </Label>
            <div className="relative">
              <Input
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Tapez au moins 3 caractères..."
                className="bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-600"
              />
              {filteredProducts.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-between"
                    >
                      <span className="font-medium">{product.description}</span>
                      <Badge variant="outline">{formatEuro(product.purchasePrice)}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {selectedProduct && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                {selectedProduct.description} sélectionné
              </Badge>
            )}
          </div>

          {/* Description produit */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
              {selectedProduct ? '✏️ Modifier le nom du produit' : 'Ou créer un nouveau produit'}
            </Label>
            <Input
              value={achatForm.productDescription}
              onChange={(e) => handleFormChange('productDescription', e.target.value)}
              placeholder="Description du produit"
              className="bg-white/80 dark:bg-gray-800/80"
            />
            {selectedProduct && achatForm.productDescription !== selectedProduct.description && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                ⚠️ Le nom sera modifié de "{selectedProduct.description}" à "{achatForm.productDescription}"
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Prix d'achat */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                  Prix d'achat (€)
                </Label>
                {selectedProduct && (
                  <span className="text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full border border-red-200 dark:border-red-700">
                    Actuel: {formatEuro(selectedProduct.purchasePrice)}
                  </span>
                )}
              </div>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={achatForm.purchasePrice || ''}
                onChange={(e) => handleFormChange('purchasePrice', parseFloat(e.target.value) || 0)}
                placeholder={selectedProduct ? "Nouveau prix (optionnel)" : "Prix d'achat"}
                className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-emerald-500 rounded-xl text-lg font-medium"
              />
              {selectedProduct && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                  💡 Laissez vide pour garder le prix actuel
                </p>
              )}
            </div>
            
            {/* Quantité */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-500" />
                  Quantité à ajouter *
                </Label>
                {selectedProduct && (
                  <span className="text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full border border-red-200 dark:border-red-700">
                    Stock: {selectedProduct.quantity}
                  </span>
                )}
              </div>
              <Input
                type="number"
                min="1"
                value={achatForm.quantity || ''}
                onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 0)}
                placeholder="Quantité à ajouter"
                className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 rounded-xl text-lg font-medium"
              />
              {selectedProduct && achatForm.quantity > 0 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  ✓ Nouveau stock: {selectedProduct.quantity + achatForm.quantity} unités
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-purple-500" />
                Fournisseur
              </Label>
              <Input
                value={achatForm.fournisseur || ''}
                onChange={(e) => handleFormChange('fournisseur', e.target.value)}
                placeholder="Nom du fournisseur"
                className="h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-purple-500 rounded-xl font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Receipt className="h-4 w-4 text-indigo-500" />
                Caractéristiques
              </Label>
              <Textarea
                value={achatForm.caracteristiques || ''}
                onChange={(e) => handleFormChange('caracteristiques', e.target.value)}
                placeholder="Caractéristiques du produit..."
                className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 rounded-xl font-medium resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Résumé du coût */}
          {achatForm.quantity > 0 && (
            <Card className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border-emerald-500/30 shadow-lg">
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-emerald-600" />
                    <span className="font-bold text-gray-800 dark:text-gray-100">Coût total de cet achat:</span>
                  </div>
                  <span className="text-2xl font-black text-emerald-800 dark:text-emerald-400">
                    {formatEuro((achatForm.purchasePrice > 0 ? achatForm.purchasePrice : (selectedProduct?.purchasePrice || 0)) * achatForm.quantity)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-12 px-6 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!achatForm.productDescription || achatForm.quantity <= 0 || isSubmitting}
            className="h-12 px-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white shadow-xl rounded-xl font-bold text-base disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Enregistrement...' : "Enregistrer l'achat"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AchatFormDialog;
