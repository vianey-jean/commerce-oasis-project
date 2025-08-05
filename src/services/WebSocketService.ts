
import { io, Socket } from 'socket.io-client';

export interface MessageUpdateData {
  messages: any[];
  unreadCount: number;
}

class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.connect();
  }

  private connect() {
    const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;
    
    this.socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connecté');
      this.reconnectAttempts = 0;
      
      // Demander les données initiales
      this.socket?.emit('request-initial-data');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket déconnecté:', reason);
      this.handleReconnect();
    });

    this.socket.on('messages-updated', (data: MessageUpdateData) => {
      console.log('Messages mis à jour via WebSocket:', data);
      this.emit('messages-updated', data);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Erreur de connexion WebSocket:', error);
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
        this.connect();
      }, 3000 * this.reconnectAttempts);
    }
  }

  public on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  public requestInitialData() {
    this.socket?.emit('request-initial-data');
  }

  public disconnect() {
    this.socket?.disconnect();
    this.listeners.clear();
  }
}

// Instance singleton
export const webSocketService = new WebSocketService();
