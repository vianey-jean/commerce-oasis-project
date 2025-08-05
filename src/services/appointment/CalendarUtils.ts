
import { format, addDays, startOfWeek } from 'date-fns';
import { AppointmentAPI } from './AppointmentAPI';
import { Appointment } from './types';

export class CalendarUtils {
  static getWeekDays() {
    const today = new Date();
    const monday = startOfWeek(today, { weekStartsOn: 1 });

    return Array(7)
      .fill(null)
      .map((_, index) => {
        const date = addDays(monday, index);
        return {
          fullDate: date,
          dayName: format(date, 'EEEE'),
          dayNumber: format(date, 'd'),
          month: format(date, 'MMMM'),
          isToday: format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')
        };
      });
  }

  static getHours(): string[] {
    return Array(14)
      .fill(null)
      .map((_, index) => {
        const hour = index + 7;
        return `${hour}:00`;
      });
  }

  static async getCurrentWeekAppointments(userId?: number): Promise<Appointment[]> {
    try {
      const today = new Date();
      const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
      const endOfCurrentWeek = addDays(startOfCurrentWeek, 6);

      const startDateStr = format(startOfCurrentWeek, 'yyyy-MM-dd');
      const endDateStr = format(endOfCurrentWeek, 'yyyy-MM-dd');

      return await AppointmentAPI.getByDateRange(startDateStr, endDateStr);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous de la semaine:', error);
      return [];
    }
  }
}
