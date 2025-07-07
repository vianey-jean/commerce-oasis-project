
import { api } from '@/service/api';

export interface SyncData {
  products: any[];
  sales: any[];
  pretFamilles: any[];
  pretProduits: any[];
  depenses: any[];
}

interface SyncEvent {
  type: 'data-changed' | 'force-sync' | 'connected' | 'heartbeat';
  data?: any;
  timestamp: number;
}

class RealtimeService {
  private eventSource: EventSource | null = null;
  private listeners: Set<(data: Partial<SyncData>) => void> = new Set();
  private syncListeners: Set<(event: SyncEvent) => void> = new Set();
  private lastSyncTime: Date = new Date();
  private isConnected: boolean = false;
  private reconnectInterval: number = 2000; // Réduction à 2 secondes
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10; // Augmentation du nombre de tentatives
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('RealtimeService initialisé');
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Écouter les changements de connectivité
    window.addEventListener('online', () => {
      console.log('Connexion Internet rétablie, reconnexion SSE immédiate...');
      this.connect();
    });

    window.addEventListener('offline', () => {
      console.log('Connexion Internet perdue');
      this.disconnect();
    });
  }

  // Connexion au serveur SSE optimisée pour réactivité
  connect(token?: string) {
    if (this.eventSource) {
      this.eventSource.close();
    }

    console.log('Tentative de connexion SSE...');

    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'https://server-gestion-ventes.onrender.com';
      const url = `${baseUrl}/api/sync/events`;
      
      console.log('URL SSE:', url);
      
      // Configuration EventSource optimisée
      this.eventSource = new EventSource(url);

      this.eventSource.onopen = () => {
        console.log('✅ Connexion SSE établie - Mode réactif activé');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.stopPolling();
        
        this.notifySyncListeners({
          type: 'connected',
          timestamp: Date.now()
        });
      };

      this.eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Message SSE reçu (réactif):', data);
          this.handleSyncEvent('data-changed', data);
        } catch (error) {
          console.error('Erreur parsing SSE message:', error);
        }
      };

      this.eventSource.onerror = (error) => {
        console.error('❌ Erreur SSE:', error);
        this.isConnected = false;
        
        // Fermer la connexion actuelle
        if (this.eventSource) {
          this.eventSource.close();
          this.eventSource = null;
        }
        
        // Reconnexion plus rapide
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          const delay = Math.min(this.reconnectInterval * Math.pow(1.5, this.reconnectAttempts), 10000);
          setTimeout(() => {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnexion SSE rapide ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            this.connect();
          }, delay);
        } else {
          console.log('🚫 Basculement vers polling haute fréquence');
          this.fallbackToPolling();
        }
      };

      // Écouter les événements personnalisés
      ['data-changed', 'force-sync', 'connected', 'heartbeat'].forEach(eventType => {
        this.eventSource?.addEventListener(eventType, (event: any) => {
          try {
            const data = JSON.parse(event.data);
            console.log(`📡 SSE ${eventType} (réactif):`, data);
            this.handleSyncEvent(eventType as any, data);
          } catch (error) {
            console.error(`Erreur parsing ${eventType}:`, error);
          }
        });
      });

    } catch (error) {
      console.error('Erreur création EventSource:', error);
      this.isConnected = false;
      this.fallbackToPolling();
    }
  }

  // Polling haute fréquence pour les ventes du mois en cours
  private fallbackToPolling() {
    if (this.pollingInterval) return;
    
    console.log('🔄 Mode polling haute fréquence activé');
    this.pollingInterval = setInterval(async () => {
      try {
        // Récupérer seulement les ventes du mois en cours
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const currentYear = currentDate.getFullYear();
        
        const response = await api.get(`/sales/by-month?month=${currentMonth}&year=${currentYear}`);
        
        if (response.data) {
          this.processSyncData('sales', response.data);
        }
      } catch (error) {
        console.error('Erreur polling haute fréquence:', error);
      }
    }, 500); // Polling toutes les 500ms pour une réactivité maximale
  }

  // Arrêter le polling
  private stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('🛑 Polling arrêté - SSE actif');
    }
  }

  // Déconnexion
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.stopPolling();
    this.isConnected = false;
    console.log('🔌 Connexion SSE fermée');
  }

  // Gérer les événements de synchronisation
  private handleSyncEvent(type: SyncEvent['type'], data: any) {
    const event: SyncEvent = {
      type,
      data,
      timestamp: Date.now()
    };

    console.log(`🎯 Événement SSE traité (réactif):`, event);

    switch (type) {
      case 'data-changed':
        this.lastSyncTime = new Date();
        
        // Traiter les données reçues
        if (data && data.type && data.data) {
          this.processSyncData(data.type, data.data);
        }
        break;
      
      case 'force-sync':
        this.lastSyncTime = new Date();
        this.syncCurrentMonthData();
        break;
    }

    this.notifySyncListeners(event);
  }

  // Traiter les données de synchronisation
  private processSyncData(dataType: string, receivedData: any) {
    console.log(`📊 Traitement des données ${dataType} (réactif):`, receivedData);
    
    let syncData: Partial<SyncData> = {};

    switch (dataType) {
      case 'products':
        syncData = { products: receivedData };
        break;
      
      case 'sales':
        // Les données de ventes sont déjà filtrées par le serveur pour le mois en cours
        syncData = { sales: receivedData };
        console.log(`✅ Ventes du mois en cours synchronisées: ${receivedData.length} ventes`);
        break;
      
      case 'pretfamilles':
        syncData = { pretFamilles: receivedData };
        break;
      
      case 'pretproduits':
        syncData = { pretProduits: receivedData };
        break;
        
      case 'depensedumois':
        syncData = { depenses: receivedData };
        break;
    }

    if (Object.keys(syncData).length > 0) {
      console.log(`✅ Données ${dataType} synchronisées instantanément:`, syncData);
      this.notifyListeners(syncData);
    }
  }

  // Synchroniser les données du mois en cours seulement
  async syncCurrentMonthData(): Promise<SyncData | null> {
    try {
      console.log('🔄 Synchronisation des données du mois en cours...');
      
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();
      
      const [products, sales, pretFamilles, pretProduits, depenses] = await Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get(`/sales/by-month?month=${currentMonth}&year=${currentYear}`).catch(() => ({ data: [] })),
        api.get('/pretfamilles').catch(() => ({ data: [] })),
        api.get('/pretproduits').catch(() => ({ data: [] })),
        api.get('/depenses/mouvements').catch(() => ({ data: [] }))
      ]);

      const syncData: SyncData = {
        products: products.data,
        sales: sales.data, // Ventes du mois en cours seulement
        pretFamilles: pretFamilles.data,
        pretProduits: pretProduits.data,
        depenses: depenses.data
      };

      this.lastSyncTime = new Date();
      this.notifyListeners(syncData);
      
      console.log(`✅ Synchronisation du mois en cours terminée: ${sales.data.length} ventes`);
      return syncData;
    } catch (error) {
      console.error('❌ Erreur de synchronisation:', error);
      return null;
    }
  }

  // Synchroniser toutes les données (fallback)
  async syncAllData(): Promise<SyncData | null> {
    return this.syncCurrentMonthData(); // Rediriger vers la synchronisation du mois en cours
  }

  // Ajouter un listener pour les changements de données
  addDataListener(callback: (data: Partial<SyncData>) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Ajouter un listener pour les événements de sync
  addSyncListener(callback: (event: SyncEvent) => void) {
    this.syncListeners.add(callback);
    return () => this.syncListeners.delete(callback);
  }

  // Notifier tous les listeners de données
  private notifyListeners(data: Partial<SyncData>) {
    console.log(`📣 Notification instantanée à ${this.listeners.size} listeners:`, data);
    this.listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Erreur dans listener de données:', error);
      }
    });
  }

  // Notifier tous les listeners d'événements
  private notifySyncListeners(event: SyncEvent) {
    this.syncListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Erreur dans listener d\'événement:', error);
      }
    });
  }

  // Getters
  getLastSyncTime(): Date {
    return this.lastSyncTime;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // Forcer une synchronisation du mois en cours
  async forceSync(): Promise<void> {
    try {
      console.log('🚀 Force sync du mois en cours demandée');
      await api.post('/sync/force-sync');
    } catch (error) {
      console.error('Erreur force sync:', error);
      // Fallback: sync local du mois en cours
      await this.syncCurrentMonthData();
    }
  }
}

export const realtimeService = new RealtimeService();
