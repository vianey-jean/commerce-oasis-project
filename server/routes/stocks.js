/**
 * Routes API pour la gestion des stocks
 */
const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');
const authMiddleware = require('../middleware/auth');

// GET all stock movements
router.get('/', authMiddleware, (req, res) => {
  try {
    const { productId } = req.query;
    if (productId) return res.json(Stock.getByProduct(productId));
    res.json(Stock.getAll());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET low stock alerts
router.get('/alerts/low', authMiddleware, (req, res) => {
  try {
    const threshold = parseInt(req.query.threshold) || 5;
    res.json(Stock.getLowStock(threshold));
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create stock movement
router.post('/', authMiddleware, (req, res) => {
  try {
    const { productId, type, quantity, raison } = req.body;
    if (!productId || !type || !quantity) {
      return res.status(400).json({ message: 'productId, type, quantity requis' });
    }
    const newItem = Stock.create({ productId, type, quantity: Number(quantity), raison: raison || '' });
    if (!newItem) return res.status(500).json({ message: 'Error creating' });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const success = Stock.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
