
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { broadcastMessagesUpdate } = require('../websocket');

const messagesFilePath = path.join(__dirname, '../data/messages.json');

// Fonction utilitaire pour lire les messages
const readMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Fonction utilitaire pour écrire les messages
const writeMessages = async (messages) => {
  await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
  // Diffuser les changements via WebSocket
  broadcastMessagesUpdate();
};

// GET - Récupérer tous les messages
router.get('/', async (req, res) => {
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Marquer un message comme lu
router.put('/:id/mark-read', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].lu = true;
    await writeMessages(messages);

    res.json(messages[messageIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PUT - Marquer un message comme non lu
router.put('/:id/mark-unread', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    messages[messageIndex].lu = false;
    await writeMessages(messages);

    res.json(messages[messageIndex]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE - Supprimer un message
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readMessages();
    
    const messageIndex = messages.findIndex(msg => msg.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message non trouvé' });
    }

    const deletedMessage = messages[messageIndex];
    messages.splice(messageIndex, 1);
    await writeMessages(messages);

    res.json({ success: true, deletedMessage });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
