
import { useEffect, useRef } from 'react';
import { Appointment } from './AppointmentService';
import { toast } from 'sonner';
import { parseISO, differenceInHours, differenceInMinutes, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Clé pour stockage local
const STORAGE_KEY = 'confirmed_notifications';
const TEMPORARY_KEY = 'temporarily_seen_notifications';

// Récupère les IDs confirmés (définitifs)
const getConfirmedNotifications = (): Set<number> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

// Récupère les IDs déjà vus (temporairement) pendant 5s
const getTemporaryNotifications = (): Set<number> => {
  try {
    const stored = localStorage.getItem(TEMPORARY_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
};

// Enregistre un ID comme confirmé (ne plus jamais notifier)
const saveConfirmedNotification = (appointmentId: number) => {
  const confirmed = getConfirmedNotifications();
  confirmed.add(appointmentId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(confirmed)));
};

// Enregistre un ID comme vu temporairement (évite la répétition après F5)
const saveTemporaryNotification = (appointmentId: number) => {
  const temp = getTemporaryNotifications();
  temp.add(appointmentId);
  localStorage.setItem(TEMPORARY_KEY, JSON.stringify(Array.from(temp)));
};

// Son de notification
const playNotificationSound = () => {
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

  // Activer le son seulement si l'utilisateur a déjà interagi avec la page
  if (document.hasFocus()) {
    audio.play().catch(() => {
      // Erreur de lecture ignorée (navigateur peut bloquer)
    });
  }
};

export function useNotificationService(appointments: Appointment[]) {
  const confirmedNotifications = useRef<Set<number>>(getConfirmedNotifications());
  const temporaryNotifications = useRef<Set<number>>(getTemporaryNotifications());
 
  useEffect(() => {
    appointments.forEach(appointment => {
      const appointmentId = appointment.id;
      if (
        confirmedNotifications.current.has(appointmentId) ||
        temporaryNotifications.current.has(appointmentId)
      ) {
        return;
      }

      const now = new Date();
      const appointmentDate = parseISO(`${appointment.date}T${appointment.heure}`);
      const minutesDifference = differenceInMinutes(appointmentDate, now);

      // Notification si entre 24h et 15min avant le rendez-vous
      if (minutesDifference > 15 && minutesDifference <= 1440) { // 1440 min = 24h
        // Marquer comme temporairement vu
        temporaryNotifications.current.add(appointmentId);
        saveTemporaryNotification(appointmentId);
        
        // Jouer le son et afficher la notification
        playNotificationSound();

        const timeMessage = minutesDifference > 60 
          ? `dans ${Math.floor(minutesDifference / 60)}h${minutesDifference % 60 > 0 ? ` ${minutesDifference % 60}min` : ''}`
          : `dans ${minutesDifference} minutes`;

        toast(
          `🔔 Rendez-vous ${timeMessage}`,
          {
            description: `${appointment.titre} - ${format(appointmentDate, 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure} au ${appointment.location}`,
            duration: 8000,
            className: "bg-indigo-700 text-white border-indigo-600",
            action: {
              label: "Compris",
              onClick: () => {
                saveConfirmedNotification(appointment.id);
                confirmedNotifications.current.add(appointment.id);
              }
            }
          }
        );
      }
    });
  }, [appointments]);

  // Réinitialiser les notifications (utile en admin/debug)
  const resetNotifications = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TEMPORARY_KEY);
    confirmedNotifications.current.clear();
    temporaryNotifications.current.clear();
  };

  return {
    resetNotifications,
  };
}
