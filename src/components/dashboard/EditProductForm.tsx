
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { productService } from '@/service/api';
import { Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import ProductSearchInput from './ProductSearchInput';
import { Edit3, Package, Euro, Hash, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface EditProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    id: '',
    description: '',
    purchasePrice: 0,
    quantity: 0,
    additionalQuantity: 0
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        id: selectedProduct.id,
        description: selectedProduct.description,
        purchasePrice: selectedProduct.purchasePrice,
        quantity: selectedProduct.quantity,
        additionalQuantity: 0
      });
    }
  }, [selectedProduct]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'description' ? value : Number(value)
    });
  };
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    console.log("Product selected:", product);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit d'abord",
        variant: "destructive"
      });
      return;
    }
    
    // Confirm before updating
    if (!window.confirm("Voulez-vous vraiment modifier ce produit?")) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create updated product with total quantity
      const updatedProduct = {
        id: formData.id,
        description: formData.description,
        purchasePrice: formData.purchasePrice,
        quantity: formData.quantity + formData.additionalQuantity
      };
      
      // Update product
      await productService.updateProduct(updatedProduct);
      
      toast({
        title: "Succès",
        description: "Le produit a été modifié avec succès",
        className: "notification-success"
      });
      
      // Close dialog
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la modification du produit",
        variant: "destructive"
      });
      console.error("Error updating product:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-2xl">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
            <Edit3 className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Modifier un produit
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Recherche de produit */}
          <div className="space-y-3">
            <Label htmlFor="search" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Search className="w-4 h-4 text-blue-500" />
              Rechercher un produit
            </Label>
            <div className="relative">
              <ProductSearchInput
                onProductSelect={handleSelectProduct}
                placeholder="Tapez au moins 3 caractères pour rechercher..."
              />
              {selectedProduct && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              )}
            </div>
          </div>
          
          {selectedProduct && (
            <div className="space-y-6 p-4 bg-white rounded-xl border-2 border-amber-100 shadow-sm">
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Package className="w-4 h-4 text-purple-500" />
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="rounded-xl border-2 border-gray-200 focus:border-purple-500 hover:border-purple-300 transition-all duration-300 focus:ring-4 focus:ring-purple-100"
                />
              </div>
              
              {/* Prix d'achat */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Euro className="w-4 h-4 text-green-500" />
                  Prix d'achat
                </Label>
                <div className="relative">
                  <Input
                    id="purchasePrice"
                    name="purchasePrice"
                    type="number"
                    step="0.01"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className="pr-8 rounded-xl border-2 border-gray-200 focus:border-green-500 hover:border-green-300 transition-all duration-300 focus:ring-4 focus:ring-green-100"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">€</span>
                </div>
              </div>
              
              {/* Quantité actuelle */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Hash className="w-4 h-4 text-blue-500" />
                  Quantité actuelle
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  readOnly
                  className="bg-gray-100 border-2 border-gray-200 rounded-xl cursor-not-allowed"
                />
              </div>
              
              {/* Quantité à ajouter */}
              <div className="space-y-2">
                <Label htmlFor="additionalQuantity" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  Ajouter quantité
                </Label>
                <Input
                  id="additionalQuantity"
                  name="additionalQuantity"
                  type="number"
                  value={formData.additionalQuantity}
                  onChange={handleChange}
                  className="rounded-xl border-2 border-gray-200 focus:border-orange-500 hover:border-orange-300 transition-all duration-300 focus:ring-4 focus:ring-orange-100"
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700 font-medium">
                    Quantité totale après modification: <span className="font-bold">{formData.quantity + formData.additionalQuantity}</span>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={!selectedProduct || isLoading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Modification...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4" />
                  Modifier le produit
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductForm;
