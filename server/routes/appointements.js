
const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { isAuthenticated } = require('../middlewares/authMiddleware');
const nodemailer = require('nodemailer');

// Middleware pour vérifier si l'utilisateur est autorisé à accéder à un rendez-vous
const canAccessAppointment = (req, res, next) => {
  const appointmentId = req.params.id;
  const appointment = Appointment.getById(appointmentId);
  
  if (!appointment) {
    return res.status(404).json({ error: 'Rendez-vous non trouvé' });
  }
  
  if (appointment.userId !== req.user.id) {
    return res.status(403).json({ error: 'Accès non autorisé à ce rendez-vous' });
  }
  
  req.appointment = appointment;
  next();
};

// Route pour obtenir tous les rendez-vous de l'utilisateur connecté
router.get('/', isAuthenticated, (req, res) => {
  const appointments = Appointment.getByUserId(req.user.id);
  res.json({ appointments });
});

// Route pour obtenir un rendez-vous spécifique
router.get('/:id', isAuthenticated, canAccessAppointment, (req, res) => {
  res.json({ appointment: req.appointment });
});

// Route pour obtenir les rendez-vous dans une plage de dates
router.get('/week/:startDate/:endDate', isAuthenticated, (req, res) => {
  const { startDate, endDate } = req.params;
  const appointments = Appointment.getByWeek(startDate, endDate, req.user.id);
  res.json({ appointments });
});

// Route pour rechercher des rendez-vous
router.get('/search/:query', isAuthenticated, (req, res) => {
  const { query } = req.params;
  const appointments = Appointment.search(query, req.user.id);
  res.json({ appointments });
});

// Fonction pour envoyer un email de notification
const sendAppointmentNotification = async (action, appointment, user) => {
  try {
    // Créer un transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let subject, text, html;
    
    switch (action) {
      case 'create':
        subject = `[Riziky-Agendas] Nouveau rendez-vous: ${appointment.titre}`;
        text = `Bonjour ${user.prenom},\n\nVotre rendez-vous "${appointment.titre}" a été créé avec succès.\n\nDate: ${appointment.date}\nHeure: ${appointment.heure}\nLieu: ${appointment.location}\n\nDescription: ${appointment.description}\n\nL'équipe Riziky-Agendas`;
        html = `
          <h2>Nouveau rendez-vous créé</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Votre rendez-vous <strong>${appointment.titre}</strong> a été créé avec succès.</p>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #4CAF50; background-color: #f8f8f8;">
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Heure:</strong> ${appointment.heure}</p>
            <p><strong>Durée:</strong> ${appointment.duree} minutes</p>
            <p><strong>Lieu:</strong> ${appointment.location}</p>
            <p><strong>Description:</strong> ${appointment.description}</p>
          </div>
          <p>L'équipe Riziky-Agendas</p>
        `;
        break;
        
      case 'update':
        subject = `[Riziky-Agendas] Rendez-vous modifié: ${appointment.titre}`;
        text = `Bonjour ${user.prenom},\n\nVotre rendez-vous "${appointment.titre}" a été modifié.\n\nDate: ${appointment.date}\nHeure: ${appointment.heure}\nLieu: ${appointment.location}\n\nDescription: ${appointment.description}\n\nL'équipe Riziky-Agendas`;
        html = `
          <h2>Rendez-vous modifié</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Votre rendez-vous <strong>${appointment.titre}</strong> a été modifié.</p>
          <div style="margin: 20px 0; padding: 15px; border-left: 4px solid #FFC107; background-color: #f8f8f8;">
            <p><strong>Date:</strong> ${appointment.date}</p>
            <p><strong>Heure:</strong> ${appointment.heure}</p>
            <p><strong>Durée:</strong> ${appointment.duree} minutes</p>
            <p><strong>Lieu:</strong> ${appointment.location}</p>
            <p><strong>Description:</strong> ${appointment.description}</p>
          </div>
          <p>L'équipe Riziky-Agendas</p>
        `;
        break;
        
      case 'delete':
        subject = `[Riziky-Agendas] Rendez-vous supprimé: ${appointment.titre}`;
        text = `Bonjour ${user.prenom},\n\nVotre rendez-vous "${appointment.titre}" prévu le ${appointment.date} à ${appointment.heure} a été supprimé.\n\nL'équipe Riziky-Agendas`;
        html = `
          <h2>Rendez-vous supprimé</h2>
          <p>Bonjour ${user.prenom},</p>
          <p>Votre rendez-vous <strong>${appointment.titre}</strong> prévu le ${appointment.date} à ${appointment.heure} a été supprimé.</p>
          <p>L'équipe Riziky-Agendas</p>
        `;
        break;
    }

    // Format du message
    const mailOptions = {
      from: `"Riziky-Agendas" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject,
      text,
      html,
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Notification envoyée: %s', info.messageId);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification:', error);
    return false;
  }
};

// Route pour créer un nouveau rendez-vous
router.post('/', isAuthenticated, async (req, res) => {
  const { titre, description, date, heure, duree, location } = req.body;
  
  // Vérifier si toutes les données requises sont présentes
  if (!titre || !description || !date || !heure || !duree || !location) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }
  
  const appointmentData = {
    userId: req.user.id,
    titre,
    description,
    date,
    heure,
    duree,
    location
  };
  
  const result = Appointment.save(appointmentData);
  
  if (result.success) {
    // Envoyer une notification par email
    await sendAppointmentNotification('create', result.appointment, req.user);
    
    return res.status(201).json({ 
      message: 'Rendez-vous créé avec succès', 
      appointment: result.appointment 
    });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour mettre à jour un rendez-vous
router.put('/:id', isAuthenticated, canAccessAppointment, async (req, res) => {
  const appointmentId = req.params.id;
  const { titre, description, date, heure, duree, location } = req.body;
  
  const updateData = {
    userId: req.user.id // S'assurer que l'utilisateur reste le même
  };
  
  if (titre) updateData.titre = titre;
  if (description) updateData.description = description;
  if (date) updateData.date = date;
  if (heure) updateData.heure = heure;
  if (duree) updateData.duree = duree;
  if (location) updateData.location = location;
  
  const result = Appointment.update(appointmentId, updateData);
  
  if (result.success) {
    // Envoyer une notification par email
    await sendAppointmentNotification('update', result.appointment, req.user);
    
    return res.json({ 
      message: 'Rendez-vous mis à jour avec succès', 
      appointment: result.appointment 
    });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

// Route pour supprimer un rendez-vous
router.delete('/:id', isAuthenticated, canAccessAppointment, async (req, res) => {
  const appointmentId = req.params.id;
  const appointmentToDelete = req.appointment; // Sauvegardé par le middleware canAccessAppointment
  
  const result = Appointment.delete(appointmentId);
  
  if (result.success) {
    // Envoyer une notification par email
    await sendAppointmentNotification('delete', appointmentToDelete, req.user);
    
    return res.json({ message: 'Rendez-vous supprimé avec succès' });
  } else {
    return res.status(400).json({ error: result.message });
  }
});

module.exports = router;
