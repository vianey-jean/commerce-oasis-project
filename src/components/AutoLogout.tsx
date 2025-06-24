
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';

// Durée d'inactivité en millisecondes (5 minutes)
const TIMEOUT_DURATION = 5 * 60 * 1000; 

// Composant qui gère la déconnexion automatique après inactivité
const AutoLogout = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Variable pour stocker l'ID du timer
    let timeoutId: NodeJS.Timeout;
    
    // Fonction pour réinitialiser le timer
    const resetTimer = () => {
      // Annuler le timer existant
      clearTimeout(timeoutId);
      
      // Définir un nouveau timer
      timeoutId = setTimeout(() => {
        // Déconnecter l'utilisateur si connecté
        const user = AuthService.getCurrentUser();
        if (user) {
          AuthService.logout();
          navigate('/connexion');
          toast.info('Session expirée. Veuillez vous reconnecter.', {
            duration: 5000,
          });
        }
      }, TIMEOUT_DURATION);
    };
    
    // Événements qui réinitialisent le timer (activité utilisateur)
    const events = ['mousedown', 'keydown', 'scroll', 'mousemove'];
    
    // Ajouter les écouteurs d'événements
    events.forEach(event => document.addEventListener(event, resetTimer));
    
    // Initialiser le timer
    resetTimer();
    
    // Nettoyer les écouteurs d'événements à la destruction du composant
    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer));
    };
  }, [navigate]);
  
  // Ce composant ne rend rien, il fonctionne en arrière-plan
  return null;
};

export default AutoLogout;
