import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, parseISO, isSameDay, format } from 'date-fns';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { useNotificationService } from '@/services/NotificationService';
import { toast } from 'sonner';
import CalendarHeader from './CalendarHeader';
import CalendarDayHeader from './CalendarDayHeader';
import CalendarDay from './CalendarDay';
import { Calendar, Sparkles, Crown, Star } from 'lucide-react';

/**
 * Props pour le calendrier hebdomadaire
 */
interface WeekCalendarProps {
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentDrop?: (appointment: Appointment, newDate: Date, originalAppointment: Appointment) => void;
}

/**
 * Composant de calendrier hebdomadaire
 * Affiche les rendez-vous sur une semaine avec navigation et drag & drop
 */
const WeekCalendar: React.FC<WeekCalendarProps> = ({ onAppointmentClick, onAppointmentDrop }) => {
  // États pour gérer la date courante, les rendez-vous et le chargement
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  const [originalAppointment, setOriginalAppointment] = useState<Appointment | null>(null);

  // Service de notifications pour les rappels de rendez-vous
  const { resetNotifications } = useNotificationService(appointments);

  // Récupère tous les rendez-vous lors du premier chargement
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const data = await AppointmentService.getAll();
        setAppointments(data);
      } catch (error) {
        toast.error("Impossible de charger les rendez-vous");
        console.error("Erreur chargement des rendez-vous:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
    resetNotifications();
  }, []);

  // Calcul des jours de la semaine courante
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  // Navigation vers la semaine précédente
  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  // Navigation vers la semaine suivante
  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // Filtre les rendez-vous pour une date spécifique
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter((appointment) => {
      const appointmentDate = parseISO(appointment.date);
      return isSameDay(appointmentDate, date);
    });
  };

  // Gestion du début du drag
  const handleDragStart = (appointment: Appointment, e: React.DragEvent) => {
    console.log('Week calendar - drag start:', appointment.titre);
    setDraggedAppointment(appointment);
    // Conserver l'état original du rendez-vous
    setOriginalAppointment({ ...appointment });
  };

  // Gestion du drop
  const handleDrop = (appointment: Appointment, newDate: Date) => {
    console.log('Week calendar - handleDrop called with:', {
      appointmentId: appointment.id,
      appointmentTitle: appointment.titre,
      originalDate: appointment.date,
      newDate: format(newDate, 'yyyy-MM-dd')
    });

    const newDateString = format(newDate, 'yyyy-MM-dd');
    const originalDateString = appointment.date;

    // Vérifier si la date a vraiment changé
    if (newDateString !== originalDateString) {
      console.log('Date has changed, triggering appointment drop callback');
      
      const updatedAppointment = {
        ...appointment,
        date: newDateString
      };

      // NE PAS mettre à jour localement l'état ici
      // L'état sera mis à jour seulement après confirmation

      // Déclencher l'ouverture du formulaire de modification avec la nouvelle date
      if (onAppointmentDrop && originalAppointment) {
        console.log('Calling onAppointmentDrop callback');
        onAppointmentDrop(updatedAppointment, newDate, originalAppointment);
      }

      toast.success(`Rendez-vous préparé pour le ${format(newDate, 'dd/MM/yyyy')}`);
    } else {
      console.log('Date unchanged, no action needed');
    }

    setDraggedAppointment(null);
  };

  // Fonction pour annuler le déplacement
  const handleCancelDrop = () => {
    if (originalAppointment) {
      // Restaurer le rendez-vous original dans l'état
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === originalAppointment.id ? originalAppointment : apt
        )
      );
    }
    setOriginalAppointment(null);
    setDraggedAppointment(null);
  };

  // Fonction pour confirmer le déplacement
  const handleConfirmDrop = (updatedAppointment: Appointment) => {
    // Mettre à jour l'état local avec le rendez-vous modifié
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === updatedAppointment.id ? updatedAppointment : apt
      )
    );
    setOriginalAppointment(null);
    setDraggedAppointment(null);
  };

  // Affichage d'un indicateur de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="calendar-luxury rounded-3xl premium-shadow-xl overflow-hidden border-0">
        <div className="p-16 text-center">
          <div className="relative mb-8 floating-animation">
            <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            <div className="absolute inset-4 w-12 h-12 bg-primary/10 rounded-full blur-sm"></div>
          </div>
          <div className="flex items-center justify-center gap-3 text-xl font-bold luxury-text-gradient mb-3">
            <Crown className="w-6 h-6 text-primary" />
            <span>Chargement des rendez-vous...</span>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium">Préparation de votre calendrier premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-luxury rounded-3xl premium-shadow-xl overflow-hidden border-0 premium-hover glow-effect">
      {/* En-tête du calendrier premium */}
      <CalendarHeader 
        title="Calendrier Hebdomadaire Premium"
        onPrevious={previousWeek}
        onNext={nextWeek}
      />

      {/* En-têtes des jours de la semaine premium */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-primary/5 to-purple-500/5 border-b border-primary/20">
        {days.map((day, index) => (
          <CalendarDayHeader key={index} day={day} />
        ))}
      </div>

      {/* Contenu du calendrier avec les rendez-vous pour chaque jour */}
      <div className="grid grid-cols-7 min-h-[400px] bg-gradient-to-br from-white via-primary/2 to-purple-500/5">
        {days.map((day, dayIndex) => (
          <CalendarDay 
            key={dayIndex} 
            day={day}
            appointments={getAppointmentsForDate(day)}
            onAppointmentClick={onAppointmentClick}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onCancelDrop={handleCancelDrop}
            onConfirmDrop={handleConfirmDrop}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
