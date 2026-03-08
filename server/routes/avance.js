const express = require('express');
const router = express.Router();
const Avance = require('../models/Avance');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, (req, res) => {
  try {
    const { year, month, travailleurId } = req.query;
    if (travailleurId && year && month) {
      return res.json(Avance.getByTravailleur(travailleurId, year, month));
    }
    if (year && month) {
      return res.json(Avance.getByMonth(year, month));
    }
    res.json(Avance.getAll());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { travailleurId, entrepriseId, montant } = req.body;
    if (!travailleurId || !entrepriseId || !montant) {
      return res.status(400).json({ message: 'Champs requis: travailleurId, entrepriseId, montant' });
    }
    const avance = Avance.create(req.body);
    res.status(201).json(avance);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const success = Avance.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
