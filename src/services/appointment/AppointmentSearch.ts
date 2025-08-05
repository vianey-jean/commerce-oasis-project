
import { Appointment } from './types';
import { AppointmentAPI } from './AppointmentAPI';

export class AppointmentSearch {
  static async search(query: string): Promise<Appointment[]> {
    if (query.length < 3) return [];

    try {
      const allAppointments = await AppointmentAPI.getAllWithStatus();
      
      const filteredAppointments = allAppointments.filter(appointment => {
        const searchableFields = [
          appointment.titre?.toLowerCase() || '',
          appointment.description?.toLowerCase() || '',
          appointment.location?.toLowerCase() || '',
          appointment.nom?.toLowerCase() || '',
          appointment.prenom?.toLowerCase() || '',
          appointment.telephone || '',
          appointment.dateNaissance || '',
          appointment.date || '',
          appointment.heure || ''
        ];
        
        const searchTerm = query.toLowerCase();
        
        return searchableFields.some(field => 
          field.includes(searchTerm)
        );
      });

      return filteredAppointments;
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return [];
    }
  }
}
