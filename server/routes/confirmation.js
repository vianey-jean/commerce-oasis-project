const express = require('express');
const router = express.Router();
const ConfirmationCode = require('../models/ConfirmationCode');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Middleware pour vérifier le rôle admin
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
  next();
};

// Générer un code de confirmation
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Vérifier si le compte est verrouillé
    if (ConfirmationCode.isAccountLocked(userId)) {
      return res.status(423).json({ 
        message: 'Compte verrouillé. Contactez un administrateur.',
        locked: true 
      });
    }
    
    const code = ConfirmationCode.generateCode(userId);
    
    if (code) {
      res.json({ 
        message: 'Code de confirmation généré',
        code: code, // En production, envoyer par email/SMS
        success: true 
      });
    } else {
      res.status(500).json({ message: 'Erreur lors de la génération du code' });
    }
  } catch (error) {
    console.error('Erreur génération code:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Vérifier un code de confirmation
router.post('/verify', authMiddleware, async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;
    
    // Vérifier si le compte est verrouillé
    if (ConfirmationCode.isAccountLocked(userId)) {
      return res.status(423).json({ 
        message: 'Compte verrouillé. Contactez un administrateur.',
        locked: true 
      });
    }
    
    const isValid = ConfirmationCode.verifyCode(userId, code);
    
    if (isValid) {
      res.json({ 
        message: 'Code vérifié avec succès',
        success: true 
      });
    } else {
      // Enregistrer la tentative échouée
      const isLocked = ConfirmationCode.recordFailedAttempt(userId);
      
      if (isLocked) {
        res.status(423).json({ 
          message: 'Trop de tentatives échouées. Compte verrouillé.',
          locked: true 
        });
      } else {
        res.status(400).json({ 
          message: 'Code invalide ou expiré',
          success: false 
        });
      }
    }
  } catch (error) {
    console.error('Erreur vérification code:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Routes administrateur

// Déverrouiller un compte
router.post('/unlock/:userId', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    
    const success = ConfirmationCode.unlockAccount(userId);
    
    if (success) {
      res.json({ 
        message: 'Compte déverrouillé avec succès',
        success: true 
      });
    } else {
      res.status(404).json({ message: 'Compte non trouvé' });
    }
  } catch (error) {
    console.error('Erreur déverrouillage:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les comptes verrouillés
router.get('/locked-accounts', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const lockedAccounts = ConfirmationCode.getLockedAccounts();
    
    // Enrichir avec les informations utilisateur
    const enrichedAccounts = lockedAccounts.map(account => {
      const user = User.getById(account.userId);
      return {
        ...account,
        userInfo: user ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        } : null
      };
    });
    
    res.json(enrichedAccounts);
  } catch (error) {
    console.error('Erreur récupération comptes verrouillés:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Obtenir tous les codes de confirmation
router.get('/all-codes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const codes = ConfirmationCode.getAllCodes();
    
    // Enrichir avec les informations utilisateur
    const enrichedCodes = codes.map(code => {
      const user = User.getById(code.userId);
      return {
        ...code,
        userInfo: user ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        } : null
      };
    });
    
    res.json(enrichedCodes);
  } catch (error) {
    console.error('Erreur récupération codes:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;