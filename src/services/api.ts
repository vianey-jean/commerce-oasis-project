
// Importation de la bibliothèque Axios pour effectuer des requêtes HTTP
import axios from 'axios';

// Définition de l'URL de base de l'API
const AUTH_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;

// Création d'une instance Axios avec une configuration par défaut
const api = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`,                        // Toutes les requêtes utiliseront cette URL de base
  headers: {
    'Content-Type': 'application/json',   // Format des données envoyées : JSON
  },
});

// Intercepteur de requête : il est exécuté **avant chaque requête**
api.interceptors.request.use(
  (config) => {
    // Récupération des données utilisateur stockées localement (si l'utilisateur est connecté)
    const user = localStorage.getItem('user');
    if (user) {
      // Conversion des données JSON en objet JavaScript
      const userData = JSON.parse(user);

      // Ajout de l'identifiant utilisateur dans les en-têtes de la requête (ex: pour l'authentification)
      config.headers['user-id'] = userData.id;
    }

    // Retour de la configuration mise à jour
    return config;
  },
  (error) => {
    // En cas d'erreur lors de la configuration de la requête, elle est rejetée
    return Promise.reject(error);
  }
);

// Intercepteur de réponse : il est exécuté **après réception de la réponse**
api.interceptors.response.use(
  (response) => response, // Si tout va bien, la réponse est renvoyée telle quelle

  (error) => {
    // Vérifie si l'erreur est due à une authentification invalide (code HTTP 401)
    if (error.response && error.response.status === 401) {
      // Suppression des données utilisateur du localStorage
      localStorage.removeItem('user');

      // Redirection automatique vers la page de connexion
      window.location.href = '/connexion';
    }

    // Rejet de l'erreur pour la gérer ailleurs dans l'application
    return Promise.reject(error);
  }
);

// Exportation de l'instance Axios configurée pour être utilisée dans toute l'application
export default api;
