
import { format, isToday } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '@/services/AppointmentService';
import CalendarAppointment from './CalendarAppointment';

/**
 * Props pour un jour du calendrier
 */
type CalendarDayProps = {
  day: Date;
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
};

/**
 * Composant pour afficher un jour dans le calendrier hebdomadaire
 * avec tous les rendez-vous associés à ce jour
 */
const CalendarDay = ({ day, appointments, onAppointmentClick }: CalendarDayProps) => {
  // Trier les rendez-vous par heure
  const sortedAppointments = [...appointments].sort((a, b) => {
    const [aHours, aMinutes] = a.heure.split(':').map(Number);
    const [bHours, bMinutes] = b.heure.split(':').map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  // Classe CSS conditionnelle pour mettre en évidence le jour actuel
  const dayClass = isToday(day) ? 'bg-blue-50' : '';

  return (
    <div className={`p-1 border-r last:border-r-0 card-3d ${dayClass}`}>
      {sortedAppointments.length > 0 ? (
        <div className="space-y-1">
          {sortedAppointments.map((appointment) => (
            <CalendarAppointment 
              key={appointment.id} 
              appointment={appointment} 
              onClick={onAppointmentClick} 
            />
          ))}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-xs text-gray-400">Aucun rendez-vous</p>
        </div>
      )}
    </div>
  );
};

export default CalendarDay;
