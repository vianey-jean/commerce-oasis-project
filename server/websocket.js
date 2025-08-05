
const { Server } = require('socket.io');
const fs = require('fs').promises;
const path = require('path');

let io = null;
const messagesFilePath = path.join(__dirname, 'data/messages.json');

const initializeWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connecté:', socket.id);

    // Envoi des messages initiaux à la connexion
    socket.on('request-initial-data', async () => {
      try {
        const messages = await readMessages();
        const unreadCount = messages.filter(msg => !msg.lu).length;
        socket.emit('messages-updated', { messages, unreadCount });
      } catch (error) {
        console.error('Erreur lors de l\'envoi des données initiales:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client déconnecté:', socket.id);
    });
  });

  return io;
};

const readMessages = async () => {
  try {
    const data = await fs.readFile(messagesFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const broadcastMessagesUpdate = async () => {
  if (io) {
    try {
      const messages = await readMessages();
      const unreadCount = messages.filter(msg => !msg.lu).length;
      io.emit('messages-updated', { messages, unreadCount });
    } catch (error) {
      console.error('Erreur lors de la diffusion des messages:', error);
    }
  }
};

module.exports = {
  initializeWebSocket,
  broadcastMessagesUpdate
};
