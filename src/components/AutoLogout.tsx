
import { useEffect } from 'react';

// Composant qui ne fait plus rien - déconnexion automatique désactivée
const AutoLogout = () => {
  // Plus de logique de déconnexion automatique
  // Le composant reste pour la compatibilité mais ne fait rien
  
  useEffect(() => {
    console.log('AutoLogout désactivé - pas de déconnexion automatique');
  }, []);
  
  // Ce composant ne rend rien et ne fait rien
  return null;
};

export default AutoLogout;
