
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { AppointmentService, Appointment } from '@/services/AppointmentService';

/**
 * Props du composant de recherche de rendez-vous
 */
type SearchAppointmentFormProps = {
  onSelect: (appointment: Appointment) => void;
};

/**
 * Composant pour rechercher des rendez-vous
 * Permet de saisir un terme de recherche et affiche les résultats
 */
const SearchAppointmentForm = ({ onSelect }: SearchAppointmentFormProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Appointment[]>([]);

  /**
   * Effectue la recherche lorsque l'utilisateur saisit au moins 3 caractères
   */
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 3) {
      try {
        const results = await AppointmentService.search(query);
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Input 
          placeholder="Entrez au moins 3 caractères..." 
          value={searchQuery} 
          onChange={(e) => handleSearch(e.target.value)} 
        />
      </div>

      {searchResults.length > 0 ? (
        <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
          {searchResults.map(appointment => (
            <div 
              key={appointment.id}
              className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelect(appointment)}
            >
              <div className="font-bold">{appointment.titre}</div>
              <div className="text-sm text-gray-500">
                {appointment.date} à {appointment.heure}
              </div>
              <div className="text-sm text-gray-600 truncate">{appointment.description}</div>
            </div>
          ))}
        </div>
      ) : searchQuery.length >= 3 ? (
        <p className="text-gray-500">Aucun résultat trouvé</p>
      ) : null}
    </div>
  );
};

export default SearchAppointmentForm;
