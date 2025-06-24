
import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { useNotificationService } from '@/services/NotificationService';
import { toast } from 'sonner';
import CalendarHeader from './CalendarHeader';
import CalendarDayHeader from './CalendarDayHeader';
import CalendarDay from './CalendarDay';
import { Calendar, Sparkles } from 'lucide-react';

/**
 * Props pour le calendrier hebdomadaire
 */
interface WeekCalendarProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

/**
 * Composant de calendrier hebdomadaire
 * Affiche les rendez-vous sur une semaine avec navigation
 */
const WeekCalendar: React.FC<WeekCalendarProps> = ({ onAppointmentClick }) => {
  // États pour gérer la date courante, les rendez-vous et le chargement
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Affichage d'un indicateur de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20">
        <div className="p-12 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-pink-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Chargement des rendez-vous...</span>
            <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400 mt-2">Préparation de votre calendrier</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500">
      {/* En-tête du calendrier avec boutons de navigation */}
      <CalendarHeader 
        title="Calendrier Hebdomadaire"
        onPrevious={previousWeek}
        onNext={nextWeek}
      />

      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        {days.map((day, index) => (
          <CalendarDayHeader key={index} day={day} />
        ))}
      </div>

      {/* Contenu du calendrier avec les rendez-vous pour chaque jour */}
      <div className="grid grid-cols-7 min-h-[350px] bg-gradient-to-br from-white via-gray-50/50 to-white">
        {days.map((day, dayIndex) => (
          <CalendarDay 
            key={dayIndex} 
            day={day}
            appointments={getAppointmentsForDate(day)}
            onAppointmentClick={onAppointmentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekCalendar;
