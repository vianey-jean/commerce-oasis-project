
import { apiClient } from './core/apiClient';

export interface SavedCard {
  id: string;
  userId: string;
  lastFourDigits: string;
  cardType: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isDefault: boolean;
  createdAt: string;
}

export const savedCardsAPI = {
  getUserCards: () => apiClient.get<SavedCard[]>('/saved-cards'),
  
  saveCard: (cardData: {
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
    saveCard: boolean;
    setAsDefault: boolean;
  }) => apiClient.post<SavedCard>('/saved-cards', cardData),
  
  deleteCard: (cardId: string) => apiClient.delete(`/saved-cards/${cardId}`),
  
  setDefaultCard: (cardId: string) => apiClient.put(`/saved-cards/${cardId}/default`),
  
  processPaymentWithSavedCard: (cardId: string, paymentData: any) => 
    apiClient.post('/payments/process-saved-card', { cardId, ...paymentData }),
  
  processPaymentWithNewCard: (cardData: any, paymentData: any) => 
    apiClient.post('/payments/process-new-card', { cardData, ...paymentData }),
  
  validate3DS: (paymentIntentId: string, confirmationData: any) =>
    apiClient.post('/payments/confirm-3ds', { paymentIntentId, confirmationData })
};
