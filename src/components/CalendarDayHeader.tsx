
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Props pour l'en-tête d'un jour du calendrier
 */
type CalendarDayHeaderProps = {
  day: Date;
};

/**
 * Composant pour afficher l'en-tête d'un jour dans le calendrier
 * Affiche le jour de la semaine et la date
 */
const CalendarDayHeader = ({ day }: CalendarDayHeaderProps) => {
  // Classe CSS conditionnelle pour mettre en évidence le jour actuel
  const dayClass = isToday(day) ? 'bg-blue-50' : '';
  
  return (
    <div className={`p-2 text-center border-r last:border-r-0 ${dayClass}`}>
      <p className="font-medium">{format(day, 'EEE', { locale: fr })}</p>
      <p
        className={`text-sm ${
          isToday(day)
            ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto'
            : ''
        }`}
      >
        {format(day, 'd', { locale: fr })}
      </p>
    </div>
  );
};

export default CalendarDayHeader;
