
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
  constructor(id, userId, titre, description, date, heure, duree, location) {
    this.id = id;
    this.userId = userId;
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
        appointment.location.toLowerCase().includes(lowerCaseQuery);
      
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
      duree: parseInt(appointmentData.duree || appointments[index].duree)
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
