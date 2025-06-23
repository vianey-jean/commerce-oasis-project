
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, Package, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SaleQuantityInputProps {
  quantity: string;
  maxQuantity: number;
  onChange: (quantity: string) => void;
  disabled?: boolean;
  showAvailableStock?: boolean;
}

/**
 * Composant moderne pour gérer la saisie de la quantité vendue
 */
const SaleQuantityInput: React.FC<SaleQuantityInputProps> = ({ 
  quantity, 
  maxQuantity, 
  onChange, 
  disabled = false,
  showAvailableStock = true
}) => {
  const { toast } = useToast();

  const handleQuantityChange = (increment: boolean) => {
    const currentQty = Number(quantity);
    let newQty = increment ? currentQty + 1 : currentQty - 1;

    if (newQty < 1) newQty = 1;
    
    if (increment && newQty > maxQuantity) {
      toast({
        title: "Stock insuffisant",
        description: `Stock disponible: ${maxQuantity} unités`,
        variant: "destructive",
      });
      return;
    }

    onChange(newQty.toString());
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="quantitySold" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Package className="w-4 h-4 text-blue-500" />
        Quantité vendue
      </Label>
      
      <div className="flex items-center space-x-3">
        {/* Bouton diminuer */}
        <Button 
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(false)}
          disabled={disabled || Number(quantity) <= 1}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
        >
          <Minus className="h-4 w-4 text-red-500" />
        </Button>
        
        {/* Champ de quantité */}
        <div className="flex-1 relative">
          <Input
            id="quantitySold"
            name="quantitySold"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => {
              const numValue = Number(e.target.value);
              
              if (numValue > maxQuantity) {
                toast({
                  title: "Stock insuffisant",
                  description: `Stock disponible: ${maxQuantity} unités`,
                  variant: "destructive",
                });
                return;
              }
              
              onChange(e.target.value);
            }}
            disabled={disabled}
            className="text-center text-lg font-semibold rounded-xl border-2 border-gray-200 focus:border-blue-500 hover:border-blue-300 transition-all duration-300 focus:ring-4 focus:ring-blue-100"
            placeholder="1"
          />
        </div>
        
        {/* Bouton augmenter */}
        <Button 
          type="button"
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(true)}
          disabled={disabled || Number(quantity) >= maxQuantity}
          className="w-10 h-10 rounded-xl border-2 border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-300 disabled:opacity-50"
        >
          <Plus className="h-4 w-4 text-green-500" />
        </Button>
      </div>
      
      {/* Indicateur de stock */}
      {showAvailableStock && (
        <div className={`flex items-center gap-2 p-3 rounded-lg border ${
          maxQuantity > 10 
            ? 'bg-green-50 border-green-200' 
            : maxQuantity > 0 
              ? 'bg-yellow-50 border-yellow-200'
              : 'bg-red-50 border-red-200'
        }`}>
          <AlertCircle className={`w-4 h-4 ${
            maxQuantity > 10 
              ? 'text-green-500' 
              : maxQuantity > 0 
                ? 'text-yellow-500'
                : 'text-red-500'
          }`} />
          <p className={`text-sm font-medium ${
            maxQuantity > 10 
              ? 'text-green-700' 
              : maxQuantity > 0 
                ? 'text-yellow-700'
                : 'text-red-700'
          }`}>
            Stock disponible: {maxQuantity} unités
          </p>
        </div>
      )}
    </div>
  );
};

export default SaleQuantityInput;
