
import CryptoJS from 'crypto-js';

const CLE_CRYPTAGE = process.env.REACT_APP_ENCRYPTION_KEY || 'cle-par-defaut-a-changer';

export const cryptageCartes = {
  /**
   * Crypte les données de la carte bancaire
   */
  crypterDonneesCarte: (donneesCarte: {
    numeroCarte: string;
    nomTitulaire: string;
    dateExpiration: string;
    cvv: string;
  }) => {
    try {
      const donneesJSON = JSON.stringify({
        numeroCarte: donneesCarte.numeroCarte.replace(/\s/g, ''),
        nomTitulaire: donneesCarte.nomTitulaire,
        dateExpiration: donneesCarte.dateExpiration,
        // Ne jamais stocker le CVV
        cvv: '', 
        dateEnregistrement: new Date().toISOString()
      });
      
      return CryptoJS.AES.encrypt(donneesJSON, CLE_CRYPTAGE).toString();
    } catch (erreur) {
      console.error('Erreur lors du cryptage:', erreur);
      throw new Error('Impossible de crypter les données');
    }
  },

  /**
   * Décrypte les données de la carte bancaire
   */
  decrypterDonneesCarte: (donneesChiffrees: string) => {
    try {
      const octets = CryptoJS.AES.decrypt(donneesChiffrees, CLE_CRYPTAGE);
      const donneesJSON = octets.toString(CryptoJS.enc.Utf8);
      return JSON.parse(donneesJSON);
    } catch (erreur) {
      console.error('Erreur lors du décryptage:', erreur);
      throw new Error('Impossible de décrypter les données');
    }
  },

  /**
   * Masque le numéro de carte pour l'affichage
   */
  masquerNumeroCarte: (numeroCarte: string) => {
    const numeroNettoye = numeroCarte.replace(/\s/g, '');
    return `**** **** **** ${numeroNettoye.slice(-4)}`;
  },

  /**
   * Valide le format du numéro de carte
   */
  validerNumeroCarte: (numeroCarte: string) => {
    const numeroNettoye = numeroCarte.replace(/\s/g, '');
    
    // Vérification de la longueur
    if (numeroNettoye.length < 13 || numeroNettoye.length > 19) {
      return false;
    }
    
    // Algorithme de Luhn
    let somme = 0;
    let paire = false;
    
    for (let i = numeroNettoye.length - 1; i >= 0; i--) {
      let chiffre = parseInt(numeroNettoye.charAt(i), 10);
      
      if (paire) {
        chiffre *= 2;
        if (chiffre > 9) {
          chiffre -= 9;
        }
      }
      
      somme += chiffre;
      paire = !paire;
    }
    
    return somme % 10 === 0;
  }
};
