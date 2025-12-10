
const express = require('express');
const fs = require('fs');
const path = require('path');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();

const paiementRemboursementPath = path.join(__dirname, '../data/paiement-remboursement.json');

function readJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Erreur lecture ${filePath}:`, error);
    return [];
  }
}

function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Erreur écriture ${filePath}:`, error);
    return false;
  }
}

// Check if user has accepted refunds (visible in navbar)
router.get('/check', isAuthenticated, async (req, res) => {
  try {
    const paiements = readJSON(paiementRemboursementPath);
    const userPaiements = paiements.filter(
      p => String(p.userId) === String(req.user.id) && 
           p.decision === 'accepté' && 
           !p.clientValidated
    );
    res.json({ hasAcceptedRefunds: userPaiements.length > 0 });
  } catch (error) {
    console.error('Erreur check paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get user's accepted refund payments
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const paiements = readJSON(paiementRemboursementPath);
    console.log('User ID from token:', req.user.id, 'Type:', typeof req.user.id);
    console.log('All paiements:', paiements.map(p => ({ id: p.id, userId: p.userId, decision: p.decision, clientValidated: p.clientValidated })));
    
    const userPaiements = paiements.filter(
      p => String(p.userId) === String(req.user.id) && 
           p.decision === 'accepté' && 
           !p.clientValidated
    );
    
    console.log('Filtered paiements for user:', userPaiements.length);
    res.json(userPaiements);
  } catch (error) {
    console.error('Erreur get user paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get all (admin only)
router.get('/', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès admin requis' });
    }
    const paiements = readJSON(paiementRemboursementPath);
    // Only return accepted refunds for admin
    const acceptedPaiements = paiements.filter(p => p.decision === 'accepté');
    res.json(acceptedPaiements);
  } catch (error) {
    console.error('Erreur get all paiements:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const paiements = readJSON(paiementRemboursementPath);
    const paiement = paiements.find(p => p.id === req.params.id);
    
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    if (req.user.role !== 'admin' && String(paiement.userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    res.json(paiement);
  } catch (error) {
    console.error('Erreur get paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update status (admin only)
router.put('/:id/status', isAuthenticated, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès admin requis' });
    }
    
    const { status } = req.body;
    const validStatuses = ['debut', 'en cours', 'payé'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }
    
    const paiements = readJSON(paiementRemboursementPath);
    const index = paiements.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    paiements[index].status = status;
    paiements[index].updatedAt = new Date().toISOString();
    
    writeJSON(paiementRemboursementPath, paiements);
    
    // Emit socket event for real-time sync
    const io = req.app.get('io');
    if (io) {
      io.emit('paiement-remboursement-updated', paiements[index]);
    }
    
    res.json(paiements[index]);
  } catch (error) {
    console.error('Erreur update status:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Client validates payment received
router.put('/:id/validate', isAuthenticated, async (req, res) => {
  try {
    const paiements = readJSON(paiementRemboursementPath);
    const index = paiements.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }
    
    if (String(paiements[index].userId) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    if (paiements[index].status !== 'payé') {
      return res.status(400).json({ message: 'Le paiement doit être marqué comme payé avant validation' });
    }
    
    paiements[index].clientValidated = true;
    paiements[index].updatedAt = new Date().toISOString();
    
    writeJSON(paiementRemboursementPath, paiements);
    
    res.json(paiements[index]);
  } catch (error) {
    console.error('Erreur validate paiement:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
