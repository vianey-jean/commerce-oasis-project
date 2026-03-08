/**
 * =============================================================================
 * Modèle Notification - Centre de notifications
 * =============================================================================
 * Gère les notifications système, rappels RDV, alertes paiements
 * stockés dans server/db/notifications.json
 */

const fs = require('fs');
const path = require('path');

const notifPath = path.join(__dirname, '../db/notifications.json');

if (!fs.existsSync(notifPath)) {
  fs.writeFileSync(notifPath, JSON.stringify([], null, 2));
}

const Notification = {
  getAll: () => {
    try {
      const data = fs.readFileSync(notifPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },

  getUnread: () => {
    try {
      const items = Notification.getAll();
      return items.filter(item => !item.read);
    } catch (error) {
      return [];
    }
  },

  getByType: (type) => {
    try {
      const items = Notification.getAll();
      return items.filter(item => item.type === type);
    } catch (error) {
      return [];
    }
  },

  create: (itemData) => {
    try {
      const items = Notification.getAll();
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
        read: false,
        createdAt: new Date().toISOString()
      };
      items.unshift(newItem); // Add at beginning
      // Keep max 100 notifications
      if (items.length > 100) items.splice(100);
      fs.writeFileSync(notifPath, JSON.stringify(items, null, 2));
      return newItem;
    } catch (error) {
      console.error('Error creating notification:', error);
      return null;
    }
  },

  markAsRead: (id) => {
    try {
      const items = Notification.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      items[index].read = true;
      fs.writeFileSync(notifPath, JSON.stringify(items, null, 2));
      return items[index];
    } catch (error) {
      return null;
    }
  },

  markAllAsRead: () => {
    try {
      const items = Notification.getAll();
      items.forEach(item => item.read = true);
      fs.writeFileSync(notifPath, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  },

  delete: (id) => {
    try {
      let items = Notification.getAll();
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return false;
      items.splice(index, 1);
      fs.writeFileSync(notifPath, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      return false;
    }
  },

  deleteAll: () => {
    try {
      fs.writeFileSync(notifPath, JSON.stringify([], null, 2));
      return true;
    } catch (error) {
      return false;
    }
  }
};

module.exports = Notification;
