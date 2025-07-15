
import { useEffect, useRef } from 'react';
import { Appointment } from './AppointmentService';
import { toast } from 'sonner';
import { parseISO, differenceInHours, format } from 'date-fns';
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
      const hoursDifference = differenceInHours(appointmentDate, now);


        // Si dans moins de 24h
      if (hoursDifference > 0 && hoursDifference <= 24) {
        // Marquer comme temporairement vu
        temporaryNotifications.current.add(appointmentId);
        saveTemporaryNotification(appointmentId);
            // Jouer le son et afficher la notification
        playNotificationSound();

        toast(
          `Vous avez un rendez-vous le ${format(appointmentDate, 'dd/MM/yyyy', { locale: fr })} à ${appointment.heure} au ${appointment.location}`,
          {
            description: appointment.description,
            duration: 5000,
            action: {
              label: "Ok",
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
