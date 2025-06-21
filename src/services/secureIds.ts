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

// Fonctions pour les routes sécurisées
export const initSecureRoutes = () => {
  // Simulation d'initialisation de routes sécurisées
  return new Map([
    ['/admin', '/secure-admin-route'],
    ['/profile', '/secure-profile-route'],
    ['/orders', '/secure-orders-route']
  ]);
};

export const getSecureRoute = (route: string) => {
  // Simulation de récupération de route sécurisée
  const routes: Record<string, string> = {
    '/admin': '/secure-admin-route',
    '/profile': '/secure-profile-route', 
    '/orders': '/secure-orders-route',
    '/flash-sale': '/secure-flash-sale-route'
  };
  return routes[route] || route;
};

export const getRealRoute = (secureRoute: string) => {
  // Simulation de récupération de route réelle
  const routes: Record<string, string> = {
    'secure-admin-route': '/admin',
    'secure-profile-route': '/profile',
    'secure-orders-route': '/orders'
  };
  return routes[secureRoute];
};

export const isValidSecureId = (secureId: string) => {
  return secureId && secureId.length > 0;
};

export const getEntityType = (secureId: string) => {
  if (secureId.includes('ORD-')) return 'order';
  return 'product';
};

export const getRealId = (secureId: string) => {
  try {
    return decoderIdSecurise(secureId);
  } catch {
    return secureId;
  }
};

export const getSecureOrderId = (orderId: string) => {
  return obtenirIdSecurise(orderId, 'order');
};
