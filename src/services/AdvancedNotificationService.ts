
import { NotificationManager } from './notification/NotificationManager';
import { ToastNotifications } from './notification/ToastNotifications';

export type { NotificationSettings } from './notification/types';

export class AdvancedNotificationService {
  // Déléguer vers les services spécialisés
  static initializeNotifications = NotificationManager.initializeNotifications;
  static scheduleUpcomingReminders = NotificationManager.scheduleUpcomingReminders;
  static clearAllTimers = NotificationManager.clearAllTimers;
  static updateSettings = NotificationManager.updateSettings;
  static getSettings = NotificationManager.getSettings;

  // Toast notifications
  static showAppointmentCreated = ToastNotifications.showAppointmentCreated;
  static showAppointmentUpdated = ToastNotifications.showAppointmentUpdated;
  static showAppointmentDeleted = ToastNotifications.showAppointmentDeleted;
  static showConflictWarning = ToastNotifications.showConflictWarning;
  static showUpcomingToday = ToastNotifications.showUpcomingToday;
}
