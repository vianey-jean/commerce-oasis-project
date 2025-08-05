
/**
 * Utilitaires de validation
 * Fonctions pures pour la validation de données
 */

/**
 * Valide un format d'email
 * @param email - Email à valider
 * @returns True si valide
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valide un format d'heure (HH:MM)
 * @param time - Heure à valider
 * @returns True si valide
 */
export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Valide un format de date (YYYY-MM-DD)
 * @param date - Date à valider
 * @returns True si valide
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj.getTime());
};

/**
 * Valide la force d'un mot de passe
 * @param password - Mot de passe à valider
 * @returns Objet avec score et suggestions
 */
export const validatePasswordStrength = (password: string) => {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) {
    score += 25;
  } else {
    suggestions.push('Au moins 8 caractères');
  }

  if (/[a-z]/.test(password)) {
    score += 25;
  } else {
    suggestions.push('Au moins une minuscule');
  }

  if (/[A-Z]/.test(password)) {
    score += 25;
  } else {
    suggestions.push('Au moins une majuscule');
  }

  if (/[0-9]/.test(password)) {
    score += 25;
  } else {
    suggestions.push('Au moins un chiffre');
  }

  return {
    score,
    isStrong: score >= 75,
    suggestions,
    level: score >= 75 ? 'strong' : score >= 50 ? 'medium' : 'weak'
  };
};

/**
 * Valide un numéro de téléphone français
 * @param phone - Numéro à valider
 * @returns True si valide
 */
export const isValidFrenchPhone = (phone: string): boolean => {
  const cleanPhone = phone.replace(/\s/g, '');
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(cleanPhone);
};

/**
 * Nettoie et valide une chaîne de caractères
 * @param input - Chaîne à nettoyer
 * @param maxLength - Longueur maximale
 * @returns Chaîne nettoyée
 */
export const sanitizeString = (input: string, maxLength: number = 255): string => {
  return input.trim().slice(0, maxLength);
};

/**
 * Valide une durée de rendez-vous
 * @param duration - Durée en minutes
 * @returns True si valide (entre 15 min et 8h)
 */
export const isValidDuration = (duration: number): boolean => {
  return duration >= 15 && duration <= 480; // 15 min à 8h
};
