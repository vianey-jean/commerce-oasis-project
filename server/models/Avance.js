const fs = require('fs');
const path = require('path');

const avancePath = path.join(__dirname, '../db/avance.json');

const readJSON = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch { return []; }
};

const writeJSON = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const Avance = {
  getAll: () => readJSON(avancePath),

  getByMonth: (year, month) => {
    const all = readJSON(avancePath);
    return all.filter(a => {
      const d = new Date(a.date);
      return d.getFullYear() === parseInt(year) && (d.getMonth() + 1) === parseInt(month);
    });
  },

  getByTravailleur: (travailleurId, year, month) => {
    const all = readJSON(avancePath);
    return all.filter(a => {
      const d = new Date(a.date);
      return a.travailleurId === travailleurId && 
             d.getFullYear() === parseInt(year) && 
             (d.getMonth() + 1) === parseInt(month);
    });
  },

  create: (data) => {
    const all = readJSON(avancePath);
    const avance = {
      id: Date.now().toString(),
      travailleurId: data.travailleurId,
      travailleurNom: data.travailleurNom || '',
      entrepriseId: data.entrepriseId,
      entrepriseNom: data.entrepriseNom || '',
      montant: Number(data.montant),
      date: data.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    all.push(avance);
    writeJSON(avancePath, all);
    return avance;
  },

  delete: (id) => {
    let all = readJSON(avancePath);
    const index = all.findIndex(a => a.id === id);
    if (index === -1) return false;
    all.splice(index, 1);
    writeJSON(avancePath, all);
    return true;
  }
};

module.exports = Avance;
