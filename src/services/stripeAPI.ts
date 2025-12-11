/**
 * @fileoverview Service API pour les paiements Stripe
 * 
 * Ce module gère les appels API vers le backend pour les paiements Stripe :
 * - Création de PaymentIntent
 * - Vérification du statut
 * - Confirmation de paiement
 * 
 * @version 1.0.0
 */

import { API } from './apiConfig';

/**
 * Interface pour les métadonnées de commande
 */
interface OrderMetadata {
  userId?: string;
  orderId?: string;
  customerEmail?: string;
  [key: string]: string | undefined;
}

/**
 * Interface pour les données de commande
 */
interface OrderData {
  userId: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }>;
  shippingAddress: {
    nom: string;
    prenom: string;
    adresse: string;
    ville: string;
    codePostal: string;
    pays: string;
    telephone: string;
  };
  subtotal: number;
  taxAmount: number;
  deliveryPrice: number;
  total: number;
  codePromo?: {
    code: string;
    productId: string;
    pourcentage: number;
  } | null;
}

/**
 * Réponse de création de PaymentIntent
 */
interface CreatePaymentIntentResponse {
  success: boolean;
  clientSecret?: string;
  paymentIntentId?: string;
  error?: string;
}

/**
 * Réponse de vérification de statut
 */
interface PaymentStatusResponse {
  success: boolean;
  status?: string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, string>;
  error?: string;
}

/**
 * Réponse de confirmation de paiement
 */
interface ConfirmPaymentResponse {
  success: boolean;
  order?: any;
  message?: string;
  error?: string;
  status?: string;
}

/**
 * API pour les paiements Stripe
 */
export const stripeAPI = {
  /**
   * Crée un PaymentIntent pour un paiement
   * 
   * @param amount - Montant en euros
   * @param currency - Devise (default: 'eur')
   * @param metadata - Métadonnées optionnelles
   * @returns Promise avec le clientSecret et paymentIntentId
   */
  createPaymentIntent: async (
    amount: number,
    currency: string = 'eur',
    metadata?: OrderMetadata
  ): Promise<CreatePaymentIntentResponse> => {
    try {
      const response = await API.post('/stripe/create-payment-intent', {
        amount,
        currency,
        metadata
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur création PaymentIntent:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la création du paiement'
      };
    }
  },

  /**
   * Vérifie le statut d'un PaymentIntent
   * 
   * @param paymentIntentId - ID du PaymentIntent
   * @returns Promise avec le statut du paiement
   */
  getPaymentStatus: async (paymentIntentId: string): Promise<PaymentStatusResponse> => {
    try {
      const response = await API.get(`/stripe/payment-status/${paymentIntentId}`);
      return response.data;
    } catch (error: any) {
      console.error('Erreur récupération statut:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la vérification du statut'
      };
    }
  },

  /**
   * Confirme un paiement et finalise la commande
   * 
   * @param paymentIntentId - ID du PaymentIntent
   * @param orderData - Données de la commande
   * @returns Promise avec la confirmation
   */
  confirmPayment: async (
    paymentIntentId: string,
    orderData: OrderData
  ): Promise<ConfirmPaymentResponse> => {
    try {
      const response = await API.post('/stripe/confirm-payment', {
        paymentIntentId,
        orderData
      });
      return response.data;
    } catch (error: any) {
      console.error('Erreur confirmation paiement:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de la confirmation du paiement'
      };
    }
  }
};

export default stripeAPI;
