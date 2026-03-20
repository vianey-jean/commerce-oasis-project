const fs = require('fs');
const path = require('path');

class AdminChat {
  constructor() {
    this.dbPath = path.join(__dirname, '../db/adminChat.json');
    this.typingPath = path.join(__dirname, '../db/typingStatus.json');
    this.ensureFileExists();
  }

  ensureFileExists() {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(this.typingPath)) {
      fs.writeFileSync(this.typingPath, JSON.stringify({}, null, 2));
    }
  }

  getAll() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading admin chat:', error);
      return [];
    }
  }

  // Get conversation between two admins
  getConversation(userId1, userId2) {
    const messages = this.getAll();
    return messages.filter(msg =>
      (msg.senderId === userId1 && msg.receiverId === userId2) ||
      (msg.senderId === userId2 && msg.receiverId === userId1)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // Get all conversations for a user
  getConversationsForUser(userId) {
    const messages = this.getAll();
    const userMessages = messages.filter(
      msg => msg.senderId === userId || msg.receiverId === userId
    );

    // Group by conversation partner
    const conversations = {};
    userMessages.forEach(msg => {
      const partnerId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversations[partnerId]) {
        conversations[partnerId] = {
          partnerId,
          messages: [],
          lastMessage: null,
          unreadCount: 0
        };
      }
      conversations[partnerId].messages.push(msg);
      if (!conversations[partnerId].lastMessage ||
        new Date(msg.timestamp) > new Date(conversations[partnerId].lastMessage.timestamp)) {
        conversations[partnerId].lastMessage = msg;
      }
      if (msg.receiverId === userId && !msg.lu) {
        conversations[partnerId].unreadCount++;
      }
    });

    return Object.values(conversations).sort((a, b) =>
      new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
    );
  }

  create(messageData) {
    const messages = this.getAll();
    const newMessage = {
      id: Date.now().toString(),
      senderId: messageData.senderId,
      senderName: messageData.senderName,
      senderPhoto: messageData.senderPhoto || '',
      receiverId: messageData.receiverId,
      receiverName: messageData.receiverName,
      contenu: messageData.contenu,
      timestamp: new Date().toISOString(),
      lu: false
    };

    messages.push(newMessage);
    this.saveAll(messages);
    return newMessage;
  }

  markAsRead(messageId, userId) {
    const messages = this.getAll();
    const idx = messages.findIndex(
      msg => msg.id === messageId && msg.receiverId === userId
    );
    if (idx !== -1) {
      messages[idx].lu = true;
      this.saveAll(messages);
      return messages[idx];
    }
    return null;
  }

  markConversationAsRead(senderId, receiverId) {
    const messages = this.getAll();
    let changed = false;
    messages.forEach(msg => {
      if (msg.senderId === senderId && msg.receiverId === receiverId && !msg.lu) {
        msg.lu = true;
        changed = true;
      }
    });
    if (changed) {
      this.saveAll(messages);
    }
    return changed;
  }

  delete(messageId, userId) {
    const messages = this.getAll();
    const filtered = messages.filter(
      msg => !(msg.id === messageId && (msg.senderId === userId || msg.receiverId === userId))
    );
    if (filtered.length !== messages.length) {
      this.saveAll(filtered);
      return true;
    }
    return false;
  }

  // Typing status management
  setTyping(userId, userName, receiverId, isTyping) {
    try {
      const data = fs.readFileSync(this.typingPath, 'utf8');
      const typingStatus = JSON.parse(data);
      const key = `${userId}_${receiverId}`;

      if (isTyping) {
        typingStatus[key] = {
          userId,
          userName,
          receiverId,
          timestamp: Date.now()
        };
      } else {
        delete typingStatus[key];
      }

      fs.writeFileSync(this.typingPath, JSON.stringify(typingStatus, null, 2));
      return true;
    } catch (error) {
      console.error('Error setting typing status:', error);
      return false;
    }
  }

  getTypingStatus(userId) {
    try {
      const data = fs.readFileSync(this.typingPath, 'utf8');
      const typingStatus = JSON.parse(data);
      const now = Date.now();

      // Return typing indicators targeted at this user, clean old ones (>5s)
      const result = [];
      const cleaned = {};
      let needsSave = false;

      Object.entries(typingStatus).forEach(([key, status]) => {
        if (now - status.timestamp > 5000) {
          needsSave = true;
          return; // expired
        }
        cleaned[key] = status;
        if (status.receiverId === userId) {
          result.push(status);
        }
      });

      if (needsSave) {
        fs.writeFileSync(this.typingPath, JSON.stringify(cleaned, null, 2));
      }

      return result;
    } catch (error) {
      console.error('Error getting typing status:', error);
      return [];
    }
  }

  getUnreadCountForUser(userId) {
    const messages = this.getAll();
    return messages.filter(msg => msg.receiverId === userId && !msg.lu).length;
  }

  saveAll(messages) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(messages, null, 2));
    } catch (error) {
      console.error('Error saving admin chat:', error);
      throw error;
    }
  }
}

module.exports = new AdminChat();
