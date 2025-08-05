
// Importation de l'instance Axios personnalisée pour les appels API
import api from './api';

// Importation du module "sonner" pour afficher des notifications (toast)
import { toast } from 'sonner';

/**
 * Interface utilisateur pour typer les objets utilisateurs
 * Définit la structure des données utilisateur dans l'application
 */
export interface User {
  readonly id: number;            // Identifiant unique
  readonly nom: string;           // Nom de famille
  readonly prenom: string;        // Prénom
  readonly email: string;         // Adresse email
  readonly password: string;      // Mot de passe (stocké temporairement côté client)
  readonly genre: string;         // Sexe de l'utilisateur (ex : "homme", "femme")
  readonly adresse: string;       // Adresse postale
  readonly phone: string;         // Numéro de téléphone
}

// Variable globale pour stocker l'utilisateur actuellement connecté
let loggedInUser: User | null = null;

/**
 * Service d'authentification centralisé
 * Gère toutes les opérations liées à l'authentification utilisateur
 */
export const AuthService = {

  /**
   * Fonction de connexion utilisateur
   * Vérifie les identifiants auprès du serveur et stocke la session
   * @param email - Adresse email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns Promise<boolean> True si connexion réussie, false sinon
   */
  login: async (email: string, password: string): Promise<boolean> => {
    try {
      // Envoi d'une requête POST à l'API pour vérifier les identifiants
      const response = await api.post('/users/login', { email, password });

      // Si l'utilisateur est retourné par l'API
      if (response.data.user) {
        // Stockage en mémoire de l'utilisateur connecté
        loggedInUser = response.data.user;

        // Enregistrement de l'utilisateur dans le localStorage (persistance)
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Affichage d'un message de bienvenue personnalisé selon le genre
        toast.success(`Bienvenue ${response.data.user.genre === 'homme' ? 'M.' : 'Mme'} ${response.data.user.nom}`, {
          className: "bg-indigo-700 text-white border-indigo-600"
        });

        // Retourne "true" pour indiquer une connexion réussie
        return true;
      }

      // Retourne "false" si aucun utilisateur n'a été retourné
      return false;
    } catch (error: any) {
      // En cas d'erreur (ex : mauvais identifiants), afficher une erreur toast
      toast.error(error.response?.data?.error || "Email ou mot de passe erroné", {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  },

  /**
   * Fonction d'inscription d'un nouvel utilisateur
   * Crée un compte utilisateur avec validation côté serveur
   * @param user - Données de l'utilisateur (sans ID qui sera généré)
   * @returns Promise<boolean> True si inscription réussie, false sinon
   */
  register: async (user: Omit<User, 'id'>): Promise<boolean> => {
    try {
      // Envoi des données du nouvel utilisateur à l'API
      const response = await api.post('/users/register', user);

      // Si la réponse contient un utilisateur, l'inscription est réussie
      if (response.data.user) {
        toast.success("Compte créé avec succès", {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return true;
      }

      // Sinon, l'inscription a échoué
      return false;
    } catch (error: any) {
      // Affichage d'une erreur si l'email est déjà utilisé ou autre problème
      toast.error(error.response?.data?.error || "Un compte existe déjà avec cet email", {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  },

  /**
   * Fonction de réinitialisation du mot de passe
   * Permet à un utilisateur de changer son mot de passe
   * @param email - Email de l'utilisateur
   * @param newPassword - Nouveau mot de passe
   * @returns Promise<boolean> True si réinitialisation réussie, false sinon
   */
  resetPassword: async (email: string, newPassword: string): Promise<boolean> => {
    try {
      // Envoi de la demande de réinitialisation à l'API
      const response = await api.post('/users/reset-password', { email, newPassword });

      // Si l'API confirme la modification
      if (response.data.message) {
        toast.success("Mot de passe modifié avec succès", {
          className: "bg-indigo-700 text-white border-indigo-600"
        });
        return true;
      }

      // Sinon, la demande a échoué
      return false;
    } catch (error: any) {
      // Affichage d'une erreur en cas d'échec
      toast.error(error.response?.data?.error || "Erreur lors de la réinitialisation du mot de passe", {
        className: "bg-indigo-700 text-white border-indigo-600"
      });
      return false;
    }
  },

  /**
   * Vérifie si un email est déjà enregistré
   * Utile pour la validation dynamique des formulaires
   * @param email - Email à vérifier
   * @returns Promise<boolean> True si email existe, false sinon
   */
  checkEmail: async (email: string): Promise<boolean> => {
    try {
      // Requête GET à l'API pour vérifier l'existence d'un email
      const response = await api.get(`/users/check-email/${email}`);
      return response.data.exists; // Retourne true si email existe
    } catch (error) {
      return false; // En cas d'erreur, retourne false
    }
  },

  /**
   * Fonction de déconnexion
   * Nettoie la session utilisateur locale
   */
  logout: (): void => {
    loggedInUser = null; // Réinitialise l'utilisateur en mémoire
    localStorage.removeItem('user'); // Supprime les données locales

    toast.info("Vous êtes déconnecté", {
      className: "bg-indigo-700 text-white border-indigo-600"
    });
  },

  /**
   * Fonction qui retourne l'utilisateur actuellement connecté
   * Vérifie d'abord la mémoire, puis le localStorage
   * @returns User | null Utilisateur connecté ou null si aucun
   */
  getCurrentUser: (): User | null => {
    // Si déjà chargé en mémoire, retourne directement
    if (loggedInUser) return loggedInUser;

    // Sinon, vérifie s'il est stocké en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      loggedInUser = JSON.parse(storedUser); // Recharge en mémoire
      return loggedInUser;
    }

    // Aucun utilisateur connecté
    return null;
  }
};
