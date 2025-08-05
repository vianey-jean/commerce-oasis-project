
import api from './api';
import { toast } from 'sonner';

export interface UpdateUserData {
  nom?: string;
  prenom?: string;
  email?: string;
  phone?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  marketingEmails: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showEmail: boolean;
  showPhone: boolean;
  dataSharing: boolean;
}

// Fonction helper pour obtenir l'ID utilisateur
const getUserId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id;
};

// Fonction helper pour ajouter l'ID utilisateur dans les headers
const getAuthHeaders = () => {
  const userId = getUserId();
  return userId ? { 'user-id': userId.toString() } : {};
};

export const UserService = {
  // Vérifier le mot de passe actuel
  verifyCurrentPassword: async (currentPassword: string): Promise<boolean> => {
    try {
      const response = await api.post('/users/verify-password', 
        { currentPassword },
        { headers: getAuthHeaders() }
      );
      return response.data.valid;
    } catch (error: any) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      return false;
    }
  },

  // Mettre à jour le profil utilisateur
  updateProfile: async (userData: UpdateUserData): Promise<boolean> => {
    try {
      const response = await api.put('/users/profile', userData, {
        headers: getAuthHeaders()
      });
      if (response.data.user) {
        // Mettre à jour le localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...currentUser, ...response.data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour du profil');
      return false;
    }
  },

  // Supprimer le compte utilisateur
  deleteAccount: async (): Promise<boolean> => {
    try {
      const response = await api.delete('/users/profile', {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        // Supprimer les données locales
        localStorage.removeItem('user');
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la suppression du compte');
      return false;
    }
  },

  // Changer le mot de passe
  changePassword: async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await api.put('/users/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error(error.response?.data?.error || 'Erreur lors du changement de mot de passe');
      return false;
    }
  },

  // Récupérer les paramètres de notification
  getNotificationSettings: async (): Promise<NotificationSettings | null> => {
    try {
      const response = await api.get('/users/notification-settings', {
        headers: getAuthHeaders()
      });
      return response.data.settings;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des paramètres de notification:', error);
      return null;
    }
  },

  // Mettre à jour les paramètres de notification
  updateNotificationSettings: async (settings: NotificationSettings): Promise<boolean> => {
    try {
      const response = await api.put('/users/notification-settings', settings, {
        headers: getAuthHeaders()
      });
      return response.data.success;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des paramètres de notification:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour des paramètres');
      return false;
    }
  },

  // Récupérer les paramètres de confidentialité
  getPrivacySettings: async (): Promise<PrivacySettings | null> => {
    try {
      const response = await api.get('/users/privacy-settings', {
        headers: getAuthHeaders()
      });
      return response.data.settings;
    } catch (error: any) {
      console.error('Erreur lors de la récupération des paramètres de confidentialité:', error);
      return null;
    }
  },

  // Mettre à jour les paramètres de confidentialité
  updatePrivacySettings: async (settings: PrivacySettings): Promise<boolean> => {
    try {
      const response = await api.put('/users/privacy-settings', settings, {
        headers: getAuthHeaders()
      });
      return response.data.success;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour des paramètres de confidentialité:', error);
      toast.error(error.response?.data?.error || 'Erreur lors de la mise à jour des paramètres');
      return false;
    }
  }
};
