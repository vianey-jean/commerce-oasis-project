const fs = require('fs');
const path = require('path');
const Product = require('./Product');

const nouvelleAchatPath = path.join(__dirname, '../db/nouvelle_achat.json');

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(nouvelleAchatPath)) {
  fs.writeFileSync(nouvelleAchatPath, JSON.stringify([], null, 2));
}

const NouvelleAchat = {
  // Récupérer tous les achats
  getAll: () => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      console.log(`📦 Retrieved ${achats.length} achats from database`);
      return achats;
    } catch (error) {
      console.error("❌ Error reading achats:", error);
      return [];
    }
  },

  // Récupérer un achat par ID
  getById: (id) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      return achats.find(achat => achat.id === id) || null;
    } catch (error) {
      console.error("❌ Error finding achat by id:", error);
      return null;
    }
  },

  // Récupérer les achats par mois et année
  getByMonthYear: (month, year) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      return achats.filter(achat => {
        const date = new Date(achat.date);
        return date.getMonth() + 1 === month && date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering achats by month/year:", error);
      return [];
    }
  },

  // Récupérer les achats par année
  getByYear: (year) => {
    try {
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      return achats.filter(achat => {
        const date = new Date(achat.date);
        return date.getFullYear() === year;
      });
    } catch (error) {
      console.error("❌ Error filtering achats by year:", error);
      return [];
    }
  },

  // Créer un nouvel achat et gérer le produit
  create: (achatData) => {
    try {
      console.log('📝 Creating new achat:', achatData);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      let productId = achatData.productId;
      let isNewProduct = false;
      
      // Vérifier si le produit existe dans products.json
      if (productId) {
        const existingProduct = Product.getById(productId);
        
        if (existingProduct) {
          // Le produit existe - mettre à jour la quantité et le prix si nécessaire
          const updatedProductData = {
            description: achatData.productDescription || existingProduct.description,
            purchasePrice: Number(achatData.purchasePrice) || existingProduct.purchasePrice,
            quantity: existingProduct.quantity + Number(achatData.quantity)
          };
          
          Product.update(productId, updatedProductData);
          console.log('✅ Existing product updated with new stock:', updatedProductData);
        }
      } else {
        // Rechercher le produit par description
        const allProducts = Product.getAll();
        const foundProduct = allProducts.find(p => 
          p.description.toLowerCase() === achatData.productDescription.toLowerCase()
        );
        
        if (foundProduct) {
          // Produit trouvé par description - mettre à jour
          productId = foundProduct.id;
          const updatedProductData = {
            description: achatData.productDescription || foundProduct.description,
            purchasePrice: Number(achatData.purchasePrice) || foundProduct.purchasePrice,
            quantity: foundProduct.quantity + Number(achatData.quantity)
          };
          
          Product.update(productId, updatedProductData);
          console.log('✅ Existing product (found by description) updated with new stock:', updatedProductData);
        } else {
          // Le produit n'existe pas - créer un nouveau produit dans products.json
          const newProductData = {
            description: achatData.productDescription,
            purchasePrice: Number(achatData.purchasePrice),
            sellingPrice: Number(achatData.purchasePrice) * 1.3, // Marge par défaut de 30%
            quantity: Number(achatData.quantity),
            fournisseur: achatData.fournisseur || '',
            caracteristiques: achatData.caracteristiques || ''
          };
          
          const createdProduct = Product.create(newProductData);
          if (createdProduct) {
            productId = createdProduct.id;
            isNewProduct = true;
            console.log('✅ New product created in products.json:', createdProduct);
          }
        }
      }
      
      // Créer l'objet achat dans nouvelle_achat.json
      const newAchat = {
        id: Date.now().toString(),
        date: achatData.date || new Date().toISOString(),
        productId: productId,
        productDescription: achatData.productDescription,
        purchasePrice: Number(achatData.purchasePrice),
        quantity: Number(achatData.quantity),
        fournisseur: achatData.fournisseur || '',
        caracteristiques: achatData.caracteristiques || '',
        totalCost: Number(achatData.purchasePrice) * Number(achatData.quantity),
        type: 'achat_produit',
        isNewProduct: isNewProduct
      };
      
      achats.push(newAchat);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat created successfully in nouvelle_achat.json:', newAchat);
      return newAchat;
    } catch (error) {
      console.error("❌ Error creating achat:", error);
      return null;
    }
  },

  // Mettre à jour un achat
  update: (id, achatData) => {
    try {
      console.log(`📝 Updating achat ${id}:`, achatData);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      let achats = JSON.parse(data);
      
      const achatIndex = achats.findIndex(achat => achat.id === id);
      if (achatIndex === -1) {
        console.log(`❌ Achat not found for update: ${id}`);
        return null;
      }
      
      // Calculer le nouveau totalCost
      const updatedData = {
        ...achats[achatIndex],
        ...achatData,
        totalCost: Number(achatData.purchasePrice || achats[achatIndex].purchasePrice) * 
                   Number(achatData.quantity || achats[achatIndex].quantity)
      };
      
      achats[achatIndex] = updatedData;
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat updated successfully:', updatedData);
      return updatedData;
    } catch (error) {
      console.error("❌ Error updating achat:", error);
      return null;
    }
  },

  // Supprimer un achat
  delete: (id) => {
    try {
      console.log(`🗑️ Deleting achat ${id}`);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      let achats = JSON.parse(data);
      
      const achatIndex = achats.findIndex(achat => achat.id === id);
      if (achatIndex === -1) {
        console.log(`❌ Achat not found for deletion: ${id}`);
        return false;
      }
      
      achats.splice(achatIndex, 1);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Achat deleted successfully');
      return true;
    } catch (error) {
      console.error("❌ Error deleting achat:", error);
      return false;
    }
  },

  // DEPRECATED: Utiliser NouvelleDepense.create() à la place
  // Cette méthode est conservée pour la compatibilité
  addDepense: (depenseData) => {
    try {
      console.log('⚠️ DEPRECATED: addDepense should use NouvelleDepense model instead');
      console.log('📝 Adding depense to nouvelle_achat.json for backward compatibility:', depenseData);
      
      const data = fs.readFileSync(nouvelleAchatPath, 'utf8');
      const achats = JSON.parse(data);
      
      const newDepense = {
        id: Date.now().toString(),
        date: depenseData.date || new Date().toISOString(),
        description: depenseData.description,
        totalCost: Number(depenseData.montant),
        type: depenseData.type || 'autre_depense',
        categorie: depenseData.categorie || 'divers'
      };
      
      achats.push(newDepense);
      fs.writeFileSync(nouvelleAchatPath, JSON.stringify(achats, null, 2));
      
      console.log('✅ Depense added successfully:', newDepense);
      return newDepense;
    } catch (error) {
      console.error("❌ Error adding depense:", error);
      return null;
    }
  },

  // Calculer les statistiques mensuelles (achats uniquement)
  getMonthlyStats: (month, year) => {
    try {
      const achats = NouvelleAchat.getByMonthYear(month, year);
      
      const stats = {
        totalAchats: 0,
        totalDepenses: 0,
        achatsCount: 0,
        depensesCount: 0,
        byType: {}
      };
      
      achats.forEach(item => {
        if (item.type === 'achat_produit') {
          stats.totalAchats += item.totalCost;
          stats.achatsCount++;
        } else {
          stats.totalDepenses += item.totalCost;
          stats.depensesCount++;
        }
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.totalCost;
        stats.byType[item.type].count++;
      });
      
      stats.totalGeneral = stats.totalAchats + stats.totalDepenses;
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating monthly stats:", error);
      return null;
    }
  },

  // Calculer les statistiques annuelles
  getYearlyStats: (year) => {
    try {
      const achats = NouvelleAchat.getByYear(year);
      
      const stats = {
        totalAchats: 0,
        totalDepenses: 0,
        achatsCount: 0,
        depensesCount: 0,
        byMonth: {},
        byType: {}
      };
      
      achats.forEach(item => {
        const date = new Date(item.date);
        const month = date.getMonth() + 1;
        
        // Statistiques par mois
        if (!stats.byMonth[month]) {
          stats.byMonth[month] = { achats: 0, depenses: 0 };
        }
        
        if (item.type === 'achat_produit') {
          stats.totalAchats += item.totalCost;
          stats.achatsCount++;
          stats.byMonth[month].achats += item.totalCost;
        } else {
          stats.totalDepenses += item.totalCost;
          stats.depensesCount++;
          stats.byMonth[month].depenses += item.totalCost;
        }
        
        // Regrouper par type
        if (!stats.byType[item.type]) {
          stats.byType[item.type] = { total: 0, count: 0 };
        }
        stats.byType[item.type].total += item.totalCost;
        stats.byType[item.type].count++;
      });
      
      stats.totalGeneral = stats.totalAchats + stats.totalDepenses;
      
      return stats;
    } catch (error) {
      console.error("❌ Error calculating yearly stats:", error);
      return null;
    }
  }
};

module.exports = NouvelleAchat;