const fs = require('fs');
const path = require('path');
const EncryptionService = require('../utils/encryption');

const confirmationPath = path.join(__dirname, '../db/confirmation.json');
const lockedAccountsPath = path.join(__dirname, '../db/lockedAccounts.json');

const ConfirmationCode = {
  // Générer un nouveau code de confirmation
  generateCode: (userId) => {
    try {
      const codes = JSON.parse(fs.readFileSync(confirmationPath, 'utf8'));
      
      // Générer un code aléatoire de 6 chiffres
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Crypter le code
      const encryptedCode = EncryptionService.encrypt(code);
      
      const confirmationData = {
        id: Date.now().toString(),
        userId: userId,
        code: encryptedCode,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expire dans 24h
        isUsed: false
      };
      
      codes.push(confirmationData);
      fs.writeFileSync(confirmationPath, JSON.stringify(codes, null, 2));
      
      return code; // Retourner le code non crypté pour l'affichage
    } catch (error) {
      console.error('Erreur génération code:', error);
      return null;
    }
  },

  // Vérifier un code de confirmation
  verifyCode: (userId, code) => {
    try {
      const codes = JSON.parse(fs.readFileSync(confirmationPath, 'utf8'));
      
      // Trouver le code le plus récent pour cet utilisateur
      const userCodes = codes.filter(c => c.userId === userId && !c.isUsed);
      
      if (userCodes.length === 0) return false;
      
      const latestCode = userCodes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
      
      // Vérifier si le code a expiré
      if (new Date() > new Date(latestCode.expiresAt)) {
        return false;
      }
      
      // Décrypter et vérifier le code
      const decryptedCode = EncryptionService.decrypt(latestCode.code);
      
      if (decryptedCode === code) {
        // Marquer le code comme utilisé
        const codeIndex = codes.findIndex(c => c.id === latestCode.id);
        codes[codeIndex].isUsed = true;
        fs.writeFileSync(confirmationPath, JSON.stringify(codes, null, 2));
        
        // Réinitialiser les tentatives échouées
        this.resetFailedAttempts(userId);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur vérification code:', error);
      return false;
    }
  },

  // Enregistrer une tentative échouée
  recordFailedAttempt: (userId) => {
    try {
      const lockedAccounts = JSON.parse(fs.readFileSync(lockedAccountsPath, 'utf8'));
      
      let accountData = lockedAccounts.find(acc => acc.userId === userId);
      
      if (!accountData) {
        accountData = {
          userId: userId,
          failedAttempts: 0,
          isLocked: false,
          lockedAt: null
        };
        lockedAccounts.push(accountData);
      }
      
      accountData.failedAttempts += 1;
      
      // Verrouiller le compte après 3 tentatives
      if (accountData.failedAttempts >= 3) {
        accountData.isLocked = true;
        accountData.lockedAt = new Date().toISOString();
      }
      
      fs.writeFileSync(lockedAccountsPath, JSON.stringify(lockedAccounts, null, 2));
      
      return accountData.isLocked;
    } catch (error) {
      console.error('Erreur enregistrement tentative:', error);
      return false;
    }
  },

  // Réinitialiser les tentatives échouées
  resetFailedAttempts: (userId) => {
    try {
      const lockedAccounts = JSON.parse(fs.readFileSync(lockedAccountsPath, 'utf8'));
      
      const accountIndex = lockedAccounts.findIndex(acc => acc.userId === userId);
      
      if (accountIndex !== -1) {
        lockedAccounts[accountIndex].failedAttempts = 0;
        lockedAccounts[accountIndex].isLocked = false;
        lockedAccounts[accountIndex].lockedAt = null;
        
        fs.writeFileSync(lockedAccountsPath, JSON.stringify(lockedAccounts, null, 2));
      }
      
      return true;
    } catch (error) {
      console.error('Erreur réinitialisation tentatives:', error);
      return false;
    }
  },

  // Vérifier si un compte est verrouillé
  isAccountLocked: (userId) => {
    try {
      const lockedAccounts = JSON.parse(fs.readFileSync(lockedAccountsPath, 'utf8'));
      
      const accountData = lockedAccounts.find(acc => acc.userId === userId);
      
      return accountData ? accountData.isLocked : false;
    } catch (error) {
      console.error('Erreur vérification verrouillage:', error);
      return false;
    }
  },

  // Déverrouiller un compte (admin seulement)
  unlockAccount: (userId) => {
    try {
      const lockedAccounts = JSON.parse(fs.readFileSync(lockedAccountsPath, 'utf8'));
      
      const accountIndex = lockedAccounts.findIndex(acc => acc.userId === userId);
      
      if (accountIndex !== -1) {
        lockedAccounts[accountIndex].isLocked = false;
        lockedAccounts[accountIndex].failedAttempts = 0;
        lockedAccounts[accountIndex].lockedAt = null;
        
        fs.writeFileSync(lockedAccountsPath, JSON.stringify(lockedAccounts, null, 2));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur déverrouillage compte:', error);
      return false;
    }
  },

  // Obtenir tous les comptes verrouillés (admin seulement)
  getLockedAccounts: () => {
    try {
      const lockedAccounts = JSON.parse(fs.readFileSync(lockedAccountsPath, 'utf8'));
      return lockedAccounts.filter(acc => acc.isLocked);
    } catch (error) {
      console.error('Erreur récupération comptes verrouillés:', error);
      return [];
    }
  },

  // Obtenir tous les codes de confirmation (admin seulement)
  getAllCodes: () => {
    try {
      const codes = JSON.parse(fs.readFileSync(confirmationPath, 'utf8'));
      // Décrypter les codes pour l'affichage admin
      return codes.map(code => ({
        ...code,
        code: EncryptionService.decrypt(code.code)
      }));
    } catch (error) {
      console.error('Erreur récupération codes:', error);
      return [];
    }
  }
};

module.exports = ConfirmationCode;