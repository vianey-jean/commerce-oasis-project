const fs = require('fs');
const path = require('path');

const nouvelleDepensePath = path.join(__dirname, '../db/nouvelle_depense.json');

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(nouvelleDepensePath)) {
  fs.writeFileSync(nouvelleDepensePath, JSON.stringify([], null, 2));
}

const NouvelleDepense = {
  // Récupérer toutes les dépenses
  getAll: () => {
    try {
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      const depenses = JSON.parse(data);
      console.log(`📦 Retrieved ${depenses.length} depenses from database`);
      return depenses;
    } catch (error) {
      console.error("❌ Error reading depenses:", error);
      return [];
    }
  },

  // Récupérer une dépense par ID
  getById: (id) => {
    try {
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      const depenses = JSON.parse(data);
      return depenses.find(depense => depense.id === id) || null;
    } catch (error) {
      console.error("❌ Error finding depense by id:", error);
      return null;
    }
  },

  // Récupérer les dépenses par mois et année
  getByMonthYear: (month, year) => {
    try {
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      const depenses = JSON.parse(data);
      
      return depenses.filter(depense => {
        const date = new Date(depense.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering depenses by month/year:", error);
      return [];
    }
  },

  // Récupérer les dépenses par année
  getByYear: (year) => {
    try {
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      const depenses = JSON.parse(data);
      
      return depenses.filter(depense => {
        const date = new Date(depense.date);
        return date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering depenses by year:", error);
      return [];
    }
  },

  // Créer une nouvelle dépense
  create: (depenseData) => {
    try {
      console.log('📝 Creating new depense:', depenseData);
      
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      const depenses = JSON.parse(data);
      
      const newDepense = {
        id: Date.now().toString(),
        date: depenseData.date || new Date().toISOString(),
        description: depenseData.description,
        montant: Number(depenseData.montant),
        type: depenseData.type || 'autre_depense',
        categorie: depenseData.categorie || 'divers'
      };
      
      depenses.push(newDepense);
      fs.writeFileSync(nouvelleDepensePath, JSON.stringify(depenses, null, 2));
      
      console.log('✅ Depense created successfully:', newDepense);
      return newDepense;
    } catch (error) {
      console.error("❌ Error creating depense:", error);
      return null;
    }
  },

  // Mettre à jour une dépense
  update: (id, depenseData) => {
    try {
      console.log(`📝 Updating depense ${id}:`, depenseData);
      
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      let depenses = JSON.parse(data);
      
      const depenseIndex = depenses.findIndex(depense => depense.id === id);
      if (depenseIndex === -1) {
        console.log(`❌ Depense not found for update: ${id}`);
        return null;
      }
      
      depenses[depenseIndex] = { ...depenses[depenseIndex], ...depenseData };
      fs.writeFileSync(nouvelleDepensePath, JSON.stringify(depenses, null, 2));
      
      console.log('✅ Depense updated successfully:', depenses[depenseIndex]);
      return depenses[depenseIndex];
    } catch (error) {
      console.error("❌ Error updating depense:", error);
      return null;
    }
  },

  // Supprimer une dépense
  delete: (id) => {
    try {
      console.log(`🗑️ Deleting depense ${id}`);
      
      const data = fs.readFileSync(nouvelleDepensePath, 'utf8');
      let depenses = JSON.parse(data);
      
      const depenseIndex = depenses.findIndex(depense => depense.id === id);
      if (depenseIndex === -1) {
        console.log(`❌ Depense not found for deletion: ${id}`);
        return false;
      }
      
      depenses.splice(depenseIndex, 1);
      fs.writeFileSync(nouvelleDepensePath, JSON.stringify(depenses, null, 2));
      
      console.log('✅ Depense deleted successfully');
      return true;
    } catch (error) {
      console.error("❌ Error deleting depense:", error);
      return false;
    }
  },

  // Calculer les statistiques mensuelles
  getMonthlyStats: (month, year) => {
    try {
      const depenses = NouvelleDepense.getByMonthYear(month, year);
      
      const stats = {
        total: 0,
        count: 0,
        byType: {},
        byCategorie: {}
      };
      
      depenses.forEach(item => {
        stats.total += item.montant;
        stats.count++;
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.montant;
        stats.byType[item.type].count++;
        
        // Regrouper par catégorie
        if (!stats.byCategorie[item.categorie]) {
          stats.byCategorie[item.categorie] = { total: 0, count: 0 };
        }
        stats.byCategorie[item.categorie].total += item.montant;
        stats.byCategorie[item.categorie].count++;
      });
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating monthly depense stats:", error);
      return null;
    }
  },

  // Calculer les statistiques annuelles
  getYearlyStats: (year) => {
    try {
      const depenses = NouvelleDepense.getByYear(year);
      
      const stats = {
        total: 0,
        count: 0,
        byMonth: {},
        byType: {},
        byCategorie: {}
      };
      
      depenses.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        
        stats.total += item.montant;
        stats.count++;
        
        // Statistiques par mois
        if (!stats.byMonth[month]) {
          stats.byMonth[month] = { total: 0, count: 0 };
        }
        stats.byMonth[month].total += item.montant;
        stats.byMonth[month].count++;
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.montant;
        stats.byType[item.type].count++;
        
        // Regrouper par catégorie
        if (!stats.byCategorie[item.categorie]) {
          stats.byCategorie[item.categorie] = { total: 0, count: 0 };
        }
        stats.byCategorie[item.categorie].total += item.montant;
        stats.byCategorie[item.categorie].count++;
      });
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating yearly depense stats:", error);
      return null;
    }
  }
};

module.exports = NouvelleDepense;
