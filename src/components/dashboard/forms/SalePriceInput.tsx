
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Euro, TrendingUp, AlertTriangle } from 'lucide-react';

interface SalePriceInputProps {
  price: string;
  onChange: (price: string) => void;
  disabled: boolean;
  isProfitNegative?: boolean;
}

/**
 * Composant moderne pour la saisie du prix de vente
 */
const SalePriceInput: React.FC<SalePriceInputProps> = ({
  price,
  onChange,
  disabled,
  isProfitNegative = false,
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="sellingPrice" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Euro className="w-4 h-4 text-green-500" />
        Prix de vente
      </Label>
      <div className="relative">
        <Input
          id="sellingPrice"
          name="sellingPrice"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`pl-4 pr-12 py-3 rounded-xl border-2 transition-all duration-300 ${
            isProfitNegative 
              ? "border-red-300 focus:border-red-500 bg-red-50 focus:ring-4 focus:ring-red-100" 
              : "border-gray-200 focus:border-green-500 hover:border-green-300 focus:ring-4 focus:ring-green-100"
          }`}
          placeholder="0.00"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          <span className="text-gray-400 text-sm">€</span>
          {isProfitNegative ? (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-green-500" />
          )}
        </div>
      </div>
      {isProfitNegative && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Attention ! Le prix de vente est trop bas, vous allez faire une perte.
          </p>
        </div>
      )}
    </div>
  );
};

export default SalePriceInput;
