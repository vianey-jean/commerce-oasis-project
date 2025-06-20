
import { nanoid } from 'nanoid';

// Stockage en mémoire des mappings entre noms de catégories et IDs sécurisés
const categorySecureMap = new Map<string, string>();
const reverseSecureMap = new Map<string, string>();

// Initialiser les mappings spécifiques demandés
const initSpecificCategoryMappings = () => {
  // Mapping spécifique pour q4C65b37eA67 -> qgfgqergQdsgdsg1324fhsfd
  if (!reverseSecureMap.has('qgfgqergQdsgdsg1324fhsfd')) {
    reverseSecureMap.set('qgfgqergQdsgdsg1324fhsfd', 'q4C65b37eA67');
    categorySecureMap.set('q4C65b37eA67', 'qgfgqergQdsgdsg1324fhsfd');
  }
};

/**
 * Génère un ID sécurisé pour une catégorie
 * @param categoryName Nom de la catégorie
 * @returns ID sécurisé unique
 */
export const generateSecureCategoryId = (categoryName: string): string => {
  // Initialiser les mappings spécifiques au premier appel
  initSpecificCategoryMappings();
  
  // Vérifier si un ID sécurisé existe déjà pour cette catégorie
  if (categorySecureMap.has(categoryName)) {
    return categorySecureMap.get(categoryName)!;
  }
  
  // Générer un nouvel ID sécurisé
  const secureId = nanoid(12);
  
  // Stocker les mappings
  categorySecureMap.set(categoryName, secureId);
  reverseSecureMap.set(secureId, categoryName);
  
  return secureId;
};

/**
 * Obtient le nom réel de la catégorie à partir d'un ID sécurisé
 * @param secureId ID sécurisé
 * @returns Nom réel de la catégorie ou undefined
 */
export const getRealCategoryName = (secureId: string): string | undefined => {
  // Initialiser les mappings spécifiques
  initSpecificCategoryMappings();
  
  return reverseSecureMap.get(secureId);
};

/**
 * Obtient l'ID sécurisé pour une catégorie
 * @param categoryName Nom de la catégorie
 * @returns ID sécurisé
 */
export const getSecureCategoryId = (categoryName: string): string => {
  return generateSecureCategoryId(categoryName);
};
