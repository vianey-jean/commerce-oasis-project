
import { AppointmentAPI } from './appointment/AppointmentAPI';
import { AppointmentSearch } from './appointment/AppointmentSearch';
import { CalendarUtils } from './appointment/CalendarUtils';

// Réexport des types et classes pour maintenir la compatibilité
export type { Appointment } from './appointment/types';

export const AppointmentService = {
  // API Methods
  getAll: AppointmentAPI.getAll,
  getAllWithStatus: AppointmentAPI.getAllWithStatus,
  getById: AppointmentAPI.getById,
  add: AppointmentAPI.create,
  update: AppointmentAPI.update,
  delete: AppointmentAPI.delete,
  getAppointmentsByDateRange: AppointmentAPI.getByDateRange,

  // Search Methods
  search: AppointmentSearch.search,

  // Calendar Utils
  getWeekDays: CalendarUtils.getWeekDays,
  getHours: CalendarUtils.getHours,
  getCurrentWeekAppointments: CalendarUtils.getCurrentWeekAppointments
};
