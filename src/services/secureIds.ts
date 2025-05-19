
import { nanoid } from 'nanoid';

// Stockage en mémoire des mappings entre IDs sécurisés et IDs réels
const secureIdMap = new Map<string, string>();
const reverseMap = new Map<string, string>();

// Type d'entité pour identifier les différentes sections sécurisées
export type EntityType = 'product' | 'admin' | 'profile' | 'orders';

/**
 * Génère un ID sécurisé pour un ID réel donné
 * @param realId L'ID réel
 * @param type Type d'entité (produit, admin, etc.)
 * @returns Un ID sécurisé unique
 */
export const generateSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Générer un ID sécurisé aléatoire avec un préfixe pour le type
  const secureId = `${type}_${nanoid(16)}_${Date.now().toString(36)}`;
  
  // Stocker la correspondance dans les maps
  secureIdMap.set(realId, secureId);
  reverseMap.set(secureId, realId);
  
  return secureId;
};

/**
 * Obtient l'ID réel à partir d'un ID sécurisé
 * @param secureId L'ID sécurisé
 * @returns L'ID réel correspondant ou undefined si non trouvé
 */
export const getRealId = (secureId: string): string | undefined => {
  return reverseMap.get(secureId);
};

/**
 * Obtient l'ID sécurisé pour un ID réel
 * Si un ID sécurisé existe déjà, le remplacer par un nouveau
 * @param realId L'ID réel
 * @param type Type d'entité (produit, admin, etc.)
 * @returns L'ID sécurisé
 */
export const getSecureId = (realId: string, type: EntityType = 'product'): string => {
  // Toujours générer un nouvel ID sécurisé pour éviter la réutilisation
  return generateSecureId(realId, type);
};

/**
 * Réinitialise tous les mappings d'IDs
 * À appeler lors de la déconnexion ou du changement de navigation
 */
export const resetSecureIds = (): void => {
  secureIdMap.clear();
  reverseMap.clear();
};

/**
 * Vérifier si un ID sécurisé est valide
 * @param secureId L'ID sécurisé à vérifier
 * @returns true si l'ID est valide, false sinon
 */
export const isValidSecureId = (secureId: string): boolean => {
  return reverseMap.has(secureId);
};

/**
 * Obtenir le type d'entité à partir d'un ID sécurisé
 * @param secureId L'ID sécurisé
 * @returns Le type d'entité ou undefined si non trouvé
 */
export const getEntityType = (secureId: string): EntityType | undefined => {
  if (!secureId) return undefined;
  const parts = secureId.split('_');
  if (parts.length < 2) return undefined;
  
  return parts[0] as EntityType;
};

// Routes sécurisées statiques (pour les routes sans ID)
const staticSecureRoutes = new Map<string, string>();

/**
 * Obtient ou génère une route sécurisée pour une route statique
 * @param routePath Chemin de la route réelle (ex: '/admin/produits')
 * @returns Une route sécurisée (ex: '/admin_xyz123')
 */
export const getSecureRoute = (routePath: string): string => {
  // Si la route existe déjà, la retourner
  if (staticSecureRoutes.has(routePath)) {
    return staticSecureRoutes.get(routePath)!;
  }
  
  // Sinon, générer une nouvelle route sécurisée
  const secureRoute = `/${nanoid(24)}`;
  staticSecureRoutes.set(routePath, secureRoute);
  reverseMap.set(secureRoute.substring(1), routePath);
  
  return secureRoute;
};

/**
 * Obtient la route réelle à partir d'une route sécurisée
 * @param secureRoute Route sécurisée (sans le '/' initial)
 * @returns La route réelle ou undefined si non trouvée
 */
export const getRealRoute = (secureRoute: string): string | undefined => {
  return reverseMap.get(secureRoute);
};
