
import { Appointment } from '@/services/AppointmentService';
import { Clock, MapPin, Calendar, Star, User, Phone, Edit, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Props pour un rendez-vous dans le calendrier
 */
type CalendarAppointmentProps = {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
  onDragStart?: (appointment: Appointment, e: React.DragEvent) => void;
  enableDragAndDrop?: boolean;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointment: Appointment) => void;
};

/**
 * Composant pour afficher un rendez-vous dans le calendrier avec design moderne et drag & drop
 */
const CalendarAppointment = ({ 
  appointment, 
  onClick, 
  onDragStart,
  enableDragAndDrop = true,
  onEditAppointment,
  onDeleteAppointment
}: CalendarAppointmentProps) => {
  const isMobile = useIsMobile();
  
  const handleDragStart = (e: React.DragEvent) => {
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(appointment);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditAppointment) {
      onEditAppointment(appointment);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteAppointment) {
      onDeleteAppointment(appointment);
    }
  };

  // Version mobile compacte
  if (isMobile) {
    return (
      <div
        draggable={enableDragAndDrop}
        onDragStart={enableDragAndDrop ? handleDragStart : undefined}
        onClick={handleClick}
        className={`group relative p-3 appointment-luxury text-white rounded-xl premium-shadow overflow-hidden glow-effect ${
          enableDragAndDrop ? 'cursor-grab active:cursor-grabbing premium-hover' : 'cursor-pointer'
        }`}
        style={{ userSelect: 'none' }}
      >
        {/* Luxury background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-1 right-1 w-8 h-8 bg-white/10 rounded-full blur-lg"></div>
        
        {/* Premium border effect */}
        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
        
        {/* Icônes d'actions - visibles seulement si les props sont fournies */}
        {(onEditAppointment || onDeleteAppointment) && (
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            {onEditAppointment && (
              <button
                onClick={handleEdit}
                className="w-6 h-6 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Modifier"
              >
                <Edit className="w-3 h-3" />
              </button>
            )}
            {onDeleteAppointment && (
              <button
                onClick={handleDelete}
                className="w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                title="Supprimer"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
        
        <div className="relative z-10">
          {/* Title et heure sur la même ligne */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Calendar className="w-3 h-3 text-white" />
              </div>
              <p className="font-bold text-sm text-white group-hover:text-white/90 transition-colors truncate">
                {appointment.titre}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-white/90 font-medium">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span>{appointment.heure}</span>
            </div>
          </div>
          
          {/* Nom/Prénom */}
          {(appointment.nom || appointment.prenom) && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-white/15 rounded flex items-center justify-center flex-shrink-0">
                <User className="w-2 h-2 text-white/90" />
              </div>
              <p className="text-xs text-white/90 truncate font-medium">
                {appointment.prenom} {appointment.nom}
              </p>
            </div>
          )}

          {/* Téléphone */}
          {appointment.telephone && (
            <div className="flex items-center gap-2 mb-2">
              <div className="w-4 h-4 bg-white/15 rounded flex items-center justify-center flex-shrink-0">
                <Phone className="w-2 h-2 text-white/90" />
              </div>
              <p className="text-xs text-white/90 truncate font-medium">{appointment.telephone}</p>
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white/15 rounded flex items-center justify-center flex-shrink-0">
              <MapPin className="w-2 h-2 text-white/90" />
            </div>
            <p className="text-xs text-white/90 truncate font-medium">{appointment.location}</p>
          </div>
        </div>
        
        {/* Luxury shine effect */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
      </div>
    );
  }

  // Version desktop
  return (
    <div
      draggable={enableDragAndDrop}
      onDragStart={enableDragAndDrop ? handleDragStart : undefined}
      onClick={handleClick}
      className={`group relative p-4 appointment-luxury text-white rounded-2xl premium-shadow overflow-hidden glow-effect ${
        enableDragAndDrop ? 'cursor-grab active:cursor-grabbing premium-hover' : 'cursor-pointer'
      }`}
      style={{ userSelect: 'none' }}
    >
      {/* Luxury background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute top-2 right-2 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/5 rounded-full blur-lg"></div>
      
      {/* Premium border effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/20 group-hover:border-white/40 transition-all duration-300"></div>
      
      {/* Icônes d'actions - visibles seulement si les props sont fournies */}
      {(onEditAppointment || onDeleteAppointment) && (
        <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          {onEditAppointment && (
            <button
              onClick={handleEdit}
              className="w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 premium-shadow"
              title="Modifier ce rendez-vous"
            >
              <Edit className="w-4 h-4" />
            </button>
          )}
          {onDeleteAppointment && (
            <button
              onClick={handleDelete}
              className="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 premium-shadow"
              title="Supprimer ce rendez-vous"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      
      <div className="relative z-10">
        {/* Title avec icon premium */}
        <div className="flex items-center gap-3 mb-3 pr-20">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-black flex-shrink-0" />
          </div>
          <p className="font-bold text-sm text-red group-hover:text-white/90 transition-colors truncate flex-1">
            {appointment.titre}
          </p>
        </div>

        {/* Nom/Prénom avec style premium */}
        {(appointment.nom || appointment.prenom) && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
              <User className="w-3 h-3 text-red flex-shrink-0" />
            </div>
            <p className="text-xs text-red font-medium tracking-wide truncate">
              {appointment.prenom} {appointment.nom}
            </p>
          </div>
        )}

        {/* Téléphone */}
        {appointment.telephone && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
              <Phone className="w-3 h-3 text-red flex-shrink-0" />
            </div>
            <p className="text-xs text-red font-medium tracking-wide truncate">{appointment.telephone}</p>
          </div>
        )}

        {/* Date de naissance */}
        {appointment.dateNaissance && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 bg-white/15 rounded-lg flex items-center justify-center">
              <Calendar className="w-3 h-3 text-white/90 flex-shrink-0" />
            </div>
            <p className="text-xs text-white/90 font-medium tracking-wide truncate">{appointment.dateNaissance}</p>
          </div>
        )}
        
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
      
      {/* Luxury shine effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000"></div>
    </div>
  );
};

export default CalendarAppointment;
