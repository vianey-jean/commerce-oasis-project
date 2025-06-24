
import { Appointment } from '@/services/AppointmentService';
import { Clock, MapPin, Sparkles, Calendar } from 'lucide-react';

/**
 * Props pour un rendez-vous dans le calendrier
 */
type CalendarAppointmentProps = {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
};

/**
 * Composant pour afficher un rendez-vous dans le calendrier avec design moderne
 */
const CalendarAppointment = ({ appointment, onClick }: CalendarAppointmentProps) => {
  return (
    <div
      onClick={() => onClick(appointment)}
      className="group relative p-3 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute top-1 right-1 w-8 h-8 bg-white/10 rounded-full blur-sm"></div>
      
      <div className="relative z-10">
        {/* Title avec icon */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-rose-200 flex-shrink-0" />
          <p className="font-bold text-sm truncate group-hover:text-rose-100 transition-colors">
            {appointment.titre}
          </p>
          <Sparkles className="w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Time */}
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-3 h-3 text-rose-200 flex-shrink-0" />
          <p className="text-xs text-rose-100 font-medium">{appointment.heure}</p>
        </div>
        
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-rose-200 flex-shrink-0" />
          <p className="text-xs text-rose-100 truncate">{appointment.location}</p>
        </div>
      </div>
      
      {/* Hover indicator */}
      <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
      
      {/* Border glow effect */}
      <div className="absolute inset-0 rounded-xl border-2 border-white/0 group-hover:border-white/30 transition-all duration-300"></div>
    </div>
  );
};

export default CalendarAppointment;
