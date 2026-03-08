/**
 * =============================================================================
 * Modèle Stock - Gestion des mouvements de stock
 * =============================================================================
 * Gère les entrées/sorties de stock et les alertes de stock bas
 * stockés dans server/db/stocks.json
 */

const fs = require('fs');
const path = require('path');

const stockPath = path.join(__dirname, '../db/stocks.json');

if (!fs.existsSync(stockPath)) {
  fs.writeFileSync(stockPath, JSON.stringify([], null, 2));
}

const Stock = {
  getAll: () => {
    try {
      const data = fs.readFileSync(stockPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },

  getById: (id) => {
    try {
      const items = Stock.getAll();
      return items.find(item => item.id === id) || null;
    } catch (error) {
      return null;
    }
  },

  getByProduct: (productId) => {
    try {
      const items = Stock.getAll();
      return items.filter(item => item.productId === productId);
    } catch (error) {
      return [];
    }
  },

  getLowStock: (threshold = 5) => {
    try {
      const Product = require('./Product');
      const products = Product.getAll();
      return products.filter(p => p.quantity <= threshold);
    } catch (error) {
      return [];
    }
  },

  create: (itemData) => {
    try {
      const items = Stock.getAll();
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: new Date().toISOString()
      };
      items.push(newItem);
      fs.writeFileSync(stockPath, JSON.stringify(items, null, 2));

      // Update product quantity
      if (itemData.productId) {
        const Product = require('./Product');
        const product = Product.getById(itemData.productId);
        if (product) {
          const qtyChange = itemData.type === 'entree' ? itemData.quantity : -itemData.quantity;
          Product.update(itemData.productId, { quantity: Math.max(0, (product.quantity || 0) + qtyChange) });
        }
      }

      return newItem;
    } catch (error) {
      console.error('Error creating stock movement:', error);
      return null;
    }
  },

  delete: (id) => {
    try {
      let items = Stock.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      fs.writeFileSync(stockPath, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  }
};

module.exports = Stock;
