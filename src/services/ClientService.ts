
import api from './api';
import { toast } from 'sonner';

export interface Client {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  dateNaissance?: string;
  notes?: string;
  dateCreation: string;
  derniereVisite?: string;
  status: 'actif' | 'inactif';
  totalRendezVous: number;
}

export const ClientService = {
  // Récupérer tous les clients
  getAllClients: async (): Promise<Client[]> => {
    try {
      const response = await api.get('/clients');
      return response.data;
    } catch (error: any) {
      toast.error('Erreur lors de la récupération des clients');
      return [];
    }
  },

  // Ajouter un nouveau client
  addClient: async (clientData: Omit<Client, 'id' | 'dateCreation' | 'status' | 'totalRendezVous'>): Promise<boolean> => {
    try {
      const response = await api.post('/clients', {
        ...clientData,
        email: clientData.email || '',
        dateCreation: new Date().toISOString().split('T')[0],
        status: 'actif',
        totalRendezVous: 0
      });
      
      if (response.data.success) {
        toast.success('Client ajouté avec succès !');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'ajout du client');
      return false;
    }
  },

  // Modifier un client
  updateClient: async (id: number, clientData: Partial<Client>): Promise<boolean> => {
    try {
      const response = await api.put(`/clients/${id}`, clientData);
      
      if (response.data.success) {
        toast.success('Client modifié avec succès !');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la modification du client');
      return false;
    }
  },

  // Supprimer un client
  deleteClient: async (id: number): Promise<boolean> => {
    try {
      const response = await api.delete(`/clients/${id}`);
      
      if (response.data.success) {
        toast.success('Client supprimé avec succès !');
        return true;
      }
      
      return false;
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du client');
      return false;
    }
  }
};
