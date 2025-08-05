
import api from './api';
import { toast } from 'sonner';

export interface ContactForm {
  nom: string;
  sujet: string;
  message: string;
  email: string;
}

export const ContactService = {
  send: async (formData: ContactForm): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/contact', formData);
      
      if (response.data.message && response.data.messageId) {
        return { 
          success: true, 
          message: "Message envoyé et enregistré avec succès" 
        };
      }
      
      return { 
        success: false, 
        message: "Erreur lors de l'envoi du message" 
      };
    } catch (error: any) {
      return { 
        success: false, 
        message: error.response?.data?.error || "Erreur lors de l'envoi du message" 
      };
    }
  }
};
