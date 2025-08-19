const User = require('../models/User');

// Créer un utilisateur administrateur par défaut
const createAdmin = () => {
  try {
    // Vérifier si un admin existe déjà
    const users = User.getAll();
    const adminExists = users.some(user => user.role === 'admin');
    
    if (adminExists) {
      console.log('✅ Un administrateur existe déjà');
      return;
    }
    
    // Créer l'administrateur par défaut
    const adminData = {
      email: 'admin@gestionvente.com',
      password: 'Admin123!',
      firstName: 'Administrateur',
      lastName: 'Système',
      gender: 'male',
      address: 'Système',
      phone: '000-000-0000',
      role: 'admin'
    };
    
    const admin = User.create(adminData);
    
    if (admin) {
      console.log('✅ Administrateur créé avec succès:');
      console.log('📧 Email: admin@gestionvente.com');
      console.log('🔑 Mot de passe: Admin123!');
      console.log('⚠️  Changez ce mot de passe après votre première connexion');
    } else {
      console.log('❌ Erreur lors de la création de l\'administrateur');
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  createAdmin();
}

module.exports = createAdmin;