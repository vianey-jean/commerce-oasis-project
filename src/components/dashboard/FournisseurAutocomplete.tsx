import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fournisseurApiService, Fournisseur } from '@/services/api/fournisseurApi';

interface FournisseurAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const FournisseurAutocomplete: React.FC<FournisseurAutocompleteProps> = ({ value, onChange, error }) => {
  const [suggestions, setSuggestions] = useState<Fournisseur[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isNewFournisseur, setIsNewFournisseur] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchFournisseurs = async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowDropdown(false);
      setIsNewFournisseur(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await fournisseurApiService.search(query);
      setSuggestions(results);
      setShowDropdown(true);
      const exactMatch = results.some(f => f.nom.toLowerCase() === query.toLowerCase());
      setIsNewFournisseur(!exactMatch && query.trim().length > 0);
    } catch (err) {
      console.error('Error searching fournisseurs:', err);
      setSuggestions([]);
      setIsNewFournisseur(query.trim().length > 0);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFournisseurs(val), 300);
  };

  const selectFournisseur = (nom: string) => {
    onChange(nom);
    setShowDropdown(false);
    setIsNewFournisseur(false);
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <Label className="text-sm font-bold text-gray-700 flex items-center gap-2">
        <Truck className="h-4 w-4 text-violet-600" />
        Fournisseur
      </Label>
      <div className="relative group">
        <Input
          placeholder="Rechercher ou ajouter un fournisseur..."
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.length > 0 && setShowDropdown(true)}
          className={cn(
            "h-12 px-4 bg-gradient-to-r from-white to-gray-50/80",
            "border-2 border-gray-200 hover:border-violet-300",
            "focus:border-violet-500 focus:from-violet-50/50 focus:to-white",
            "rounded-xl shadow-sm hover:shadow-md focus:shadow-lg",
            "transition-all duration-300",
            "placeholder:text-gray-400 text-gray-900 font-medium",
            error && "border-red-300 focus:border-red-500 bg-red-50/30"
          )}
        />

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-1 bg-white/95 backdrop-blur-xl border-2 border-violet-100 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
            {isSearching && (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">Recherche...</div>
            )}

            {!isSearching && suggestions.length > 0 && suggestions.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => selectFournisseur(f.nom)}
                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-violet-50 hover:text-violet-700 flex items-center gap-2 transition-colors"
              >
                <Check className="h-4 w-4 text-violet-500" />
                {f.nom}
              </button>
            ))}

            {!isSearching && isNewFournisseur && (
              <button
                type="button"
                onClick={() => selectFournisseur(value.trim())}
                className="w-full px-4 py-3 text-left text-sm font-bold text-emerald-700 bg-emerald-50/50 hover:bg-emerald-100 flex items-center gap-2 transition-colors border-t border-emerald-100"
              >
                <Plus className="h-4 w-4 text-emerald-600" />
                Ajouter "{value.trim()}" comme nouveau fournisseur
              </button>
            )}

            {!isSearching && suggestions.length === 0 && !isNewFournisseur && (
              <div className="px-4 py-3 text-sm text-gray-400 text-center">Aucun résultat</div>
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm font-medium text-red-500 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FournisseurAutocomplete;
