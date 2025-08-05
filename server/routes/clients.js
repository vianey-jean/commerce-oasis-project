
const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// GET /api/clients - Récupérer tous les clients
router.get('/', (req, res) => {
  try {
    const clients = Client.getAll();
    res.json(clients);
  } catch (error) {
    console.error('Erreur lors de la récupération des clients:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/clients - Ajouter un nouveau client
router.post('/', (req, res) => {
  try {
    const { nom, prenom, email, telephone, adresse, dateNaissance, notes, dateCreation, status, totalRendezVous } = req.body;
    
    if (!nom || !prenom) {
      return res.status(400).json({ error: 'Les champs nom et prénom sont obligatoires' });
    }
    
    const result = Client.save({
      nom,
      prenom,
      email: email || '',
      telephone: telephone || '',
      adresse: adresse || '',
      dateNaissance: dateNaissance || null,
      notes: notes || '',
      dateCreation: dateCreation || new Date().toISOString().split('T')[0],
      status: status || 'actif',
      totalRendezVous: totalRendezVous || 0
    });
    
    if (result.success) {
      res.json({ success: true, client: result.client });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT /api/clients/:id - Modifier un client
router.put('/:id', (req, res) => {
  try {
    const clientId = req.params.id;
    const updateData = req.body;
    
    const result = Client.update(clientId, updateData);
    
    if (result.success) {
      res.json({ success: true, client: result.client });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erreur lors de la modification du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/clients/:id - Supprimer un client
router.delete('/:id', (req, res) => {
  try {
    const clientId = req.params.id;
    
    const result = Client.delete(clientId);
    
    if (result.success) {
      res.json({ success: true });
    } else {
      res.status(400).json({ error: result.message });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/clients/:id - Récupérer un client par ID
router.get('/:id', (req, res) => {
  try {
    const clientId = req.params.id;
    const client = Client.getById(clientId);
    
    if (client) {
      res.json(client);
    } else {
      res.status(404).json({ error: 'Client non trouvé' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du client:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
