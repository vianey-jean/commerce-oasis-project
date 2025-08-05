
import { toast } from 'sonner';
import { AppointmentService, Appointment } from '../AppointmentService';
import { NotificationSettings } from './types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export class NotificationManager {
  private static timers: Map<string, NodeJS.Timeout> = new Map();
  private static settings: NotificationSettings = {
    reminders: {
      enabled: true,
      times: [120, 60, 30, 15] // 2h, 1h, 30min, 15min avant
    },
    email: {
      enabled: true,
      confirmations: true,
      reminders: true
    },
    desktop: {
      enabled: true,
      sound: true
    },
    sms: {
      enabled: true,
      phoneNumber: '00262692842370'
    }
  };

  static async initializeNotifications() {
    if ('Notification' in window && Notification.permission === 'default') {
      // Ne demander la permission que lors d'une interaction utilisateur
      console.log('Permission de notification sera demandée lors d\'une interaction utilisateur');
    }
    await NotificationManager.scheduleUpcomingReminders();
  }

  static async scheduleUpcomingReminders() {
    try {
      const appointments = await AppointmentService.getAll();
      NotificationManager.clearAllTimers();
      
      appointments.forEach(appointment => {
        NotificationManager.scheduleAppointmentReminders(appointment);
      });
    } catch (error) {
      console.error('Erreur lors de la planification des rappels:', error);
    }
  }

  private static scheduleAppointmentReminders(appointment: Appointment) {
    const appointmentDateTime = new Date(`${appointment.date} ${appointment.heure}`);
    const now = new Date();

    NotificationManager.settings.reminders.times.forEach(minutesBefore => {
      const reminderTime = new Date(appointmentDateTime.getTime() - minutesBefore * 60000);
      
      if (reminderTime > now) {
        const timerId = `${appointment.id}-${minutesBefore}`;
        const timeoutMs = reminderTime.getTime() - now.getTime();
        
        const timer = setTimeout(() => {
          NotificationManager.showReminder(appointment, minutesBefore);
          
          // Envoyer SMS si c'est 2h avant
          if (minutesBefore === 120) {
            NotificationManager.sendSMSReminder(appointment);
          }
        }, timeoutMs);
        
        NotificationManager.timers.set(timerId, timer);
      }
    });
  }

  private static showReminder(appointment: Appointment, minutesBefore: number) {
    const message = `🔔 Rappel: ${appointment.titre} dans ${minutesBefore} minutes`;
    
    // Toast notification avec background bleu-violet
    toast.info(message, {
      description: `${appointment.location} - ${appointment.heure}`,
      duration: 10000,
      className: "bg-indigo-700 text-white border-indigo-600",
      action: {
        label: 'Voir détails',
        onClick: () => console.log('Voir rendez-vous:', appointment.id)
      }
    });

    // Desktop notification
    if (NotificationManager.settings.desktop.enabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(message, {
        body: `${appointment.location} - ${appointment.heure}`,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      });
    }
  }

  private static async sendSMSReminder(appointment: Appointment) {
    if (!NotificationManager.settings.sms.enabled || !NotificationManager.settings.sms.phoneNumber) return;

    try {
      const message = `Rappel: Vous avez un rendez-vous "${appointment.titre}" le ${format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure} au ${appointment.location}. N'oubliez pas!`;
      
      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber: NotificationManager.settings.sms.phoneNumber,
          message: message,
          appointmentId: appointment.id
        })
      });

      if (response.ok) {
        console.log('SMS envoyé avec succès');
        toast.success('SMS de rappel envoyé', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
      } else {
        console.error('Erreur lors de l\'envoi du SMS');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS:', error);
    }
  }

  static clearAllTimers() {
    if (NotificationManager.timers) {
      NotificationManager.timers.forEach(timer => clearTimeout(timer));
      NotificationManager.timers.clear();
    }
  }

  static updateSettings(newSettings: Partial<NotificationSettings>) {
    NotificationManager.settings = { ...NotificationManager.settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(NotificationManager.settings));
    NotificationManager.scheduleUpcomingReminders();
  }

  static getSettings(): NotificationSettings {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      NotificationManager.settings = JSON.parse(saved);
    }
    return NotificationManager.settings;
  }
}
