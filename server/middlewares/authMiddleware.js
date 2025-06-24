
const User = require('../models/User');

// Middleware pour vérifier si l'utilisateur est authentifié
const isAuthenticated = (req, res, next) => {
  // Dans une application réelle, nous vérifierions un token JWT
  // Mais pour cette démonstration, nous vérifions simplement si l'ID utilisateur est fourni
  const userId = req.headers['user-id'];
  
  if (!userId) {
    return res.status(401).json({ error: 'Utilisateur non authentifié' });
  }
  
  const user = User.getById(userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Utilisateur non trouvé' });
  }
  
  // Stocker l'utilisateur dans la requête pour une utilisation ultérieure
  req.user = user;
  next();
};

module.exports = {
  isAuthenticated
};
