
import { useState, useEffect } from 'react';
import { MessageService } from '@/services/MessageService';
import { webSocketService, MessageUpdateData } from '@/services/WebSocketService';

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [messages, setMessages] = useState<any[]>([]);

  const loadUnreadCount = async () => {
    try {
      const messagesData = await MessageService.getAllMessages();
      const count = messagesData.filter(msg => !msg.lu).length;
      setUnreadCount(count);
      setMessages(messagesData);
    } catch (error) {
      console.error('Erreur lors du chargement des messages non lus:', error);
    }
  };

  useEffect(() => {
    // Chargement initial
    loadUnreadCount();

    // Écouter les mises à jour WebSocket
    const handleMessagesUpdate = (data: MessageUpdateData) => {
      console.log('Mise à jour des messages reçue:', data);
      setMessages(data.messages);
      setUnreadCount(data.unreadCount);
    };

    webSocketService.on('messages-updated', handleMessagesUpdate);
    
    // Demander les données initiales via WebSocket
    webSocketService.requestInitialData();

    // Cleanup
    return () => {
      webSocketService.off('messages-updated', handleMessagesUpdate);
    };
  }, []);

  const refreshUnreadCount = () => {
    loadUnreadCount();
    webSocketService.requestInitialData();
  };

  return {
    unreadCount,
    messages,
    refreshUnreadCount
  };
};
