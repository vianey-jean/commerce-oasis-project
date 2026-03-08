/**
 * Routes API pour les notifications
 */
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// GET all notifications
router.get('/', authMiddleware, (req, res) => {
  try {
    const { type, unread } = req.query;
    if (unread === 'true') return res.json(Notification.getUnread());
    if (type) return res.json(Notification.getByType(type));
    res.json(Notification.getAll());
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create notification
router.post('/', authMiddleware, (req, res) => {
  try {
    const newItem = Notification.create(req.body);
    if (!newItem) return res.status(500).json({ message: 'Error creating' });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT mark as read
router.put('/:id/read', authMiddleware, (req, res) => {
  try {
    const updated = Notification.markAsRead(req.params.id);
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT mark all as read
router.put('/read-all', authMiddleware, (req, res) => {
  try {
    Notification.markAllAsRead();
    res.json({ message: 'All marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE one
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const success = Notification.delete(req.params.id);
    if (!success) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE all
router.delete('/', authMiddleware, (req, res) => {
  try {
    Notification.deleteAll();
    res.json({ message: 'All deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
