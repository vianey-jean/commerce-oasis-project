
import { Appointment } from '@/services/AppointmentService';
import { Clock, MapPin, Sparkles, Calendar, Star } from 'lucide-react';

/**
 * Props pour un rendez-vous dans le calendrier
 */
type CalendarAppointmentProps = {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  onDragStart?: (appointment: Appointment, e: React.DragEvent) => void;
};

/**
 * Composant pour afficher un rendez-vous dans le calendrier avec design moderne et drag & drop
 */
const CalendarAppointment = ({ appointment, onClick, onDragStart }: CalendarAppointmentProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    console.log('Drag start for appointment:', appointment.titre);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(appointment, e);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(appointment);
  };

  return (
    <div
      draggable={true}
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="group relative p-4 appointment-luxury text-white rounded-2xl premium-shadow cursor-grab active:cursor-grabbing premium-hover overflow-hidden glow-effect"
      style={{ userSelect: 'none' }}
    >
      {/* Luxury background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/5 rounded-full blur-lg"></div>
      
      {/* Premium border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
      
      <div className="relative z-10">
        {/* Title avec icon premium */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-white flex-shrink-0" />
          </div>
          <p className="font-bold text-sm text-white group-hover:text-white/90 transition-colors truncate flex-1">
            {appointment.titre}
          </p>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <Sparkles className="w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
          </div>
        </div>
        
        {/* Time avec style premium */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
            <Clock className="w-3 h-3 text-white/90 flex-shrink-0" />
          </div>
          <p className="text-xs text-white/90 font-medium tracking-wide">{appointment.heure}</p>
        </div>
        
        {/* Location avec effet premium */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
            <MapPin className="w-3 h-3 text-white/90 flex-shrink-0" />
          </div>
          <p className="text-xs text-white/90 truncate font-medium">{appointment.location}</p>
        </div>
      </div>
      
      {/* Premium hover indicators */}
      <div className="absolute bottom-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-1 h-1 bg-yellow-200 rounded-full animate-pulse delay-150"></div>
      </div>
      
      {/* Luxury shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default CalendarAppointment;
