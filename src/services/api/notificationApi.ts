/**
 * Service API pour les notifications
 */
import api from './api';

export interface AppNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error' | 'rdv' | 'stock' | 'paiement';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

const notificationApi = {
  getAll: () => api.get<AppNotification[]>('/api/notifications'),
  getUnread: () => api.get<AppNotification[]>('/api/notifications?unread=true'),
  getByType: (type: string) => api.get<AppNotification[]>(`/api/notifications?type=${type}`),
  create: (data: Partial<AppNotification>) => api.post<AppNotification>('/api/notifications', data),
  markAsRead: (id: string) => api.put<AppNotification>(`/api/notifications/${id}/read`, {}),
  markAllAsRead: () => api.put('/api/notifications/read-all', {}),
  delete: (id: string) => api.delete(`/api/notifications/${id}`),
  deleteAll: () => api.delete('/api/notifications'),
};

export default notificationApi;
