const express = require('express');
const router = express.Router();
const AdminChat = require('../models/AdminChat');
const authMiddleware = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

// Get all users (for admin list)
router.get('/users', authMiddleware, (req, res) => {
  try {
    const usersPath = path.join(__dirname, '../db/users.json');
    const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    // Return users without passwords
    const safeUsers = users
      .filter(u => u.id !== req.user.id)
      .map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get conversations list for current user
router.get('/conversations', authMiddleware, (req, res) => {
  try {
    const conversations = AdminChat.getConversationsForUser(req.user.id);
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get conversation with specific user
router.get('/conversation/:userId', authMiddleware, (req, res) => {
  try {
    const messages = AdminChat.getConversation(req.user.id, req.params.userId);
    // Mark messages from that user as read
    AdminChat.markConversationAsRead(req.params.userId, req.user.id);
    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Send a message
router.post('/send', authMiddleware, (req, res) => {
  try {
    const { receiverId, receiverName, contenu } = req.body;

    if (!receiverId || !contenu) {
      return res.status(400).json({ message: 'receiverId et contenu sont requis' });
    }

    const newMessage = AdminChat.create({
      senderId: req.user.id,
      senderName: `${req.user.firstName} ${req.user.lastName}`,
      senderPhoto: req.user.profilePhoto || '',
      receiverId,
      receiverName: receiverName || '',
      contenu
    });

    // Clear typing status after sending
    AdminChat.setTyping(req.user.id, '', receiverId, false);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Set typing status
router.post('/typing', authMiddleware, (req, res) => {
  try {
    const { receiverId, isTyping } = req.body;
    const userName = `${req.user.firstName} ${req.user.lastName}`;
    AdminChat.setTyping(req.user.id, userName, receiverId, isTyping);
    res.json({ success: true });
  } catch (error) {
    console.error('Error setting typing status:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get typing status (who is typing to me)
router.get('/typing', authMiddleware, (req, res) => {
  try {
    const typingUsers = AdminChat.getTypingStatus(req.user.id);
    res.json(typingUsers);
  } catch (error) {
    console.error('Error getting typing status:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Get unread count
router.get('/unread-count', authMiddleware, (req, res) => {
  try {
    const count = AdminChat.getUnreadCountForUser(req.user.id);
    res.json({ count });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, (req, res) => {
  try {
    const updated = AdminChat.markAsRead(req.params.id, req.user.id);
    if (updated) {
      res.json(updated);
    } else {
      res.status(404).json({ message: 'Message non trouvé' });
    }
  } catch (error) {
    console.error('Error marking as read:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Delete message
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const deleted = AdminChat.delete(req.params.id, req.user.id);
    if (deleted) {
      res.json({ message: 'Message supprimé' });
    } else {
      res.status(404).json({ message: 'Message non trouvé' });
    }
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
