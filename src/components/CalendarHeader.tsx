
import { ArrowLeft, ArrowRight } from 'lucide-react';

/**
 * Props pour l'en-tête du calendrier
 */
type CalendarHeaderProps = {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Composant pour l'en-tête du calendrier avec contrôles de navigation
 */
const CalendarHeader = ({ title, onPrevious, onNext }: CalendarHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="flex space-x-2">
        <button
          onClick={onPrevious}
          className="px-3 py-1 rounded border hover:bg-gray-100 flex items-center card-3d"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Précédent
        </button>
        <button
          onClick={onNext}
          className="px-3 py-1 rounded border hover:bg-gray-100 flex items-center card-3d"
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Suivant
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
