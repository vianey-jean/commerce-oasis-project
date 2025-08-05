
const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Service SMS fictif - À remplacer par un vrai service SMS comme Twilio
const sendSMS = async (phoneNumber, message) => {
  // Simuler l'envoi d'un SMS
  console.log(`📱 SMS envoyé à ${phoneNumber}:`);
  console.log(`📝 Message: ${message}`);
  console.log(`⏰ Heure: ${new Date().toLocaleString('fr-FR')}`);
  
  // Simuler une réponse réussie
  return {
    success: true,
    messageId: `msg_${Date.now()}`,
    timestamp: new Date().toISOString()
  };
};

// Route pour envoyer un SMS de rappel
router.post('/send-sms', isAuthenticated, async (req, res) => {
  try {
    const { phoneNumber, message, appointmentId } = req.body;
    
    if (!phoneNumber || !message) {
      return res.status(400).json({ 
        error: 'Numéro de téléphone et message requis' 
      });
    }

    // Envoyer le SMS
    const result = await sendSMS(phoneNumber, message);
    
    if (result.success) {
      console.log(`SMS de rappel envoyé pour le rendez-vous ${appointmentId}`);
      
      res.json({
        success: true,
        message: 'SMS envoyé avec succès',
        messageId: result.messageId,
        timestamp: result.timestamp
      });
    } else {
      res.status(500).json({
        error: 'Erreur lors de l\'envoi du SMS'
      });
    }
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi du SMS:', error);
    res.status(500).json({
      error: 'Erreur serveur lors de l\'envoi du SMS'
    });
  }
});

module.exports = router;
