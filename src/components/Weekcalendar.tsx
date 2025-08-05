
/**
 * Composant calendrier hebdomadaire premium avec design moderne
 * Affiche les rendez-vous de la semaine avec fonctionnalités avancées
 */

import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Crown, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import CalendarDay from './CalendarDay';
import CalendarHeader from './CalendarHeader';
import CalendarDayHeader from './CalendarDayHeader';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Interface pour les props du composant WeekCalendar
 */
interface WeekCalendarProps {
  onAppointmentClick: (appointment: Appointment) => void;
  enableDragAndDrop?: boolean;
  showActionButtons?: boolean;
  onAddAppointment?: (date: Date, hour: string) => void;
  onEditAppointment?: (appointment: Appointment) => void;
  onDeleteAppointment?: (appointment: Appointment) => void;
}

/**
 * Composant principal du calendrier hebdomadaire
 */
const WeekCalendar = ({ 
  onAppointmentClick, 
  enableDragAndDrop = true,
  showActionButtons = true,
  onAddAppointment,
  onEditAppointment,
  onDeleteAppointment
}: WeekCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isMobile = useIsMobile();

  // Calculer le lundi de la semaine actuelle
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  // Générer les 7 jours de la semaine
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      date,
      dateStr,
      dayName: format(date, 'EEEE', { locale: fr }),
      dayNumber: format(date, 'd'),
      monthName: format(date, 'MMMM', { locale: fr }),
      isToday: format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'),
      appointments: appointments.filter(app => app.date === dateStr)
    };
  });

  // Charger les rendez-vous
  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      // Charger tous les rendez-vous de la semaine sélectionnée
      const startDate = format(startOfCurrentWeek, 'yyyy-MM-dd');
      const endDate = format(addDays(startOfCurrentWeek, 6), 'yyyy-MM-dd');
      const data = await AppointmentService.getAppointmentsByDateRange(startDate, endDate);
      setAppointments(data);
    } catch (error) {
      console.error('Erreur lors du chargement des rendez-vous:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };

  const handleDragStart = (appointment: Appointment, e: React.DragEvent) => {
    if (!enableDragAndDrop) {
      e.preventDefault();
      return;
    }
    
    console.log('Drag start for appointment:', appointment.titre);
    setDraggedAppointment(appointment);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (targetDate: Date, targetHour: string, e: React.DragEvent) => {
    if (!enableDragAndDrop) return;
    
    e.preventDefault();
    console.log('Drop event on:', targetDate, targetHour);
    
    if (draggedAppointment) {
      const newDate = format(targetDate, 'yyyy-MM-dd');
      const newHour = targetHour;
      
      // Vérifier si la date ou l'heure a changé
      if (draggedAppointment.date !== newDate || draggedAppointment.heure !== newHour) {
        console.log('Opening edit form for dropped appointment');
        
        // Ouvrir le formulaire de modification avec la nouvelle date/heure
        const appointmentWithNewDateTime = {
          ...draggedAppointment,
          date: newDate,
          heure: newHour,
          _isDragAndDrop: true // Marquer comme drag and drop
        };
        
        if (onEditAppointment) {
          onEditAppointment(appointmentWithNewDateTime);
        }
      }
    }
    
    setDraggedAppointment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!enableDragAndDrop) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await AppointmentService.delete(appointmentToDelete.id);
      if (success) {
        await fetchAppointments();
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
        // Appeler la callback parent si elle existe
        if (onDeleteAppointment) {
          onDeleteAppointment(appointmentToDelete);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };

  if (loading) {
    return (
      <Card className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden">
        <CardContent className="p-8 lg:p-16 text-center">
          <div className="relative mb-6 lg:mb-8 floating-animation">
            <div className="w-16 lg:w-20 h-16 lg:h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 lg:w-20 h-16 lg:h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            <div className="absolute inset-3 lg:inset-4 w-10 lg:w-12 h-10 lg:h-12 bg-primary/10 rounded-full blur-sm"></div>
          </div>
          <div className="flex items-center justify-center gap-2 lg:gap-3 text-lg lg:text-xl font-bold luxury-text-gradient mb-2 lg:mb-3">
            <Crown className="w-5 lg:w-6 h-5 lg:h-6 text-primary" />
            <span>Chargement du calendrier premium...</span>
            <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 text-primary animate-pulse" />
          </div>
          <p className="text-sm lg:text-base text-muted-foreground font-medium">Synchronisation des données de luxe</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden">
        {/* En-tête du calendrier avec navigation */}
        <CardHeader className="premium-gradient text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-white mb-1">
                  {isMobile ? 'Calendrier' : 'Calendrier Premium'}
                </CardTitle>
                <p className="text-white/90 text-lg font-medium">
                  {format(startOfCurrentWeek, 'MMMM yyyy', { locale: fr })}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white font-medium">Live</span>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePreviousWeek}
                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNextWeek}
                  className="text-white hover:bg-white/20 w-10 h-10 p-0"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
              <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Navigation de semaine sur mobile */}
          {isMobile && (
            <CalendarHeader 
              title="Semaine"
              currentDate={currentDate}
              onPrevious={handlePreviousWeek}
              onNext={handleNextWeek}
            />
          )}

          {/* Contenu du calendrier avec les rendez-vous pour chaque jour */}
          <div className={`${
            isMobile 
              ? 'space-y-4 p-4' 
              : 'grid grid-cols-7 min-h-[600px] bg-gradient-to-br from-gray-50/50 to-blue-50/30'
          }`}>
            {days.map((day, index) => (
              <CalendarDay
                key={day.dateStr}
                day={day}
                appointments={day.appointments}
                onAppointmentClick={onAppointmentClick}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                enableDragAndDrop={enableDragAndDrop}
                showActionButtons={showActionButtons}
                onAddAppointment={onAddAppointment}
                onEditAppointment={onEditAppointment}
                onDeleteAppointment={handleDeleteClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal de confirmation de suppression */}
      {appointmentToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          appointment={appointmentToDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default WeekCalendar;
