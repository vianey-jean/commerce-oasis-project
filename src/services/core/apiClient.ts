
import axios from 'axios';

const URL_BASE_AUTH = import.meta.env.VITE_API_BASE_URL;

export const clientApi = axios.create({
  baseURL: `${URL_BASE_AUTH}/api`,
  timeout: 15000, // Réduit de 30s à 15s pour des réponses plus rapides
});

// Intercepteur de requête optimisé
clientApi.interceptors.request.use(
  (config) => {
    const jeton = localStorage.getItem('authToken');
    if (jeton) {
      config.headers['Authorization'] = `Bearer ${jeton}`;
    }

    // Optimisation: cache-busting seulement pour GET
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Log simplifié pour de meilleures performances
    console.log(`${config.method?.toUpperCase()} → ${config.url}`);

    return config;
  },
  (erreur) => {
    console.error('Erreur de requête:', erreur);
    return Promise.reject(erreur);
  }
);

// Intercepteur de réponse optimisé
clientApi.interceptors.response.use(
  reponse => {
    console.log(`✓ ${reponse.config.url}`);
    return reponse;
  },
  erreur => {
    console.error("Erreur API:", erreur.response || erreur);
    
    if (erreur.response && erreur.response.status === 401 && 
        !erreur.config.url.includes('/auth/login') && 
        !erreur.config.url.includes('/auth/verify-token')) {
      console.log("Session expirée, redirection vers la page de connexion...");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(erreur);
  }
);

// Export with alias for compatibility
export const apiClient = clientApi;
export default clientApi;
