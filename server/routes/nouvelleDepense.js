const express = require('express');
const router = express.Router();
const NouvelleDepense = require('../models/NouvelleDepense');
const authMiddleware = require('../middleware/auth');

// Récupérer toutes les dépenses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const depenses = NouvelleDepense.getAll();
    res.json(depenses);
  } catch (error) {
    console.error('Error getting depenses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les dépenses par mois et année
router.get('/monthly/:year/:month', authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.params;
    const depenses = NouvelleDepense.getByMonthYear(parseInt(month), parseInt(year));
    res.json(depenses);
  } catch (error) {
    console.error('Error getting monthly depenses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les dépenses par année
router.get('/yearly/:year', authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    const depenses = NouvelleDepense.getByYear(parseInt(year));
    res.json(depenses);
  } catch (error) {
    console.error('Error getting yearly depenses:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les statistiques mensuelles
router.get('/stats/monthly/:year/:month', authMiddleware, async (req, res) => {
  try {
    const { year, month } = req.params;
    const stats = NouvelleDepense.getMonthlyStats(parseInt(month), parseInt(year));
    res.json(stats);
  } catch (error) {
    console.error('Error getting monthly depense stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer les statistiques annuelles
router.get('/stats/yearly/:year', authMiddleware, async (req, res) => {
  try {
    const { year } = req.params;
    const stats = NouvelleDepense.getYearlyStats(parseInt(year));
    res.json(stats);
  } catch (error) {
    console.error('Error getting yearly depense stats:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer une dépense par ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const depense = NouvelleDepense.getById(req.params.id);
    
    if (!depense) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }
    
    res.json(depense);
  } catch (error) {
    console.error('Error getting depense by ID:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Créer une nouvelle dépense
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { description, montant, type, categorie } = req.body;
    
    if (!description || montant === undefined) {
      return res.status(400).json({ message: 'Description et montant sont requis' });
    }
    
    const depenseData = {
      description,
      montant: Number(montant),
      type: type || 'autre_depense',
      categorie: categorie || 'divers',
      date: req.body.date || new Date().toISOString()
    };
    
    const newDepense = NouvelleDepense.create(depenseData);
    
    if (!newDepense) {
      return res.status(500).json({ message: 'Erreur lors de la création de la dépense' });
    }
    
    console.log('✅ Depense created successfully:', newDepense);
    res.status(201).json(newDepense);
  } catch (error) {
    console.error('❌ Error creating depense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mettre à jour une dépense
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updatedDepense = NouvelleDepense.update(req.params.id, req.body);
    
    if (!updatedDepense) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }
    
    console.log('✅ Depense updated successfully:', updatedDepense);
    res.json(updatedDepense);
  } catch (error) {
    console.error('❌ Error updating depense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Supprimer une dépense
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const success = NouvelleDepense.delete(req.params.id);
    
    if (!success) {
      return res.status(404).json({ message: 'Dépense non trouvée' });
    }
    
    console.log('✅ Depense deleted successfully:', req.params.id);
    res.json({ message: 'Dépense supprimée avec succès' });
  } catch (error) {
    console.error('❌ Error deleting depense:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
