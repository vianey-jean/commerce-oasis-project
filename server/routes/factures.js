/**
 * Routes API pour les factures et devis
 */
const express = require('express');
const router = express.Router();
const Facture = require('../models/Facture');
const authMiddleware = require('../middleware/auth');

// GET all factures
router.get('/', authMiddleware, (req, res) => {
  try {
    const { type, year, month } = req.query;
    if (type) return res.json(Facture.getByType(type));
    if (year && month) return res.json(Facture.getByMonth(year, month));
    res.json(Facture.getAll());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET next number
router.get('/next-number/:type', authMiddleware, (req, res) => {
  try {
    res.json({ numero: Facture.getNextNumber(req.params.type) });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET by id
router.get('/:id', authMiddleware, (req, res) => {
  try {
    const item = Facture.getById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create
router.post('/', authMiddleware, (req, res) => {
  try {
    const newItem = Facture.create(req.body);
    if (!newItem) return res.status(500).json({ message: 'Error creating' });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update
router.put('/:id', authMiddleware, (req, res) => {
  try {
    const updated = Facture.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const success = Facture.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
