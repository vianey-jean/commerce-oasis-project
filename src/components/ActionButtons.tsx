
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search, Sparkles, Crown } from 'lucide-react';

/**
 * Props pour les boutons d'action
 */
type ActionButtonsProps = {
  onAdd: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSearch: () => void;
};

/**
 * Composant pour afficher les boutons d'action du tableau de bord
 * Permet d'ajouter, modifier, supprimer et rechercher des rendez-vous
 */
const ActionButtons = ({ onAdd, onEdit, onDelete, onSearch }: ActionButtonsProps) => {
  return (
    <div className="mb-8 flex flex-wrap gap-4 justify-center">
      <Button 
        className="group flex items-center gap-3 btn-premium premium-shadow-lg rounded-2xl px-8 py-4 text-base font-semibold tracking-wide glow-effect premium-hover" 
        onClick={onAdd}
      >
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <PlusCircle className="h-4 w-4" />
        </div>
        Ajouter un rendez-vous
        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <Button 
        variant="outline"
        className="group flex items-center gap-3 luxury-card premium-shadow rounded-2xl px-8 py-4 text-base font-semibold tracking-wide border-2 border-primary/20 hover:border-primary/40 text-primary hover:text-primary/80 premium-hover glow-effect" 
        onClick={onEdit}
      >
        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
          <Edit className="h-4 w-4" />
        </div>
        Modifier un rendez-vous
        <Crown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <Button 
        variant="destructive" 
        className="group flex items-center gap-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 premium-shadow-lg rounded-2xl px-8 py-4 text-base font-semibold tracking-wide premium-hover glow-effect" 
        onClick={onDelete}
      >
        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
          <Trash2 className="h-4 w-4" />
        </div>
        Supprimer un rendez-vous
        <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>

      <Button 
        variant="outline"
        className="group flex items-center gap-3 luxury-card premium-shadow rounded-2xl px-8 py-4 text-base font-semibold tracking-wide border-2 border-purple-300 hover:border-purple-400 text-purple-600 hover:text-purple-700 premium-hover glow-effect" 
        onClick={onSearch}
      >
        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
          <Search className="h-4 w-4" />
        </div>
        Rechercher un rendez-vous
        <Crown className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Button>
    </div>
  );
};

export default ActionButtons;
