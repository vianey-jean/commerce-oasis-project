
/**
 * Utilitaires de formatage
 * Fonctions pures pour le formatage d'affichage
 */

/**
 * Formate un nom complet
 * @param nom - Nom de famille
 * @param prenom - Prénom
 * @returns Nom formaté
 */
export const formatFullName = (nom: string, prenom: string): string => {
  return `${prenom} ${nom}`.trim();
};

/**
 * Formate un nom avec civilité
 * @param nom - Nom de famille
 * @param prenom - Prénom
 * @param genre - Genre ('homme' | 'femme')
 * @returns Nom avec civilité
 */
export const formatNameWithTitle = (nom: string, prenom: string, genre: string): string => {
  const title = genre === 'homme' ? 'M.' : 'Mme';
  return `${title} ${formatFullName(nom, prenom)}`;
};

/**
 * Formate une durée en texte lisible
 * @param minutes - Durée en minutes
 * @returns Texte formaté (ex: "1h 30min")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
};

/**
 * Formate un numéro de téléphone français
 * @param phone - Numéro brut
 * @returns Numéro formaté (ex: "01 23 45 67 89")
 */
export const formatFrenchPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  }
  
  return phone; // Retourne tel quel si format non reconnu
};

/**
 * Formate une adresse email (masquage partiel)
 * @param email - Email à masquer partiellement
 * @returns Email masqué (ex: "j***@example.com")
 */
export const formatMaskedEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (local.length <= 2) return email;
  
  const maskedLocal = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
  return `${maskedLocal}@${domain}`;
};

/**
 * Formate un texte en capitalisant la première lettre
 * @param text - Texte à capitaliser
 * @returns Texte capitalisé
 */
export const capitalize = (text: string): string => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Tronque un texte avec des points de suspension
 * @param text - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué
 */
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

/**
 * Formate un statut de rendez-vous
 * @param status - Statut brut
 * @returns Statut formaté avec couleur
 */
export const formatAppointmentStatus = (status: string) => {
  const statusMap = {
    'validé': { label: 'Confirmé', color: 'text-green-600' },
    'annulé': { label: 'Annulé', color: 'text-red-600' },
    'en_attente': { label: 'En attente', color: 'text-yellow-600' },
    'terminé': { label: 'Terminé', color: 'text-gray-600' }
  };
  
  return statusMap[status as keyof typeof statusMap] || { 
    label: capitalize(status), 
    color: 'text-gray-600' 
  };
};
