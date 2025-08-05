
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar, Crown, Star, Zap, Plus, Edit, Trash2 } from 'lucide-react';
import AppointmentModal from './AppointmentModal';
import AppointmentForm from './AppointmentForm';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import RizikyLoadingSpinner from './RizikyLoadingSpinner';
import { toast } from 'sonner';

interface MonthlyCalendarProps {
  onDateClick?: (date: Date) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onAddAppointment?: (date: Date) => void;
  onEditAppointment?: (appointment: Appointment) => void;
}

const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({
  onDateClick,
  onAppointmentClick,
  onAddAppointment,
  onEditAppointment
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [appointmentToEdit, setAppointmentToEdit] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState<Date | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [currentDate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await AppointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), date)
    ).sort((a, b) => {
      // Trier par heure
      const [aHours, aMinutes] = a.heure.split(':').map(Number);
      const [bHours, bMinutes] = b.heure.split(':').map(Number);
      return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
    });
  };

  const handleDragStart = (appointment: Appointment, e: React.DragEvent) => {
    console.log('Starting drag for appointment:', appointment.titre);
    setDraggedAppointment(appointment);
    e.dataTransfer.setData('text/plain', JSON.stringify(appointment));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (targetDate: Date, e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drop event on date:', format(targetDate, 'yyyy-MM-dd'));
    
    if (draggedAppointment) {
      const originalDate = new Date(draggedAppointment.date);
      
      if (!isSameDay(originalDate, targetDate)) {
        console.log('Date changed, opening edit modal with new date');
        
        const updatedAppointment = {
          ...draggedAppointment,
          date: format(targetDate, 'yyyy-MM-dd')
        };
        
        setAppointmentToEdit(updatedAppointment);
        setNewDate(targetDate);
        setIsEditModalOpen(true);
      }
    }
    
    setDraggedAppointment(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleEditSuccess = async () => {
    console.log('Edit success, refreshing appointments');
    setIsEditModalOpen(false);
    setAppointmentToEdit(null);
    setNewDate(null);
    await fetchAppointments();
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setAppointmentToEdit(null);
    setNewDate(null);
  };

  const handleAddClick = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddAppointment) {
      onAddAppointment(date);
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
        setAppointments(prev => prev.filter(apt => apt.id !== appointmentToDelete.id));
        toast.success("Rendez-vous supprimé avec succès", {
          className: "bg-green-700 text-white"
        });
        setShowDeleteModal(false);
        setAppointmentToDelete(null);
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

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  if (loading) {
    return (
      <Card className="calendar-luxury premium-shadow-xl border-0">
        <CardContent className="p-8 lg:p-16 text-center">
          <RizikyLoadingSpinner 
            size="lg"
            text="Chargement du calendrier mensuel premium"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="calendar-luxury premium-shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-violet-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="w-8 lg:w-12 h-8 lg:h-12 bg-white/30 backdrop-blur-sm rounded-lg lg:rounded-xl flex items-center justify-center">
                <Calendar className="w-4 lg:w-6 h-4 lg:h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg lg:text-2xl font-bold text-white">
                  {format(currentDate, 'MMMM yyyy', { locale: fr })}
                </CardTitle>
                <p className="text-white/80 text-xs lg:text-sm font-medium">Vue mensuelle premium</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white/20 rounded-full px-2 lg:px-3 py-1">
                <div className="w-1.5 lg:w-2 h-1.5 lg:h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white font-medium">Live</span>
              </div>
              <div className="flex gap-1 lg:gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={previousMonth}
                  className="text-white hover:bg-white/20 w-8 lg:w-10 h-8 lg:h-10 p-0"
                >
                  <ChevronLeft className="w-4 lg:w-5 h-4 lg:h-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={nextMonth}
                  className="text-white hover:bg-white/20 w-8 lg:w-10 h-8 lg:h-10 p-0"
                >
                  <ChevronRight className="w-4 lg:w-5 h-4 lg:h-5" />
                </Button>
              </div>
              <Star className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-violet-50/30">
            <div className="grid grid-cols-7 border-b border-blue-200">
              {weekDays.map(day => (
                <div key={day} className="p-2 lg:p-4 text-center font-bold text-blue-700 luxury-card border-r border-blue-100 last:border-r-0">
                  <span className="text-xs lg:text-sm">{day}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const dayAppointments = getAppointmentsForDate(day);
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isTodayDate = isToday(day);

                return (
                  <div 
                    key={index}
                    className={`min-h-[60px] sm:min-h-[80px] lg:min-h-[120px] p-1 lg:p-2 border-r border-b border-blue-100 last:border-r-0 transition-all duration-300 cursor-pointer premium-hover ${
                      !isCurrentMonth ? 'bg-gray-50/50 text-muted-foreground' : 'luxury-card hover:bg-blue-50/50'
                    } ${isTodayDate ? 'bg-gradient-to-br from-blue-500 to-violet-600 text-white' : ''}`}
                    onClick={() => onDateClick?.(day)}
                    onDrop={(e) => handleDrop(day, e)}
                    onDragOver={handleDragOver}
                  >
                   <div className={`group flex items-center justify-between mb-1 lg:mb-2 ${isTodayDate ? 'text-white' : ''}`}
                    >
                      <span
                        className={`text-xs lg:text-sm font-bold ${
                          isTodayDate ? 'text-white' : isCurrentMonth ? 'text-blue-700' : 'text-muted-foreground'
                        }`}
                      >
                        {format(day, 'd')}
                      </span>

                      <div className="flex items-center gap-1">
                        {isTodayDate && (
                          <Crown className="w-2 lg:w-3 h-2 lg:h-3 text-yellow-300" />
                        )}

                        {/* Bouton visible uniquement au hover du parent */}
                        <button
                          onClick={(e) => handleAddClick(day, e)}
                          className="w-5 h-5 lg:w-6 lg:h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                          title="Ajouter un rendez-vous"
                        >
                          <Plus className="w-2 lg:w-3 h-2 lg:h-3" />
                        </button>
                      </div>
                    </div>


                    <div className={`space-y-0.5 lg:space-y-1 ${dayAppointments.length > 3 ? 'appointment-stack' : ''}`}>
                      {dayAppointments.slice(0, window.innerWidth < 768 ? 2 : 3).map((appointment, appointmentIndex) => (
                        <div
                          key={appointment.id}
                          className="appointment-luxury text-white cursor-grab hover:opacity-80 transition-opacity touch-manipulation relative group"
                          draggable
                          onDragStart={(e) => handleDragStart(appointment, e)}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick?.(appointment);
                          }}
                        >
                          {/* Icônes d'actions */}
                          <div className="absolute top-1 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
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
                              title="Supprimer ce rendez-vous"
                            >
                              <Trash2 className="w-2 h-2" />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-1 pr-10">
                            <Zap className="w-2 h-2 flex-shrink-0" />
                            <span className="appointment-time">{appointment.heure}</span>
                          </div>
                          <div className="appointment-title truncate pr-10">{appointment.titre}</div>
                        </div>
                      ))}
                      
                      {dayAppointments.length > (window.innerWidth < 768 ? 2 : 3) && (
                        <Badge variant="secondary" className="text-xs w-full justify-center">
                          +{dayAppointments.length - (window.innerWidth < 768 ? 2 : 3)} autre{dayAppointments.length - (window.innerWidth < 768 ? 2 : 3) > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {isEditModalOpen && appointmentToEdit && (
        <AppointmentModal 
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          title="Modifier le rendez-vous"
          mode="edit"
          onSuccess={handleEditSuccess}
        >
          <AppointmentForm 
            appointment={appointmentToEdit}
            onSuccess={handleEditSuccess}
            onCancel={handleCloseModal}
            disableDate={true}
          />
        </AppointmentModal>
      )}

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

export default MonthlyCalendar;
