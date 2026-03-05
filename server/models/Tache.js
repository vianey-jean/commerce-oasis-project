const fs = require('fs');
const path = require('path');

const tachePath = path.join(__dirname, '../db/tache.json');

const Tache = {
  getAll: () => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  },

  getByDate: (date) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      const items = JSON.parse(data);
      return items.filter(item => item.date === date);
    } catch (error) {
      return [];
    }
  },

  getByMonth: (year, month) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      const items = JSON.parse(data);
      return items.filter(item => {
        const d = new Date(item.date);
        return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(month);
      });
    } catch (error) {
      return [];
    }
  },

  getByWeek: (startDate, endDate) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      const items = JSON.parse(data);
      return items.filter(item => item.date >= startDate && item.date <= endDate);
    } catch (error) {
      return [];
    }
  },

  getById: (id) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      const items = JSON.parse(data);
      return items.find(item => item.id === id) || null;
    } catch (error) {
      return null;
    }
  },

  create: (itemData) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      const items = JSON.parse(data);
      const newItem = {
        id: Date.now().toString(),
        ...itemData,
        createdAt: new Date().toISOString()
      };
      items.push(newItem);
      fs.writeFileSync(tachePath, JSON.stringify(items, null, 2));
      return newItem;
    } catch (error) {
      console.error('Error creating tache:', error);
      return null;
    }
  },

  update: (id, itemData) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      let items = JSON.parse(data);
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return null;
      const existing = items[index];
      
      // Allow marking as completed for any task (pertinent or optionnel)
      if (itemData.completed !== undefined) {
        items[index] = { ...existing, completed: itemData.completed };
        if (Object.keys(itemData).length === 1) {
          fs.writeFileSync(tachePath, JSON.stringify(items, null, 2));
          return items[index];
        }
      }
      
      if (existing.importance === 'pertinent') {
        // On ne peut modifier que la description de la tâche, pas date/heure/suppression
        items[index] = { ...items[index], description: itemData.description || existing.description };
      } else {
        items[index] = { ...items[index], ...itemData };
        // Une optionnelle peut devenir pertinente mais pas l'inverse
        if (itemData.importance === 'pertinent') {
          items[index].importance = 'pertinent';
        }
      }
      fs.writeFileSync(tachePath, JSON.stringify(items, null, 2));
      return items[index];
    } catch (error) {
      console.error('Error updating tache:', error);
      return null;
    }
  },

  delete: (id) => {
    try {
      const data = fs.readFileSync(tachePath, 'utf8');
      let items = JSON.parse(data);
      const index = items.findIndex(item => item.id === id);
      if (index === -1) return false;
      // Ne pas supprimer les tâches pertinentes
      if (items[index].importance === 'pertinent') return false;
      items.splice(index, 1);
      fs.writeFileSync(tachePath, JSON.stringify(items, null, 2));
      return true;
    } catch (error) {
      console.error('Error deleting tache:', error);
      return false;
    }
  }
};

module.exports = Tache;