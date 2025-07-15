
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Star } from 'lucide-react';

/**
 * Props pour l'en-tête d'un jour du calendrier
 */
type CalendarDayHeaderProps = {
  day: Date;
};

/**
 * Composant pour afficher l'en-tête d'un jour dans le calendrier avec design moderne
 */
const CalendarDayHeader = ({ day }: CalendarDayHeaderProps) => {
  const isCurrentDay = isToday(day);
  
  return (
    <div className={`p-4 text-center border-r last:border-r-0 relative transition-all duration-300 ${
      isCurrentDay 
        ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg transform scale-105 z-10' 
        : 'bg-gradient-to-br from-gray-50 to-white hover:from-violet-50 hover:to-purple-50 text-gray-700'
    }`}>
      {isCurrentDay && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-t-lg"></div>
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-center gap-1 mb-2">
          {isCurrentDay && <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />}
          <p className={`font-bold text-sm uppercase tracking-wide ${
            isCurrentDay ? 'text-white' : 'text-gray-600'
          }`}>
            {format(day, 'EEE', { locale: fr })}
          </p>
          {isCurrentDay && <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />}
        </div>
        
        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all duration-300 ${
          isCurrentDay
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/30'
            : 'hover:bg-violet-100 hover:text-violet-700'
        }`}>
          {format(day, 'd', { locale: fr })}
        </div>
        
        {isCurrentDay && (
          <div className="mt-2 flex items-center justify-center">
            <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
      
      {isCurrentDay && (
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-violet-500"></div>
      )}
    </div>
  );
};

export default CalendarDayHeader;
