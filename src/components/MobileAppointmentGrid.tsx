
import React from 'react';
import { Appointment } from '@/services/AppointmentService';
import { Clock, MapPin, User, Phone, Calendar, Star, Sparkles } from 'lucide-react';

interface MobileAppointmentGridProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDragStart?: (appointment: Appointment, e: React.DragEvent) => void;
  enableDragAndDrop?: boolean;
}

const MobileAppointmentGrid: React.FC<MobileAppointmentGridProps> = ({
  appointments,
  onAppointmentClick,
  onDragStart,
  enableDragAndDrop = true
}) => {
  const handleDragStart = (appointment: Appointment, e: React.DragEvent) => {
    if (!enableDragAndDrop) {
      e.preventDefault();
      return;
    }
    
    console.log('Drag start for appointment:', appointment.titre);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) {
      onDragStart(appointment, e);
    }
  };

  const handleClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    onAppointmentClick(appointment);
  };

  // Trier les rendez-vous par heure
  const sortedAppointments = [...appointments].sort((a, b) => {
    const [aHours, aMinutes] = a.heure.split(':').map(Number);
    const [bHours, bMinutes] = b.heure.split(':').map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  return (
    <div className="grid grid-cols-2 gap-2 p-2">
      {sortedAppointments.map((appointment) => (
        <div
          key={appointment.id}
          draggable={enableDragAndDrop}
          onDragStart={enableDragAndDrop ? (e) => handleDragStart(appointment, e) : undefined}
          onClick={(e) => handleClick(appointment, e)}
          className={`group relative appointment-luxury text-white rounded-xl premium-shadow overflow-hidden glow-effect aspect-square flex flex-col justify-between p-3 ${
            enableDragAndDrop ? 'cursor-grab active:cursor-grabbing premium-hover' : 'cursor-pointer'
          }`}
          style={{ userSelect: 'none' }}
        >
          {/* Luxury background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute top-1 right-1 w-8 h-8 bg-white/10 rounded-full blur-lg"></div>
          
          {/* Premium border effect */}
          <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
          
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Header avec titre et heure */}
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-4 h-4 bg-white/20 rounded flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                  <Calendar className="w-2 h-2 text-white" />
                </div>
                <p className="font-bold text-xs text-white group-hover:text-white/90 transition-colors truncate">
                  {appointment.titre}
                </p>
              </div>
              
              {/* Heure */}
              <div className="flex items-center gap-1 mb-2">
                <Clock className="w-3 h-3 text-white/90 flex-shrink-0" />
                <span className="text-xs text-white/90 font-medium">{appointment.heure}</span>
              </div>
              
              {/* Nom/Prénom */}
              {(appointment.nom || appointment.prenom) && (
                <div className="flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-white/90 flex-shrink-0" />
                  <p className="text-xs text-white/90 truncate font-medium">
                    {appointment.prenom} {appointment.nom}
                  </p>
                </div>
              )}
            </div>

            {/* Footer avec location */}
            <div className="mt-auto">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/90 flex-shrink-0" />
                <p className="text-xs text-white/90 truncate font-medium">{appointment.location}</p>
              </div>
            </div>
          </div>
          
          {/* Premium hover indicators */}
          <div className="absolute bottom-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-yellow-400 rounded-full animate-pulse delay-75"></div>
          </div>
          
          {/* Luxury shine effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
        </div>
      ))}
    </div>
  );
};

export default MobileAppointmentGrid;
