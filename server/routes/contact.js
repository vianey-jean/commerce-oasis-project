
const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// Route pour envoyer un message de contact
router.post('/', async (req, res) => {
  const { nom, email, sujet, message } = req.body;
  
  // Vérifier si toutes les données requises sont présentes
  if (!nom || !email || !sujet || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  // Valider le format de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Format d\'email invalide' });
  }
  
  const result = await Contact.send({ nom, email, sujet, message });
  
  if (result.success) {
    return res.status(200).json({ 
      message: 'Votre message a été envoyé avec succès',
      messageId: result.messageId
    });
  } else {
    return res.status(500).json({ error: result.message });
  }
});

module.exports = router;
