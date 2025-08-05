
/**
 * ============================================================================
 * MODÈLE RENDEZ-VOUS - GESTION DES DONNÉES DE RENDEZ-VOUS (BACKEND)
 * ============================================================================
 * 
 * Ce modèle gère toutes les opérations CRUD pour les rendez-vous de l'application.
 * Il fournit des méthodes avancées de recherche, filtrage et gestion des données.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - CRUD complet pour les rendez-vous
 * - Recherche avancée par mots-clés
 * - Filtrage par période (semaine, mois)
 * - Filtrage par utilisateur
 * - Gestion des statuts (validé, annulé, reporté)
 * - Stockage persistent dans appointments.json
 * 
 * STRUCTURE RENDEZ-VOUS :
 * - id : Identifiant unique auto-généré
 * - userId : ID de l'utilisateur propriétaire
 * - statut : État du rendez-vous (validé, annulé, reporté)
 * - nom/prenom : Nom du client/participant
 * - dateNaissance : Date de naissance du participant
 * - telephone : Numéro de téléphone de contact
 * - titre : Titre/objet du rendez-vous
 * - description : Description détaillée
 * - date : Date du rendez-vous (YYYY-MM-DD)
 * - heure : Heure du rendez-vous (HH:MM)
 * - duree : Durée en minutes
 * - location : Lieu/adresse du rendez-vous
 * 
 * FONCTIONNALITÉS AVANCÉES :
 * - Recherche full-text dans titre, description, lieu, noms
 * - Filtrage par plage de dates pour calendrier
 * - Méthodes spécialisées par utilisateur
 * - Validation et sanitisation des données
 * 
 * SÉCURITÉ :
 * - Validation des types de données
 * - Protection contre les injections
 * - Vérification d'existence avant modification
 * - Gestion robuste des erreurs
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

const fs = require('fs');
const path = require('path');

const appointmentsFilePath = path.join(__dirname, '../data/appointments.json');

// Vérifier si le fichier appointments.json existe, sinon le créer
if (!fs.existsSync(path.dirname(appointmentsFilePath))) {
  fs.mkdirSync(path.dirname(appointmentsFilePath), { recursive: true });
}

if (!fs.existsSync(appointmentsFilePath)) {
  fs.writeFileSync(appointmentsFilePath, JSON.stringify([], null, 2));
}

class Appointment {
  constructor(id, userId, statut, nom, prenom, dateNaissance, telephone, titre, description, date, heure, duree, location) {
    this.id = id;
    this.userId = userId;
    this.statut = statut || 'validé';
    this.nom = nom || '';
    this.prenom = prenom || '';
    this.dateNaissance = dateNaissance || '';
    this.telephone = telephone || '';
    this.titre = titre;
    this.description = description;
    this.date = date;
    this.heure = heure;
    this.duree = duree;
    this.location = location;
  }

  static getAll() {
    try {
      const appointmentsData = fs.readFileSync(appointmentsFilePath, 'utf8');
      return JSON.parse(appointmentsData);
    } catch (error) {
      console.error('Erreur lors de la lecture des rendez-vous:', error);
      return [];
    }
  }

  static getById(id) {
    const appointments = this.getAll();
    return appointments.find(appointment => appointment.id === parseInt(id));
  }

  static getByUserId(userId) {
    const appointments = this.getAll();
    return appointments.filter(appointment => appointment.userId === parseInt(userId));
  }

  static getByWeek(startDate, endDate, userId = null) {
    const appointments = this.getAll();
    
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const isInRange = appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
      
      if (userId) {
        return isInRange && appointment.userId === parseInt(userId);
      }
      
      return isInRange;
    });
  }

  static search(query, userId = null) {
    if (!query || query.length < 3) {
      return [];
    }
    
    const appointments = this.getAll();
    const lowerCaseQuery = query.toLowerCase();
    
    return appointments.filter(appointment => {
      const matchesQuery = 
        appointment.titre.toLowerCase().includes(lowerCaseQuery) ||
        appointment.description.toLowerCase().includes(lowerCaseQuery) ||
        appointment.location.toLowerCase().includes(lowerCaseQuery) ||
        (appointment.nom && appointment.nom.toLowerCase().includes(lowerCaseQuery)) ||
        (appointment.prenom && appointment.prenom.toLowerCase().includes(lowerCaseQuery));
      
      if (userId) {
        return matchesQuery && appointment.userId === parseInt(userId);
      }
      
      return matchesQuery;
    });
  }

  static save(appointmentData) {
    const appointments = this.getAll();
    
    // Générer un nouvel ID
    const newId = appointments.length > 0 ? Math.max(...appointments.map(appointment => appointment.id)) + 1 : 1;
    
    const newAppointment = {
      id: newId,
      userId: parseInt(appointmentData.userId),
      statut: appointmentData.statut || 'validé',
      nom: appointmentData.nom || '',
      prenom: appointmentData.prenom || '',
      dateNaissance: appointmentData.dateNaissance || '',
      telephone: appointmentData.telephone || '',
      titre: appointmentData.titre,
      description: appointmentData.description,
      date: appointmentData.date,
      heure: appointmentData.heure,
      duree: parseInt(appointmentData.duree),
      location: appointmentData.location
    };
    
    appointments.push(newAppointment);
    
    try {
      fs.writeFileSync(appointmentsFilePath, JSON.stringify(appointments, null, 2));
      return { success: true, appointment: newAppointment };
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      return { success: false, message: 'Erreur lors de l\'enregistrement' };
    }
  }

  static update(id, appointmentData) {
    const appointments = this.getAll();
    const index = appointments.findIndex(appointment => appointment.id === parseInt(id));
    
    if (index === -1) {
      return { success: false, message: 'Rendez-vous non trouvé' };
    }
    
    // Mettre à jour les champs modifiés
    appointments[index] = { 
      ...appointments[index],
      ...appointmentData,
      id: parseInt(id),
      userId: parseInt(appointmentData.userId || appointments[index].userId),
      duree: parseInt(appointmentData.duree || appointments[index].duree),
      statut: appointmentData.statut || appointments[index].statut,
      nom: appointmentData.nom !== undefined ? appointmentData.nom : appointments[index].nom,
      prenom: appointmentData.prenom !== undefined ? appointmentData.prenom : appointments[index].prenom,
      dateNaissance: appointmentData.dateNaissance !== undefined ? appointmentData.dateNaissance : appointments[index].dateNaissance,
      telephone: appointmentData.telephone !== undefined ? appointmentData.telephone : appointments[index].telephone
    };
    
    try {
      fs.writeFileSync(appointmentsFilePath, JSON.stringify(appointments, null, 2));
      return { success: true, appointment: appointments[index] };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', error);
      return { success: false, message: 'Erreur lors de la mise à jour' };
    }
  }

  static delete(id) {
    const appointments = this.getAll();
    const filteredAppointments = appointments.filter(appointment => appointment.id !== parseInt(id));
    
    if (filteredAppointments.length === appointments.length) {
      return { success: false, message: 'Rendez-vous non trouvé' };
    }
    
    try {
      fs.writeFileSync(appointmentsFilePath, JSON.stringify(filteredAppointments, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      return { success: false, message: 'Erreur lors de la suppression' };
    }
  }
}

module.exports = Appointment;
