
const express = require('express');
const router = express.Router();
const savedCardsService = require('../services/savedCards.service');
const { isAuthenticated } = require('../middlewares/auth');

// Middleware d'authentification
router.use(isAuthenticated);

// Traiter un paiement avec une carte sauvegardée
router.post('/process-saved-card', async (req, res) => {
  try {
    const { cardId, amount, currency } = req.body;
    
    if (!cardId || !amount) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    const result = savedCardsService.processPaymentWithSavedCard(
      req.user.id,
      cardId,
      { amount, currency }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Erreur de paiement:', error);
    res.status(400).json({ error: error.message });
  }
});

// Traiter un paiement avec une nouvelle carte
router.post('/process-new-card', async (req, res) => {
  try {
    const { cardData, amount, currency } = req.body;
    
    if (!cardData || !amount) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    const result = savedCardsService.processPaymentWithNewCard(
      req.user.id,
      cardData,
      { amount, currency }
    );
    
    res.json(result);
  } catch (error) {
    console.error('Erreur de paiement:', error);
    res.status(400).json({ error: error.message });
  }
});

// Confirmer un paiement 3DS
router.post('/confirm-3ds', async (req, res) => {
  try {
    const { paymentIntentId, confirmationData } = req.body;
    
    if (!paymentIntentId || !confirmationData) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    const result = savedCardsService.validate3DS(paymentIntentId, confirmationData);
    res.json(result);
  } catch (error) {
    console.error('Erreur 3DS:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
