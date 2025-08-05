
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Route pour l'inscription d'un utilisateur
router.post('/register', (req, res) => {
  const { nom, prenom, email, password, genre, adresse, phone } = req.body;
  
  // Vérifier si toutes les données requises sont présentes
  if (!nom || !prenom || !email || !password || !genre || !adresse || !phone) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  const result = User.save({ nom, prenom, email, password, genre, adresse, phone });
  
  if (result.success) {
    return res.status(201).json({ message: 'Utilisateur créé avec succès', user: result.user });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour la connexion d'un utilisateur
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  
  const user = User.getByEmail(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Email ou mot de passe erroné' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Email ou mot de passe erroné' });
  }
  
  // Dans une application réelle, nous générerions un token JWT ici
  return res.json({ message: 'Connexion réussie', user: { ...user, password: undefined } });
});

// Route pour la réinitialisation du mot de passe
router.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  
  if (!email || !newPassword) {
    return res.status(400).json({ error: 'Email et nouveau mot de passe requis' });
  }
  
  // Récupérer l'utilisateur pour vérifier l'ancien mot de passe
  const user = User.getByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  }
  
  // Vérifier si le nouveau mot de passe est identique à l'ancien
  if (user.password === newPassword) {
    return res.status(400).json({ 
      error: 'Erreur : le nouveau mot de passe est identique à l\'ancien. Veuillez en choisir un autre.' 
    });
  }
  
  const result = User.updatePassword(email, newPassword);
  
  if (result.success) {
    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour vérifier si un email existe
router.get('/check-email/:email', (req, res) => {
  const { email } = req.params;
  const user = User.getByEmail(email);
  
  return res.json({ exists: !!user });
});

// Route pour obtenir les informations de l'utilisateur connecté
router.get('/profile', isAuthenticated, (req, res) => {
  // Le middleware isAuthenticated a déjà vérifié l'utilisateur
  // et l'a stocké dans req.user
  return res.json({ user: { ...req.user, password: undefined } });
});

// Route pour vérifier le mot de passe actuel
router.post('/verify-password', isAuthenticated, (req, res) => {
  const { currentPassword } = req.body;
  const user = req.user;
  
  if (!currentPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel requis' });
  }
  
  const isValid = user.password === currentPassword;
  return res.json({ valid: isValid });
});

// Route pour mettre à jour le profil utilisateur
router.put('/profile', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const { nom, prenom, email, genre, adresse, phone } = req.body;
  
  const updateData = {};
  if (nom) updateData.nom = nom;
  if (prenom) updateData.prenom = prenom;
  if (email) updateData.email = email;
  if (genre) updateData.genre = genre;
  if (adresse) updateData.adresse = adresse;
  if (phone) updateData.phone = phone;
  
  const result = User.update(userId, updateData);
  
  if (result.success) {
    return res.json({ message: 'Profil mis à jour avec succès', user: { ...result.user, password: undefined } });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour changer le mot de passe
router.put('/change-password', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Mot de passe actuel et nouveau mot de passe requis' });
  }
  
  // Vérifier que le mot de passe actuel est correct
  const user = User.getById(userId);
  if (!user || user.password !== currentPassword) {
    return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
  }
  
  // Vérifier la force du nouveau mot de passe
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const hasMinLength = newPassword.length >= 8;
  
  if (!hasLowerCase || !hasUpperCase || !hasNumber || !hasSpecialChar || !hasMinLength) {
    return res.status(400).json({ 
      error: 'Le nouveau mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial' 
    });
  }
  
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit être différent de l\'ancien' });
  }
  
  const result = User.updatePassword(user.email, newPassword);
  
  if (result.success) {
    return res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour supprimer le compte utilisateur
router.delete('/profile', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  
  const result = User.delete(userId);
  
  if (result.success) {
    return res.json({ success: true, message: 'Compte supprimé avec succès' });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Routes pour les paramètres de notification
router.get('/notification-settings', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  
  // Récupérer les paramètres de notification depuis la base de données
  // Pour l'instant, on retourne des valeurs par défaut
  const defaultSettings = {
    emailNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    marketingEmails: false
  };
  
  return res.json({ settings: defaultSettings });
});

router.put('/notification-settings', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const { emailNotifications, smsNotifications, appointmentReminders, marketingEmails } = req.body;
  
  // Ici, vous pouvez sauvegarder les paramètres dans la base de données
  // Pour l'instant, on simule une sauvegarde réussie
  
  return res.json({ success: true, message: 'Paramètres de notification mis à jour' });
});

// Routes pour les paramètres de confidentialité
router.get('/privacy-settings', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  
  // Récupérer les paramètres de confidentialité depuis la base de données
  // Pour l'instant, on retourne des valeurs par défaut
  const defaultSettings = {
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    dataSharing: false
  };
  
  return res.json({ settings: defaultSettings });
});

router.put('/privacy-settings', isAuthenticated, (req, res) => {
  const userId = req.user.id;
  const { profileVisibility, showEmail, showPhone, dataSharing } = req.body;
  
  // Ici, vous pouvez sauvegarder les paramètres dans la base de données
  // Pour l'instant, on simule une sauvegarde réussie
  
  return res.json({ success: true, message: 'Paramètres de confidentialité mis à jour' });
});

module.exports = router;
