
/**
 * Utilitaires pour la manipulation des dates
 * Fonctions pures sans effets de bord
 */

import { format, parseISO, addDays, startOfWeek, endOfWeek, isToday, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formate une date en chaîne lisible française
 * @param date - Date à formater
 * @param pattern - Pattern de formatage (optionnel)
 * @returns Chaîne formatée
 */
export const formatDateFr = (date: Date | string, pattern: string = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, pattern, { locale: fr });
};

/**
 * Formate une heure en format français
 * @param time - Heure au format HH:MM
 * @returns Heure formatée
 */
export const formatTime = (time: string): string => {
  return time; // Déjà au bon format HH:MM
};

/**
 * Génère les jours de la semaine courante
 * @param startDate - Date de référence (optionnelle)
 * @returns Array des jours de la semaine
 */
export const getWeekDays = (startDate?: Date) => {
  const referenceDate = startDate || new Date();
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 });

  return Array(7)
    .fill(null)
    .map((_, index) => {
      const date = addDays(monday, index);
      return {
        fullDate: date,
        dayName: format(date, 'EEEE', { locale: fr }),
        dayNumber: format(date, 'd'),
        month: format(date, 'MMMM', { locale: fr }),
        isToday: isToday(date),
        formattedDate: format(date, 'yyyy-MM-dd')
      };
    });
};

/**
 * Génère les heures de travail (7h-20h)
 * @returns Array des heures
 */
export const getWorkingHours = (): string[] => {
  return Array(14)
    .fill(null)
    .map((_, index) => {
      const hour = index + 7;
      return `${hour.toString().padStart(2, '0')}:00`;
    });
};

/**
 * Vérifie si deux dates sont le même jour
 * @param date1 - Première date
 * @param date2 - Deuxième date
 * @returns True si même jour
 */
export const isSameDate = (date1: Date | string, date2: Date | string): boolean => {
  const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
  const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
  return isSameDay(d1, d2);
};

/**
 * Calcule la durée entre deux heures
 * @param startTime - Heure de début (HH:MM)
 * @param endTime - Heure de fin (HH:MM)
 * @returns Durée en minutes
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  
  return endTotalMin - startTotalMin;
};

/**
 * Ajoute une durée à une heure
 * @param time - Heure de base (HH:MM)
 * @param durationMinutes - Durée à ajouter en minutes
 * @returns Nouvelle heure (HH:MM)
 */
export const addTimeMinutes = (time: string, durationMinutes: number): string => {
  const [hour, min] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + min + durationMinutes;
  
  const newHour = Math.floor(totalMinutes / 60);
  const newMin = totalMinutes % 60;
  
  return `${newHour.toString().padStart(2, '0')}:${newMin.toString().padStart(2, '0')}`;
};
