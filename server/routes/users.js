
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const nodemailer = require('nodemailer');

// Configuration du transporteur SMTP
const transporter = nodemailer.createTransporter({
  service: 'gmail', // ou votre service SMTP
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com', // Remplacez par votre email
    pass: process.env.SMTP_PASS || 'your-app-password' // Remplacez par votre mot de passe d'application
  }
});

// Stockage temporaire des codes (en production, utiliser Redis ou une base de données)
const resetCodes = new Map();

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
  const { email, newPassword, code } = req.body;
  
  if (!email || !newPassword || !code) {
    return res.status(400).json({ error: 'Email, nouveau mot de passe et code requis' });
  }
  
  // Vérifier le code
  const storedData = resetCodes.get(email);
  if (!storedData || storedData.code !== code || Date.now() > storedData.expiresAt) {
    return res.status(400).json({ error: 'Code invalide ou expiré' });
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
    // Supprimer le code après utilisation
    resetCodes.delete(email);
    return res.json({ message: 'Mot de passe mis à jour avec succès' });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour envoyer un code de réinitialisation
router.post('/send-reset-code', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email requis' });
  }
  
  const user = User.getByEmail(email);
  if (!user) {
    return res.status(404).json({ error: 'Email non trouvé' });
  }
  
  // Générer un code aléatoire de 6 chiffres
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const timestamp = Date.now();
  const expiresAt = timestamp + (24 * 60 * 60 * 1000); // 24h
  
  // Stocker le code avec expiration
  resetCodes.set(email, {
    code,
    email,
    timestamp,
    expiresAt
  });
  
  try {
    // Envoyer l'email avec le code
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'your-email@gmail.com',
      to: email,
      subject: 'Code de réinitialisation de mot de passe - Riziky Agendas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Réinitialisation de mot de passe</h2>
          <p>Bonjour,</p>
          <p>Vous avez demandé la réinitialisation de votre mot de passe pour Riziky Agendas.</p>
          <p>Votre code de vérification est :</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</span>
          </div>
          <p>Ce code est valide pendant 24 heures.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
          <p>Cordialement,<br>L'équipe Riziky Agendas</p>
        </div>
      `
    });
    
    return res.json({ success: true, message: 'Code envoyé par email' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({ error: 'Erreur lors de l\'envoi de l\'email' });
  }
});

// Route pour vérifier un code de réinitialisation
router.post('/verify-reset-code', (req, res) => {
  const { email, code } = req.body;
  
  if (!email || !code) {
    return res.status(400).json({ error: 'Email et code requis' });
  }
  
  const storedData = resetCodes.get(email);
  
  if (!storedData) {
    return res.status(400).json({ error: 'Code non trouvé ou expiré' });
  }
  
  // Vérifier si le code n'a pas expiré
  if (Date.now() > storedData.expiresAt) {
    resetCodes.delete(email);
    return res.status(400).json({ error: 'Code expiré' });
  }
  
  // Vérifier si le code correspond
  if (storedData.code !== code) {
    return res.status(400).json({ error: 'Code incorrect' });
  }
  
  return res.json({ success: true, message: 'Code vérifié avec succès' });
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
