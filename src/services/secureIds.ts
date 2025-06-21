
// Fonction pour obtenir un ID sécurisé
export const obtenirIdSecurise = (id: string, type: string = 'product') => {
  // Simple encoding pour la démo - en production, utilisez une vraie fonction de hachage
  return btoa(`${type}_${id}`).replace(/[+=\/]/g, '');
};

// Fonction pour décoder un ID sécurisé
export const decoderIdSecurise = (secureId: string, type: string = 'product') => {
  try {
    const decoded = atob(secureId);
    const prefix = `${type}_`;
    if (decoded.startsWith(prefix)) {
      return decoded.substring(prefix.length);
    }
    return secureId;
  } catch {
    return secureId;
  }
};

// Exports pour compatibilité
export const getSecureId = obtenirIdSecurise;
export const decodeSecureId = decoderIdSecurise;
