
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');
const { broadcastMessagesUpdate } = require('../websocket');

const messagesFilePath = path.join(__dirname, '../data/messages.json');

// Fonction utilitaire pour lire les messages
const readMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Fonction utilitaire pour écrire les messages
const writeMessages = async (messages) => {
  try {
    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), 'utf-8');
    // Diffuser les changements via WebSocket
    broadcastMessagesUpdate();
  } catch (error) {
    console.error('Erreur lors de l\'écriture des messages:', error);
  }
};

class Contact {
  static async send(contactData) {
    try {
      // Sauvegarder d'abord le message dans le fichier JSON
      const messages = await readMessages();
      const newMessage = {
        id: Date.now().toString(),
        nom: contactData.nom,
        email: contactData.email,
        sujet: contactData.sujet,
        message: contactData.message,
        dateEnvoi: new Date().toISOString(),
        lu: false
      };

      messages.push(newMessage);
      await writeMessages(messages);

      // Créer un transporteur SMTP seulement si les variables sont définies
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransporter({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: false, // true pour 465, false pour d'autres ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        // Format du message
        const mailOptions = {
          from: `"${contactData.nom}" <${contactData.email}>`,
          to: process.env.SMTP_USER, // Destinataire (adresse de réception des messages du site)
          subject: `[Contact Riziky-Agendas] ${contactData.sujet}`,
          text: `Message de: ${contactData.nom} (${contactData.email})\n\n${contactData.message}`,
          html: `
            <h2>Nouveau message de contact</h2>
            <p><strong>De:</strong> ${contactData.nom}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Sujet:</strong> ${contactData.sujet}</p>
            <div style="margin-top: 20px; padding: 15px; border-left: 4px solid #ccc;">
              <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
          `,
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        console.log('Message envoyé par email: %s', info.messageId);
      } else {
        console.log('Configuration SMTP manquante, message sauvegardé uniquement');
      }
      
      return { success: true, messageId: newMessage.id };
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      return { success: false, message: 'Erreur lors de l\'envoi' };
    }
  }
}

module.exports = Contact;
