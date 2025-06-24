
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

module.exports = router;
