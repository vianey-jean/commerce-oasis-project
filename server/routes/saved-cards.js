
const express = require('express');
const router = express.Router();
const savedCardsService = require('../services/savedCards.service');
const authMiddleware = require('../middlewares/auth');

// Middleware d'authentification pour toutes les routes
router.use(authMiddleware);

// Récupérer les cartes de l'utilisateur
router.get('/', async (req, res) => {
  try {
    const cards = savedCardsService.getUserCards(req.user.id);
    res.json(cards);
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Sauvegarder une nouvelle carte
router.post('/', async (req, res) => {
  try {
    const { cardNumber, cardName, expiryDate, cvv, saveCard, setAsDefault } = req.body;
    
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      return res.status(400).json({ error: 'Données manquantes' });
    }
    
    const savedCard = savedCardsService.saveCard(req.user.id, {
      cardNumber,
      cardName,
      expiryDate,
      cvv,
      saveCard,
      setAsDefault
    });
    
    res.json(savedCard);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une carte
router.delete('/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params;
    const success = savedCardsService.deleteCard(req.user.id, cardId);
    
    if (!success) {
      return res.status(404).json({ error: 'Carte non trouvée' });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Définir une carte par défaut
router.put('/:cardId/default', async (req, res) => {
  try {
    const { cardId } = req.params;
    savedCardsService.setDefaultCard(req.user.id, cardId);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
