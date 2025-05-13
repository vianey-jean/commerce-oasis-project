
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

const notifCommandesFilePath = path.join(__dirname, '../data/notifcommandes.json');

// S'assurer que le fichier existe
if (!fs.existsSync(notifCommandesFilePath)) {
  const initialData = {
    users: {},
    adminNotifications: {
      messages: 0,
      commandes: 0,
      chat: 0,
      serviceClient: 0
    }
  };
  fs.writeFileSync(notifCommandesFilePath, JSON.stringify(initialData, null, 2));
}

// Obtenir les notifications pour un utilisateur spécifique
router.get('/user/:userId', isAuthenticated, (req, res) => {
  try {
    // Vérifier que l'utilisateur demande ses propres notifications ou est admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    
    // Si l'utilisateur n'a pas encore de notifications, initialiser
    if (!notifData.users[req.params.userId]) {
      notifData.users[req.params.userId] = { count: 0 };
      fs.writeFileSync(notifCommandesFilePath, JSON.stringify(notifData, null, 2));
    }
    
    res.json({ count: notifData.users[req.params.userId].count || 0 });
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications' });
  }
});

// Marquer les notifications d'un utilisateur comme lues
router.post('/user/:userId/read', isAuthenticated, (req, res) => {
  try {
    // Vérifier que l'utilisateur modifie ses propres notifications ou est admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès non autorisé' });
    }
    
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    
    if (!notifData.users[req.params.userId]) {
      notifData.users[req.params.userId] = { count: 0 };
    } else {
      notifData.users[req.params.userId].count = 0;
    }
    
    fs.writeFileSync(notifCommandesFilePath, JSON.stringify(notifData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications comme lues:', error);
    res.status(500).json({ message: 'Erreur lors du marquage des notifications comme lues' });
  }
});

// Ajouter une notification pour un utilisateur
router.post('/user/:userId/add', isAuthenticated, (req, res) => {
  try {
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    
    if (!notifData.users[req.params.userId]) {
      notifData.users[req.params.userId] = { count: 1 };
    } else {
      notifData.users[req.params.userId].count += 1;
    }
    
    fs.writeFileSync(notifCommandesFilePath, JSON.stringify(notifData, null, 2));
    res.json({ success: true, count: notifData.users[req.params.userId].count });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une notification:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout d\'une notification' });
  }
});

// Obtenir toutes les notifications admin
router.get('/admin', isAdmin, (req, res) => {
  try {
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    res.json(notifData.adminNotifications);
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications admin:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des notifications admin' });
  }
});

// Marquer les notifications admin comme lues pour une section spécifique
router.post('/admin/:section/read', isAdmin, (req, res) => {
  try {
    const { section } = req.params;
    
    if (!['messages', 'commandes', 'chat', 'serviceClient'].includes(section)) {
      return res.status(400).json({ message: 'Section invalide' });
    }
    
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    
    notifData.adminNotifications[section] = 0;
    
    fs.writeFileSync(notifCommandesFilePath, JSON.stringify(notifData, null, 2));
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du marquage des notifications admin comme lues:', error);
    res.status(500).json({ message: 'Erreur lors du marquage des notifications admin comme lues' });
  }
});

// Ajouter une notification admin pour une section spécifique
router.post('/admin/:section/add', (req, res) => {
  try {
    const { section } = req.params;
    const { count = 1 } = req.body;
    
    if (!['messages', 'commandes', 'chat', 'serviceClient'].includes(section)) {
      return res.status(400).json({ message: 'Section invalide' });
    }
    
    const notifData = JSON.parse(fs.readFileSync(notifCommandesFilePath));
    
    notifData.adminNotifications[section] += parseInt(count);
    
    fs.writeFileSync(notifCommandesFilePath, JSON.stringify(notifData, null, 2));
    res.json({ 
      success: true, 
      count: notifData.adminNotifications[section] 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'une notification admin:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout d\'une notification admin' });
  }
});

module.exports = router;
