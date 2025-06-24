
import React, { useState, useEffect } from 'react';
import { startOfWeek, addDays, parseISO, isSameDay } from 'date-fns';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { useNotificationService } from '@/services/NotificationService';
import { toast } from 'sonner';
import CalendarHeader from './CalendarHeader';
import CalendarDayHeader from './CalendarDayHeader';
import CalendarDay from './CalendarDay';

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
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* En-tête du calendrier avec boutons de navigation */}
      <CalendarHeader 
        title="Calendrier Hebdomadaire"
        onPrevious={previousWeek}
        onNext={nextWeek}
      />

      {/* En-têtes des jours de la semaine */}
      <div className="grid grid-cols-7 border-b">
        {days.map((day, index) => (
          <CalendarDayHeader key={index} day={day} />
        ))}
      </div>

      {/* Contenu du calendrier avec les rendez-vous pour chaque jour */}
      <div className="grid grid-cols-7 min-h-[300px]">
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
