
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, Search } from 'lucide-react';

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
    <div className="mb-6 flex flex-wrap gap-3">
      <Button 
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 card-3d" 
        onClick={onAdd}
      >
        <PlusCircle className="h-4 w-4" />
        Ajouter un rendez-vous
      </Button>

      <Button 
        variant="outline"
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white card-3d" 
        onClick={onEdit}
      >
        <Edit className="h-4 w-4" />
        Modifier un rendez-vous
      </Button>

      <Button 
        variant="destructive" 
        className="flex items-center gap-2 card-3d" 
        onClick={onDelete}
      >
        <Trash2 className="h-4 w-4" />
        Supprimer un rendez-vous
      </Button>

      <Button 
        variant="outline"
        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white card-3d" 
        onClick={onSearch}
      >
        <Search className="h-4 w-4" />
        Rechercher un rendez-vous
      </Button>
    </div>
  );
};

export default ActionButtons;
