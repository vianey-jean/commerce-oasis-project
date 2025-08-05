
/**
 * Composant pour afficher un jour du calendrier avec ses rendez-vous
 */

import React from 'react';
import { format } from 'date-fns';
import { Plus, Edit, Trash2, Calendar, Crown, Star, Sparkles } from 'lucide-react';
import { Appointment } from '@/services/AppointmentService';
import CalendarAppointment from './CalendarAppointment';
import { useIsMobile } from '@/hooks/use-mobile';

interface CalendarDayProps {
  day: {
    date: Date;
    dateStr: string;
    dayName: string;
    dayNumber: string;
    monthName: string;
    isToday: boolean;
    appointments: Appointment[];
  };
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onDragStart?: (appointment: Appointment, e: React.DragEvent) => void;
  onDrop?: (targetDate: Date, targetHour: string, e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  enableDragAndDrop?: boolean;
  showActionButtons?: boolean;
  onAddAppointment?: (date: Date, hour: string) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointment: Appointment) => void;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  day,
  appointments,
  onAppointmentClick,
  onDragStart,
  onDrop,
  onDragOver,
  enableDragAndDrop = true,
  showActionButtons = true,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment
}) => {
  const isMobile = useIsMobile();

  const handleDrop = (e: React.DragEvent) => {
    if (onDrop) {
      // Pour les jours, on utilise une heure par défaut
      onDrop(day.date, '09:00', e);
    }
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddAppointment) {
      onAddAppointment(day.date, '09:00');
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    if (onEditAppointment) {
      onEditAppointment(appointment);
    }
  };

  const handleDeleteAppointment = (appointment: Appointment) => {
    if (onDeleteAppointment) {
      onDeleteAppointment(appointment);
    }
  };

  if (isMobile) {
    return (
      <div 
        className={`luxury-card p-4 rounded-2xl border-2 transition-all duration-300 premium-hover relative group ${
          day.isToday 
            ? 'border-primary premium-shadow glow-effect bg-gradient-to-br from-primary/10 to-purple-500/10' 
            : 'border-primary/20 hover:border-primary/40 bg-white/80 backdrop-blur-sm'
        }`}
        onDrop={handleDrop}
        onDragOver={onDragOver}
      >
        {/* Bouton d'ajout mobile - visible seulement si showActionButtons est true */}
        {showActionButtons && onAddAppointment && (
          <button
            onClick={handleAddClick}
            className="absolute top-3 right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
            title="Ajouter un rendez-vous"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}

        {/* Header du jour avec effet premium */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-primary/20">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            day.isToday 
              ? 'premium-gradient text-white' 
              : 'bg-primary/10 text-primary'
          }`}>
            <Calendar className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${
              day.isToday ? 'luxury-text-gradient' : 'text-primary'
            }`}>
              {day.dayName}
            </p>
            <p className={`text-sm font-medium ${
              day.isToday ? 'text-primary' : 'text-muted-foreground'
            }`}>
              {day.dayNumber} {day.monthName}
            </p>
          </div>
          {day.isToday && (
            <div className="flex items-center gap-1">
              <Crown className="w-4 h-4 text-primary" />
              <Star className="w-3 h-3 text-yellow-500" />
            </div>
          )}
        </div>

        {/* Rendez-vous avec design premium */}
        <div className="space-y-3">
          {appointments.map((appointment) => (
            <CalendarAppointment
              key={appointment.id}
              appointment={appointment}
              onClick={onAppointmentClick}
              onDragStart={onDragStart}
              enableDragAndDrop={enableDragAndDrop}
              onEditAppointment={showActionButtons ? handleEditAppointment : undefined}
              onDeleteAppointment={showActionButtons ? handleDeleteAppointment : undefined}
            />
          ))}
          
          {appointments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-primary/50" />
              </div>
              <p className="text-sm font-medium">Aucun rendez-vous</p>
              <p className="text-xs">Jour libre</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Version desktop
  return (
    <div 
      className={`relative border-r border-primary/20 transition-all duration-300 premium-hover group ${
        day.isToday 
          ? 'bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/30' 
          : 'hover:bg-primary/5 bg-white/50 backdrop-blur-sm'
      }`}
      onDrop={handleDrop}
      onDragOver={onDragOver}
    >
      {/* Bouton d'ajout desktop - visible seulement si showActionButtons est true */}
      {showActionButtons && onAddAppointment && (
        <button
          onClick={handleAddClick}
          className="absolute top-2 right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100 z-10"
          title="Ajouter un rendez-vous"
        >
          <Plus className="w-3 h-3" />
        </button>
      )}

      {/* Header du jour avec design premium */}
      <div className={`p-4 border-b border-primary/20 ${
        day.isToday ? 'premium-gradient text-white' : 'bg-gradient-to-r from-primary/5 to-purple-500/5'
      }`}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
            day.isToday ? 'bg-white/30' : 'bg-primary/20'
          }`}>
            <Calendar className={`w-3 h-3 ${day.isToday ? 'text-white' : 'text-primary'}`} />
          </div>
          <p className={`text-sm font-bold ${
            day.isToday ? 'text-white' : 'text-primary'
          }`}>
            {day.dayName}
          </p>
          {day.isToday && <Crown className="w-3 h-3 text-yellow-300" />}
        </div>
        <p className={`text-lg font-bold ${
          day.isToday ? 'text-white' : 'text-primary'
        }`}>
          {day.dayNumber}
        </p>
        <p className={`text-xs font-medium ${
          day.isToday ? 'text-white/90' : 'text-muted-foreground'
        }`}>
          {day.monthName}
        </p>
      </div>

      {/* Rendez-vous avec design premium */}
      <div className="p-3 space-y-2 min-h-[400px]">
        {appointments.map((appointment) => (
          <CalendarAppointment
            key={appointment.id}
            appointment={appointment}
            onClick={onAppointmentClick}
            onDragStart={onDragStart}
            enableDragAndDrop={enableDragAndDrop}
            onEditAppointment={showActionButtons ? handleEditAppointment : undefined}
            onDeleteAppointment={showActionButtons ? handleDeleteAppointment : undefined}
          />
        ))}
        
        {appointments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-4 h-4 text-primary/50" />
            </div>
            <p className="text-xs font-medium">Aucun RDV</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;
