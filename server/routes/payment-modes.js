const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();

const dataPath = path.join(__dirname, '../data/modepaiement.json');

// Récupérer les modes de paiement
router.get('/', async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    const paymentModes = JSON.parse(data);
    res.json({ success: true, data: paymentModes });
  } catch (error) {
    console.error('Erreur lors de la lecture des modes de paiement:', error);
    // Retourner les valeurs par défaut si le fichier n'existe pas
    const defaultModes = {
      enableCreditCard: true,
      enablePaypal: true,
      enableBankTransfer: true,
      enableCash: true,
      enableApplePay: true,
      stripeEnabled: false,
      stripePublicKey: "",
      paypalEnabled: false,
      paypalClientId: ""
    };
    res.json({ success: true, data: defaultModes });
  }
});

// Mettre à jour les modes de paiement
router.put('/', async (req, res) => {
  try {
    const paymentModes = req.body;
    await fs.writeFile(dataPath, JSON.stringify(paymentModes, null, 2));
    res.json({ success: true, message: 'Modes de paiement mis à jour avec succès' });
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des modes de paiement:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la sauvegarde' });
  }
});

module.exports = router;