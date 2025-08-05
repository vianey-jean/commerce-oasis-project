
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../AppointmentService';

export class ToastNotifications {
  static showAppointmentCreated(appointment: Appointment) {
    toast.success('Rendez-vous créé avec succès !', {
      description: `${appointment.titre} - ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure}`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showAppointmentUpdated(appointment: Appointment) {
    toast.success('Rendez-vous modifié avec succès !', {
      description: `${appointment.titre} - ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure}`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showAppointmentDeleted(title: string) {
    toast.error('Rendez-vous supprimé', {
      description: `"${title}" a été supprimé définitivement`,
      duration: 5000,
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  }

  static showConflictWarning(appointment: Appointment, conflictingAppointments: Appointment[]) {
    toast.warning('Conflit de rendez-vous détecté !', {
      description: `${conflictingAppointments.length} autre(s) rendez-vous à la même heure`,
      duration: 8000,
      className: "bg-indigo-700 text-white border-indigo-600",
      action: {
        label: 'Voir conflits',
        onClick: () => console.log('Conflits:', conflictingAppointments)
      }
    });
  }

  static showUpcomingToday(appointments: Appointment[]) {
    if (appointments.length > 0) {
      toast.info(`${appointments.length} rendez-vous aujourd'hui`, {
        description: `Prochain: ${appointments[0].titre} à ${appointments[0].heure}`,
        duration: 8000,
        className: "bg-indigo-700 text-white border-indigo-600"
      });
    }
  }

  static showReminder(appointment: Appointment, minutesBefore: number) {
    const message = `🔔 Rappel: ${appointment.titre} dans ${minutesBefore} minutes`;
    
    toast.info(message, {
      description: `${appointment.location} - ${appointment.heure}`,
      duration: 10000,
      className: "bg-indigo-700 text-white border-indigo-600",
      action: {
        label: 'Voir détails',
        onClick: () => console.log('Voir rendez-vous:', appointment.id)
      }
    });
  }
}
