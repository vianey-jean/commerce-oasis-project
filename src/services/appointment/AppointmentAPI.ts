
import api from '../api';
import { AuthService } from '../AuthService';
import { toast } from 'sonner';
import { Appointment } from './types';

export class AppointmentAPI {
  private static getAuthHeaders() {
    const currentUser = AuthService.getCurrentUser();
    return currentUser ? { 'user-id': currentUser.id.toString() } : {};
  }

  static async getAll(): Promise<Appointment[]> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) return [];

      const response = await api.get('/appointments', { headers });
      const appointments = response.data.appointments || [];
      return appointments.filter((appointment: Appointment) => appointment.statut === 'validé');
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      return [];
    }
  }

  static async getAllWithStatus(): Promise<Appointment[]> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) return [];

      const response = await api.get('/appointments', { headers });
      return response.data.appointments || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      return [];
    }
  }

  static async getById(id: number): Promise<Appointment | undefined> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) return undefined;

      const response = await api.get(`/appointments/${id}`, { headers });
      return response.data.appointment;
    } catch (error) {
      console.error('Erreur lors de la récupération du rendez-vous:', error);
      return undefined;
    }
  }

  static async create(appointment: Omit<Appointment, 'id'>): Promise<Appointment | null> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) {
        toast.error('Vous devez être connecté pour ajouter un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return null;
      }

      const response = await api.post('/appointments', appointment, { headers });
      toast.success('Rendez-vous ajouté avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return response.data.appointment;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return null;
    }
  }

  static async update(appointment: Appointment): Promise<boolean> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) {
        toast.error('Vous devez être connecté pour modifier un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return false;
      }

      await api.put(`/appointments/${appointment.id}`, appointment, { headers });
      toast.success('Rendez-vous mis à jour avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  }

  static async delete(id: number): Promise<boolean> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) {
        toast.error('Vous devez être connecté pour supprimer un rendez-vous', {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return false;
      }

      await api.delete(`/appointments/${id}`, { headers });
      toast.success('Rendez-vous supprimé avec succès', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du rendez-vous', {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  }

  static async getByDateRange(startDate: string, endDate: string): Promise<Appointment[]> {
    try {
      const headers = AppointmentAPI.getAuthHeaders();
      if (!Object.keys(headers).length) return [];

      const response = await api.get(`/appointments/week/${startDate}/${endDate}`, { headers });
      const appointments = response.data.appointments || [];
      return appointments.filter((appointment: Appointment) => appointment.statut === 'validé');
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous par plage:', error);
      return [];
    }
  }
}
