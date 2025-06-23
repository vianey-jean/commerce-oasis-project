
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Package, Euro, Hash, Sparkles, CheckCircle } from 'lucide-react';

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useApp();
  const [formData, setFormData] = useState({
    description: '',
    purchasePrice: '',
    quantity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!formData.description) {
      newErrors.description = 'La description est requise';
    }
    
    if (!formData.purchasePrice) {
      newErrors.purchasePrice = 'Le prix d\'achat est requis';
    } else if (isNaN(Number(formData.purchasePrice)) || Number(formData.purchasePrice) <= 0) {
      newErrors.purchasePrice = 'Le prix d\'achat doit être un nombre positif';
    }
    
    if (!formData.quantity) {
      newErrors.quantity = 'La quantité est requise';
    } else if (isNaN(Number(formData.quantity)) || !Number.isInteger(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'La quantité doit être un nombre entier positif';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await addProduct({
        description: formData.description,
        purchasePrice: Number(formData.purchasePrice),
        quantity: Number(formData.quantity),
      });
      
      // Reset form and close dialog
      setFormData({
        description: '',
        purchasePrice: '',
        quantity: '',
      });
      
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-2xl">
        <DialogHeader className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ajouter un produit
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Enrichissez votre inventaire avec un nouveau produit
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Sparkles className="w-4 h-4 text-purple-500" />
                Description du produit
              </Label>
              <div className="relative">
                <Input
                  id="description"
                  name="description"
                  placeholder="Ex: T-shirt coton bio premium"
                  value={formData.description}
                  onChange={handleChange}
                  className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                    errors.description 
                      ? "border-red-300 focus:border-red-500 bg-red-50" 
                      : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                  } focus:ring-4 focus:ring-blue-100`}
                />
                {!errors.description && formData.description && (
                  <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">!</span>
                  {errors.description}
                </p>
              )}
            </div>
            
            {/* Prix et Quantité */}
            <div className="grid grid-cols-2 gap-4">
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
                    min="0"
                    placeholder="0.00"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    className={`pl-4 pr-8 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.purchasePrice 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-green-500 hover:border-green-300"
                    } focus:ring-4 focus:ring-green-100`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">€</span>
                  {!errors.purchasePrice && formData.purchasePrice && (
                    <CheckCircle className="absolute right-8 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {errors.purchasePrice && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">!</span>
                    {errors.purchasePrice}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Hash className="w-4 h-4 text-blue-500" />
                  Quantité
                </Label>
                <div className="relative">
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`pl-4 pr-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                      errors.quantity 
                        ? "border-red-300 focus:border-red-500 bg-red-50" 
                        : "border-gray-200 focus:border-blue-500 hover:border-blue-300"
                    } focus:ring-4 focus:ring-blue-100`}
                  />
                  {!errors.quantity && formData.quantity && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
                {errors.quantity && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">!</span>
                    {errors.quantity}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter className="gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enregistrement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Ajouter le produit
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductForm;
