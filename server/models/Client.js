
const fs = require('fs');
const path = require('path');

const clientsFilePath = path.join(__dirname, '../data/clients.json');

// Vérifier si le fichier clients.json existe, sinon le créer
if (!fs.existsSync(path.dirname(clientsFilePath))) {
  fs.mkdirSync(path.dirname(clientsFilePath), { recursive: true });
}

if (!fs.existsSync(clientsFilePath)) {
  fs.writeFileSync(clientsFilePath, JSON.stringify([], null, 2));
}

class Client {
  constructor(id, nom, prenom, email, telephone, adresse, dateNaissance, notes, dateCreation, derniereVisite, status, totalRendezVous) {
    this.id = id;
    this.nom = nom;
    this.prenom = prenom;
    this.email = email;
    this.telephone = telephone;
    this.adresse = adresse;
    this.dateNaissance = dateNaissance;
    this.notes = notes;
    this.dateCreation = dateCreation;
    this.derniereVisite = derniereVisite;
    this.status = status;
    this.totalRendezVous = totalRendezVous;
  }

  static getAll() {
    try {
      const clientsData = fs.readFileSync(clientsFilePath, 'utf8');
      return JSON.parse(clientsData);
    } catch (error) {
      console.error('Erreur lors de la lecture des clients:', error);
      return [];
    }
  }

  static getById(id) {
    const clients = this.getAll();
    return clients.find(client => client.id === parseInt(id));
  }

  static getByEmail(email) {
    const clients = this.getAll();
    return clients.find(client => client.email === email);
  }

  static save(clientData) {
    const clients = this.getAll();
    
    // Vérifier si l'email existe déjà (seulement si l'email est fourni)
    if (clientData.email && clientData.email.trim() !== '' && clients.some(client => client.email === clientData.email)) {
      return { success: false, message: 'Cet email est déjà utilisé par un autre client' };
    }
    
    // Générer un nouvel ID
    const newId = clients.length > 0 ? Math.max(...clients.map(client => client.id)) + 1 : 1;
    
    const newClient = {
      id: newId,
      nom: clientData.nom,
      prenom: clientData.prenom,
      email: clientData.email || '',
      telephone: clientData.telephone || '',
      adresse: clientData.adresse || '',
      dateNaissance: clientData.dateNaissance || null,
      notes: clientData.notes || '',
      dateCreation: clientData.dateCreation || new Date().toISOString().split('T')[0],
      derniereVisite: clientData.derniereVisite || null,
      status: clientData.status || 'actif',
      totalRendezVous: clientData.totalRendezVous || 0
    };
    
    clients.push(newClient);
    
    try {
      fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
      return { success: true, client: newClient };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du client:', error);
      return { success: false, message: 'Erreur lors de l\'enregistrement' };
    }
  }

  static update(id, clientData) {
    const clients = this.getAll();
    const index = clients.findIndex(client => client.id === parseInt(id));
    
    if (index === -1) {
      return { success: false, message: 'Client non trouvé' };
    }
    
    // Vérifier si l'email mis à jour existe déjà chez un autre client (seulement si l'email est fourni)
    if (clientData.email && clientData.email.trim() !== '' && clientData.email !== clients[index].email) {
      if (clients.some(client => client.email === clientData.email && client.id !== parseInt(id))) {
        return { success: false, message: 'Cet email est déjà utilisé par un autre client' };
      }
    }
    
    // Mettre à jour les champs modifiés
    clients[index] = { ...clients[index], ...clientData };
    
    try {
      fs.writeFileSync(clientsFilePath, JSON.stringify(clients, null, 2));
      return { success: true, client: clients[index] };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }
  }

  static delete(id) {
    const clients = this.getAll();
    const filteredClients = clients.filter(client => client.id !== parseInt(id));
    
    if (filteredClients.length === clients.length) {
      return { success: false, message: 'Client non trouvé' };
    }
    
    try {
      fs.writeFileSync(clientsFilePath, JSON.stringify(filteredClients, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return { success: false, message: 'Erreur lors de la suppression' };
    }
  }
}

module.exports = Client;
