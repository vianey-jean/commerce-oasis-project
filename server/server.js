
/**
 * 🚀 server.js
 *
 * ✅ Version combinée et améliorée :
 * - Intègre sécurité, CORS, routes API, sockets, gestion d'erreurs.
 * - Création automatique des dossiers uploads/profile-images.
 * - Ajout d'une route pour upload d'images avec Multer.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const multer = require('multer');

// Configurations
const corsOptions = require('./config/cors');
const { securityMiddlewares, additionalCorsHeaders, sanitizeMiddleware } = require('./config/security');
const { initializeDataFiles } = require('./config/dataFiles');
const { notFoundHandler, globalErrorHandler } = require('./config/errorHandlers');
const initializeSocket = require('./socket/socketConfig');

// Initialiser l'application Express
const app = express();
const server = createServer(app);

// 📂 Préparer les dossiers d'uploads
const uploadsDir = path.join(__dirname, 'uploads');
const profileImagesDir = path.join(uploadsDir, 'profile-images');
const chatFilesDir = path.join(uploadsDir, 'chat-files');
const chatAudioDir = path.join(uploadsDir, 'chat-audio');
const chatVideoDir = path.join(uploadsDir, 'chat-video');

[uploadsDir, profileImagesDir, chatFilesDir, chatAudioDir, chatVideoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// ⚙️ Multer configuration (pour upload photos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, profileImagesDir); // Sauvegarde dans /uploads/profile-images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// 🔐 Sécurité
securityMiddlewares.forEach(middleware => app.use(middleware));

// 🌍 CORS
app.use(cors(corsOptions));
app.use(additionalCorsHeaders);

// 📦 Body parsers
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 📂 Initialisation des fichiers de données
app.use(initializeDataFiles);

// 📁 Servir les fichiers statiques
app.use('/uploads', (req, res, next) => {
  res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  express.static(uploadsDir)(req, res, next);
});

// 🛡️ Protection contre injections
app.use(sanitizeMiddleware);

// 📌 Routes API principales
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/panier', require('./routes/panier'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/flash-sales', require('./routes/flash-sales'));
app.use('/api/code-promos', require('./routes/code-promos'));
app.use('/api/remboursements', require('./routes/remboursements'));
app.use('/api/paiement-remboursement', require('./routes/paiement-remboursement'));
app.use('/api/sales-notifications', require('./routes/sales-notifications'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/pub-layout', require('./routes/pub-layout'));
app.use('/api/site-settings', require('./routes/site-settings'));
app.use('/api/payment-modes', require('./routes/payment-modes'));
app.use('/api/data-sync', require('./routes/data-sync'));
app.use('/api/admin-chat', require('./routes/admin-chat'));
app.use('/api/client-chat', require('./routes/client-chat'));
app.use('/api/cards', require('./routes/cards'));
app.use('/api/profile-images', require('./routes/profile-images'));
app.use('/api/chat-files', require('./routes/chat-files'));
app.use('/api/payments', require('./routes/payments'));

// ✅ Route test
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// ✅ Route upload photo (ex: /api/upload/profile)
app.post('/api/upload/profile', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucune image envoyée' });
  }
  res.json({
    message: 'Image uploadée avec succès',
    filename: req.file.filename,
    path: `/uploads/profile-images/${req.file.filename}`
  });
});

// ⚡ Initialiser Socket.io
const io = initializeSocket(server);

// Rendre io disponible pour les routes
app.set('io', io);

// ❌ Gestion des erreurs
app.use(notFoundHandler);
app.use(globalErrorHandler);

// 🚀 Lancement serveur
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📂 Uploads directory: ${uploadsDir}`);
  console.log(`📁 Chat files directory: ${chatFilesDir}`);
  console.log(`🎵 Chat audio directory: ${chatAudioDir}`);
  console.log(`🎬 Chat video directory: ${chatVideoDir}`);
});
