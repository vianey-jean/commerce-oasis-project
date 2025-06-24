import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '@/services/AppointmentService';
import CalendarAppointment from './CalendarAppointment';
import { Calendar, Plus } from 'lucide-react';

/**
 * Props pour un jour du calendrier
 */
type CalendarDayProps = {
  day: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
};

/**
 * Composant pour afficher un jour dans le calendrier hebdomadaire moderne
 * avec tous les rendez-vous associés à ce jour
 */
const CalendarDay = ({ day, appointments, onAppointmentClick }: CalendarDayProps) => {
  // Trier les rendez-vous par heure
  const sortedAppointments = [...appointments].sort((a, b) => {
    const [aHours, aMinutes] = a.heure.split(':').map(Number);
    const [bHours, bMinutes] = b.heure.split(':').map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  const isCurrentDay = isToday(day);

  return (
    <div className={`p-3 border-r last:border-r-0 min-h-[350px] transition-all duration-300 relative group ${
      isCurrentDay 
        ? 'bg-gradient-to-br from-violet-50/80 to-purple-50/80 border-violet-200' 
        : 'hover:bg-gradient-to-br hover:from-gray-50/50 hover:to-violet-50/30'
    }`}>
      
      {/* Indicator pour le jour actuel */}
      {isCurrentDay && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-violet-400 rounded-full animate-ping"></div>
        </div>
      )}

      {sortedAppointments.length > 0 ? (
        <div className="space-y-2">
          {sortedAppointments.map((appointment) => (
            <CalendarAppointment 
              key={appointment.id} 
              appointment={appointment} 
              onClick={onAppointmentClick} 
            />
          ))}
          
          {/* Indicator pour plus de rendez-vous */}
          {sortedAppointments.length > 3 && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1 text-xs text-violet-600 bg-violet-100 px-2 py-1 rounded-full">
                <Plus className="w-3 h-3" />
                <span>{sortedAppointments.length - 3} autres</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center text-center py-8">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
            isCurrentDay 
              ? 'bg-gradient-to-br from-violet-100 to-purple-100' 
              : 'bg-gray-100 group-hover:bg-violet-100'
          }`}>
            <Calendar className={`w-5 h-5 ${
              isCurrentDay ? 'text-violet-600' : 'text-gray-400 group-hover:text-violet-500'
            }`} />
          </div>
          <p className={`text-xs font-medium ${
            isCurrentDay ? 'text-violet-600' : 'text-gray-400 group-hover:text-violet-500'
          }`}>
            Aucun rendez-vous
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Journée libre
          </p>
        </div>
      )}

      {/* Hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-purple-500/0 group-hover:from-violet-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none rounded-lg"></div>
    </div>
  );
};

export default CalendarDay;
