/**
 * Service d'envoi d'emails
 * Gère l'envoi de codes de réinitialisation par email
 */

interface EmailData {
  to: string;
  subject: string;
  code: string;
}

interface CodeData {
  code: string;
  email: string;
  timestamp: number;
  expiresAt: number;
}

// Stockage temporaire des codes (en production, utiliser une base de données)
const resetCodes = new Map<string, CodeData>();

export const EmailService = {
  /**
   * Génère un code aléatoire de 6 chiffres
   */
  generateCode: (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Envoie un code de réinitialisation par email (simulation)
   */
  sendResetCode: async (email: string): Promise<{ success: boolean; code?: string }> => {
    try {
      const code = EmailService.generateCode();
      const timestamp = Date.now();
      const expiresAt = timestamp + (24 * 60 * 60 * 1000); // 24h
      
      // Stocker le code avec expiration
      resetCodes.set(email, {
        code,
        email,
        timestamp,
        expiresAt
      });
      
      // Simulation d'envoi d'email
      console.log(`Email envoyé à ${email} avec le code: ${code}`);
      
      // En production, utiliser un service comme SendGrid, Mailgun, etc.
      // await sendEmail({
      //   to: email,
      //   subject: 'Code de réinitialisation de mot de passe',
      //   html: `Votre code de réinitialisation est: <strong>${code}</strong>`
      // });
      
      return { success: true, code }; // En production, ne pas retourner le code
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error);
      return { success: false };
    }
  },

  /**
   * Vérifie si un code est valide
   */
  verifyCode: (email: string, code: string): boolean => {
    const storedData = resetCodes.get(email);
    
    if (!storedData) {
      return false;
    }
    
    // Vérifier si le code n'a pas expiré
    if (Date.now() > storedData.expiresAt) {
      resetCodes.delete(email);
      return false;
    }
    
    // Vérifier si le code correspond
    return storedData.code === code;
  },

  /**
   * Supprime un code après utilisation
   */
  invalidateCode: (email: string): void => {
    resetCodes.delete(email);
  }
};