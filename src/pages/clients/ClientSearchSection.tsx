/**
 * ClientSearchSection - Barre de recherche (style glassmorphism pointage)
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

interface ClientSearchSectionProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredCount: number;
}

const ClientSearchSection: React.FC<ClientSearchSectionProps> = ({
  searchQuery,
  setSearchQuery,
  filteredCount,
}) => {
  return (
    <div className="mb-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un client (min. 3 caractères)..."
          className="pl-10 pr-10 py-3 bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-xl shadow-lg focus:shadow-xl focus:border-violet-400/50 dark:focus:border-violet-500/50 transition-all duration-300 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {searchQuery.length >= 3 && (
        <p className="mt-2 text-xs font-medium text-violet-600 dark:text-violet-400">
          {filteredCount} résultat{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''}
        </p>
      )}
      {searchQuery.length > 0 && searchQuery.length < 3 && (
        <p className="mt-2 text-xs font-medium text-amber-600 dark:text-amber-400">
          Saisissez au moins 3 caractères
        </p>
      )}
    </div>
  );
};

export default ClientSearchSection;
