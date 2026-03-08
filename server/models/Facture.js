/**
 * =============================================================================
 * Modèle Facture - Gestion des factures et devis
 * =============================================================================
 * Gère la création, lecture, modification et suppression des factures/devis
 * stockés dans server/db/factures.json
 */

const fs = require('fs');
const path = require('path');

const facturePath = path.join(__dirname, '../db/factures.json');

// Initialiser le fichier s'il n'existe pas
if (!fs.existsSync(facturePath)) {
  fs.writeFileSync(facturePath, JSON.stringify([], null, 2));
}

const Facture = {
  getAll: () => {
    try {
      const data = fs.readFileSync(facturePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },

  getById: (id) => {
    try {
      const items = Facture.getAll();
      return items.find(item => item.id === id) || null;
    } catch (error) {
      return null;
    }
  },

  getByType: (type) => {
    try {
      const items = Facture.getAll();
      return items.filter(item => item.type === type);
    } catch (error) {
      return [];
    }
  },

  getByMonth: (year, month) => {
    try {
      const items = Facture.getAll();
      return items.filter(item => {
        const d = new Date(item.date);
        return d.getFullYear() === Number(year) && (d.getMonth() + 1) === Number(month);
      });
    } catch (error) {
      return [];
    }
  },

  getNextNumber: (type) => {
    try {
      const items = Facture.getAll().filter(i => i.type === type);
      const year = new Date().getFullYear();
      const prefix = type === 'facture' ? 'FAC' : 'DEV';
      const yearItems = items.filter(i => i.numero && i.numero.includes(year.toString()));
      const nextNum = yearItems.length + 1;
      return `${prefix}-${year}-${String(nextNum).padStart(4, '0')}`;
    } catch {
      const prefix = type === 'facture' ? 'FAC' : 'DEV';
      return `${prefix}-${new Date().getFullYear()}-0001`;
    }
  },

  create: (itemData) => {
    try {
      const items = Facture.getAll();
      const newItem = {
        id: Date.now().toString(),
        numero: Facture.getNextNumber(itemData.type || 'facture'),
        ...itemData,
        statut: itemData.statut || 'brouillon',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      fs.writeFileSync(facturePath, JSON.stringify(items, null, 2));
      return newItem;
    } catch (error) {
      console.error('Error creating facture:', error);
      return null;
    }
  },

  update: (id, itemData) => {
    try {
      const items = Facture.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      items[index] = { ...items[index], ...itemData, updatedAt: new Date().toISOString() };
      fs.writeFileSync(facturePath, JSON.stringify(items, null, 2));
      return items[index];
    } catch (error) {
      console.error('Error updating facture:', error);
      return null;
    }
  },

  delete: (id) => {
    try {
      let items = Facture.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      fs.writeFileSync(facturePath, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      console.error('Error deleting facture:', error);
      return false;
    }
  }
};

module.exports = Facture;
