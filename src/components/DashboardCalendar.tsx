
import React, { useState, useEffect } from 'react';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { addWeeks, format, subWeeks } from 'date-fns';
import { Calendar, Clock, Sparkles, Zap, Crown, Star, ChevronLeft, ChevronRight, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { CardHeader, CardTitle } from './ui/card';
import { fr } from 'date-fns/locale';

interface DashboardCalendarProps {
  onAddAppointment?: (date: Date, hour: string) => void;
  onEditAppointment?: (appointment: Appointment) => void;
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({
  onAddAppointment,
  onEditAppointment
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const weekDays = AppointmentService.getWeekDays();
  const hours = AppointmentService.getHours();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    fetchAppointments();
  }, []);
  
  const previousWeek = () => {
    setCurrentDate(subWeeks(currentDate, 1));
  };

  const nextWeek = () => {
    setCurrentDate(addWeeks(currentDate, 1));
  };
  
  const fetchAppointments = async () => {
    try {
      const data = await AppointmentService.getCurrentWeekAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Organiser les rendez-vous par jour et par heure - CORRIGÉ
  const appointmentGrid: Record<string, Record<string, Appointment[]>> = {};
  
  weekDays.forEach(day => {
    const dateStr = format(day.fullDate, 'yyyy-MM-dd');
    appointmentGrid[dateStr] = {};
    
    // Obtenir tous les rendez-vous de cette journée
    const dayAppointments = appointments.filter(a => a.date === dateStr);
    
    hours.forEach(hour => {
      // Initialiser le tableau pour cette heure
      appointmentGrid[dateStr][hour] = [];
      
      // Pour chaque rendez-vous de la journée
      dayAppointments.forEach(appointment => {
        const appointmentTime = appointment.heure;
        const appointmentHour = parseInt(appointmentTime.split(':')[0]);
        const currentHour = parseInt(hour.split(':')[0]);
        
        // Vérifier si ce rendez-vous appartient à cette heure
        if (appointmentHour === currentHour) {
          appointmentGrid[dateStr][hour].push(appointment);
        }
      });
      
      // Trier les rendez-vous par heure exacte dans le créneau
      appointmentGrid[dateStr][hour].sort((a, b) => {
        const timeA = a.heure.split(':').map(Number);
        const timeB = b.heure.split(':').map(Number);
        return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
      });
    });
  });

  const handleDragStart = (appointment: Appointment, e: React.DragEvent) => {
    console.log('Starting drag for appointment:', appointment.titre);
    setDraggedAppointment(appointment);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (targetDate: Date, targetHour: string, e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drop event on:', targetDate, targetHour);
    
    if (draggedAppointment) {
      const originalDate = draggedAppointment.date;
      const originalHour = draggedAppointment.heure;
      const newDate = format(targetDate, 'yyyy-MM-dd');
      const newHour = targetHour;
      
      // Vérifier si la date ou l'heure a changé
      if (originalDate !== newDate || !originalHour.startsWith(targetHour.split(':')[0])) {
        console.log('Time/Date changed, updating appointment automatically');
        
        try {
          // Créer l'appointment mis à jour
          const updatedAppointment = {
            ...draggedAppointment,
            date: newDate,
            heure: newHour
          };

          // Sauvegarder directement dans la base de données
          const success = await AppointmentService.update(updatedAppointment);
          
          if (success) {
            toast.success(`Rendez-vous déplacé vers ${format(targetDate, 'dd/MM/yyyy')} à ${newHour}`, {
              className: "bg-indigo-700 text-white"
            });
            // Rafraîchir les données
            await fetchAppointments();
          } else {
            toast.error('Erreur lors du déplacement du rendez-vous', {
              className: "bg-indigo-700 text-white"
            });
          }
        } catch (error) {
          console.error('Error updating appointment:', error);
          toast.error('Erreur lors du déplacement du rendez-vous', {
            className: "bg-indigo-700 text-white"
          });
        }
      }
    }
    
    setDraggedAppointment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    console.log('Appointment clicked:', appointment);
    setSelectedAppointment(appointment);
  };

  const handleAddClick = (date: Date, hour: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddAppointment) {
      onAddAppointment(date, hour);
    }
  };

  const handleEditClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditAppointment) {
      onEditAppointment(appointment);
    }
  };

  const handleDeleteClick = (appointment: Appointment, e: React.MouseEvent) => {
    e.stopPropagation();
    setAppointmentToDelete(appointment);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await AppointmentService.delete(appointmentToDelete.id);
      if (success) {
        toast.success("Rendez-vous supprimé avec succès", {
          className: "bg-green-700 text-white"
        });
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
        await fetchAppointments();
      } else {
        toast.error("Erreur lors de la suppression", {
          className: "bg-red-700 text-white"
        });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression", {
        className: "bg-red-700 text-white"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAppointmentToDelete(null);
  };
  
  if (loading) {
    return (
      <div className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden">
        <div className="p-8 lg:p-16 text-center">
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
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden">
        {/* En-tête premium */}
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
                    Calendrier Dashboard Premium
                  </CardTitle>
                  <p className="text-white/90 text-lg font-medium">
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
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
                    onClick={previousWeek}
                    className="text-white hover:bg-white/20 w-10 h-10 p-0"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={nextWeek}
                    className="text-white hover:bg-white/20 w-10 h-10 p-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
                <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
              </div>
            </div>
          </CardHeader>

        <div className="overflow-x-auto premium-scroll">
          <div className="min-w-[900px] relative">
            <div className="grid grid-cols-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-2 border-primary/30 rounded-lg overflow-hidden">
              {/* Header - Empty cell for hours column */}
              <div className="luxury-card p-3 lg:p-4 flex items-center justify-center border-b-2 border-r-2 border-primary/40">
                <Clock className="w-4 lg:w-5 h-4 lg:h-5 text-primary" />
              </div>
              
              {/* Header - Days of the week */}
              {weekDays.map((day, index) => (
                <div 
                  key={index}
                  className={`p-3 lg:p-4 text-center font-bold border-b-2 border-primary/40 transition-all duration-300 ${
                    index < weekDays.length - 1 ? 'border-r-2 border-primary/40' : ''
                  } ${
                    day.isToday 
                      ? 'premium-gradient text-white border-primary premium-shadow glow-effect' 
                      : 'luxury-card text-primary/80 hover:border-primary/60 premium-hover'
                  }`}
                >
                  <div className="font-bold text-base lg:text-lg">{day.dayName}</div>
                  <div className={`text-xs lg:text-sm mt-1 font-medium ${day.isToday ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {day.dayNumber} {day.month}
                  </div>
                  {day.isToday && <Crown className="w-3 lg:w-4 h-3 lg:h-4 mx-auto mt-1 text-yellow-300" />}
                </div>
              ))}
              
              {/* Time slots and appointments avec drag & drop */}
              {hours.map((hour, hourIndex) => (
                <React.Fragment key={`row-${hourIndex}`}>
                  {/* Hour cell */}
                  <div className="luxury-card p-3 lg:p-4 text-center border-r-2 border-primary/40 flex items-center justify-center">
                    <span className="text-sm lg:text-base font-bold text-primary">{hour}</span>
                  </div>
                  
                  {/* Day cells for this hour */}
                  {weekDays.map((day, dayIndex) => {
                    const dateStr = format(day.fullDate, 'yyyy-MM-dd');
                    const cellAppointments = appointmentGrid[dateStr][hour] || [];
                    
                    return (
                      <div 
                        key={`cell-${hourIndex}-${dayIndex}`}
                        className={`p-2 lg:p-3 min-h-[80px] lg:min-h-[100px] transition-all duration-300 relative group premium-hover cursor-pointer ${
                          dayIndex < weekDays.length - 1 ? 'border-r-2 border-primary/40' : ''
                        } ${
                          day.isToday ? 'bg-gradient-to-br from-primary/10 to-purple-500/10' : 'luxury-card hover:bg-primary/5'
                        }`}
                        onDrop={(e) => handleDrop(day.fullDate, hour, e)}
                        onDragOver={handleDragOver}
                      >
                        {/* Bouton d'ajout + rouge - visible uniquement sur hover */}
                        <button
                          onClick={(e) => handleAddClick(day.fullDate, hour, e)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                          title="Ajouter un rendez-vous"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        
                        <div className="space-y-1 lg:space-y-2">
                          {cellAppointments.map((appointment, index) => {
                            const isMultiple = cellAppointments.length > 1;
                            return (
                              <div 
                                key={appointment.id}
                                className={`group/appointment appointment-luxury text-white p-2 lg:p-3 text-xs rounded-xl cursor-grab hover:cursor-grabbing premium-shadow premium-hover relative overflow-hidden glow-effect active:cursor-grabbing ${
                                  isMultiple ? 'min-h-[35px] lg:min-h-[40px]' : 'min-h-[60px] lg:min-h-[70px]'
                                }`}
                                draggable
                                onDragStart={(e) => handleDragStart(appointment, e)}
                                onClick={() => handleAppointmentClick(appointment)}
                                style={{ 
                                  transform: isMultiple ? `scale(${0.95 - index * 0.02})` : 'scale(1)',
                                  zIndex: cellAppointments.length - index,
                                  marginTop: isMultiple && index > 0 ? '-4px' : '0'
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                                
                                {/* Icônes d'actions - visibles uniquement sur hover */}
                                <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover/appointment:opacity-100 transition-all duration-300 z-10">
                                  <button
                                    onClick={(e) => handleEditClick(appointment, e)}
                                    className="w-4 h-4 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    title="Modifier ce rendez-vous"
                                  >
                                    <Edit className="w-2 h-2" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteClick(appointment, e)}
                                    className="w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                                    title="Supprimer ce rezndez-vous"
                                  >
                                    <Trash2 className="w-2 h-2" />
                                  </button>
                                </div>
                                
                                <div className="relative z-10 pr-12">
                                  <div className="font-bold truncate flex items-center gap-1 lg:gap-2 mb-1">
                                    <Sparkles className="w-2 lg:w-3 h-2 lg:h-3 flex-shrink-0" />
                                    <span className="truncate">{appointment.titre}</span>
                                    <Star className="w-1.5 lg:w-2 h-1.5 lg:h-2 text-yellow-300 flex-shrink-0" />
                                  </div>
                                  <div className="text-white/90 font-medium text-xs mb-1">
                                    {appointment.heure}
                                  </div>
                                  {!isMultiple && (
                                    <div className="truncate text-white/90 font-medium text-xs">{appointment.location}</div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && appointmentToDelete && (
        <ConfirmDeleteModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          appointment={appointmentToDelete}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
};

export default DashboardCalendar;
