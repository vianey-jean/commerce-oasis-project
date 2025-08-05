
export interface ContactMessage {
  id: string;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  dateEnvoi: string;
  lu: boolean;
}

const BASE_URL = (import.meta as any).env.VITE_API_BASE_URL;

export class MessageService {
  static async getAllMessages(): Promise<ContactMessage[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/messages`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des messages');
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur MessageService.getAllMessages:', error);
      return [];
    }
  }

  static async markAsRead(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${messageId}/mark-read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur MessageService.markAsRead:', error);
      return false;
    }
  }

  static async markAsUnread(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${messageId}/mark-unread`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur MessageService.markAsUnread:', error);
      return false;
    }
  }

  static async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur MessageService.deleteMessage:', error);
      return false;
    }
  }
}
