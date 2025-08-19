const ConfirmationCode = require('../models/ConfirmationCode');

// Middleware pour vérifier si l'utilisateur a besoin d'un code de confirmation
const confirmationCheckMiddleware = (req, res, next) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Non autorisé' });
    }
    
    // Vérifier si le compte est verrouillé
    if (ConfirmationCode.isAccountLocked(userId)) {
      return res.status(423).json({ 
        message: 'Compte verrouillé. Contactez un administrateur.',
        requiresUnlock: true 
      });
    }
    
    // Routes qui nécessitent une confirmation
    const protectedRoutes = [
      '/api/products',
      '/api/sales',
      '/api/clients',
      '/api/messages',
      '/api/benefices',
      '/api/depenses',
      '/api/pretfamilles',
      '/api/pretproduits'
    ];
    
    const requiresConfirmation = protectedRoutes.some(route => 
      req.originalUrl.startsWith(route)
    );
    
    if (requiresConfirmation) {
      // Vérifier s'il y a un code de confirmation valide en session
      const hasValidConfirmation = req.session?.confirmationValidated;
      
      if (!hasValidConfirmation) {
        return res.status(403).json({ 
          message: 'Code de confirmation requis',
          requiresConfirmation: true 
        });
      }
    }
    
    next();
  } catch (error) {
    console.error('Erreur middleware confirmation:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = confirmationCheckMiddleware;