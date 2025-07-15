// Importation de l'instance Axios personnalisée pour les requêtes HTTP vers l’API backend
import api from './api';

// Importation de la bibliothèque "sonner" pour afficher des notifications (toasts)
import { toast } from 'sonner';

// Définition de l'interface "ContactForm" pour typer les données du formulaire de contact
export interface ContactForm {
  nom: string;      // Nom de l'expéditeur
  sujet: string;    // Sujet du message
  message: string;  // Contenu du message
  email: string;    // Adresse email de l'expéditeur
}

// Déclaration du service de contact
export const ContactService = {

  // Méthode asynchrone d’envoi du formulaire de contact
  send: async (formData: ContactForm): Promise<boolean> => {
    try {
      // Envoi des données du formulaire au backend via une requête POST
      const response = await api.post('/contact', formData);
      
      // Si le backend retourne une propriété "message", on considère que l'envoi a réussi
      if (response.data.message) {
        // Affichage d'une notification de succès
        toast.success("Votre message a été envoyé avec succès");
        return true; // Retourne "true" pour signaler le succès
      }
      
      // Si la réponse ne contient pas "message", on considère l'envoi comme échoué
      return false;
    } catch (error: any) {
      // En cas d'erreur (réseau, serveur, validation...), affichage d'une notification d'erreur
      toast.error(error.response?.data?.error || "Erreur lors de l'envoi du message");
      return false; // Retourne "false" pour signaler l'échec
    }
  }
};
