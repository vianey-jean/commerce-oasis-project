/**
 * @fileoverview Composant de traitement des paiements Stripe
 * 
 * Ce composant gère le processus complet de paiement Stripe :
 * - Création du PaymentIntent
 * - Confirmation du paiement
 * - Gestion des erreurs et redirections
 * 
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, CheckCircle, XCircle, Loader2, CreditCard } from 'lucide-react';
import { stripeAPI } from '@/services/stripeAPI';
import { toast } from '@/components/ui/sonner';

/**
 * Props du composant StripePaymentProcessor
 */
interface StripePaymentProcessorProps {
  /** Montant à payer en euros */
  amount: number;
  /** Callback appelé après un paiement réussi */
  onPaymentSuccess: (orderId?: string) => void;
  /** Callback appelé en cas d'erreur */
  onPaymentError?: (error: string) => void;
  /** Données de la commande */
  orderData?: {
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
  };
  /** État d'ouverture de la modale */
  isOpen: boolean;
  /** Callback pour fermer la modale */
  onClose: () => void;
  /** Informations sur la carte utilisée */
  cardInfo?: {
    maskedNumber: string;
    cardName: string;
    cardType: string;
  };
}

/**
 * États possibles du processus de paiement
 */
type PaymentState = 'idle' | 'creating' | 'confirming' | 'success' | 'error';

/**
 * Composant de traitement des paiements Stripe
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant JSX
 */
const StripePaymentProcessor: React.FC<StripePaymentProcessorProps> = ({
  amount,
  onPaymentSuccess,
  onPaymentError,
  orderData,
  isOpen,
  onClose,
  cardInfo
}) => {
  // État du processus de paiement
  const [paymentState, setPaymentState] = useState<PaymentState>('idle');
  // Message d'erreur éventuel
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Réinitialise l'état du composant
   */
  const resetState = () => {
    setPaymentState('idle');
    setErrorMessage('');
  };

  /**
   * Gère la fermeture de la modale
   */
  const handleClose = () => {
    if (paymentState !== 'creating' && paymentState !== 'confirming') {
      resetState();
      onClose();
    }
  };

  /**
   * Traite le paiement complet
   * 
   * 1. Crée un PaymentIntent côté backend
   * 2. Confirme le paiement
   * 3. Finalise la commande si succès
   */
  const processPayment = async () => {
    try {
      // Étape 1: Création du PaymentIntent
      setPaymentState('creating');
      
      const createResponse = await stripeAPI.createPaymentIntent(
        amount,
        'eur',
        {
          userId: orderData?.userId,
          customerEmail: orderData?.shippingAddress?.nom
        }
      );

      if (!createResponse.success || !createResponse.paymentIntentId) {
        throw new Error(createResponse.error || 'Erreur lors de la création du paiement');
      }

      // Étape 2: Simulation de la confirmation du paiement
      // (Dans un vrai environnement, Stripe.js confirmerait avec les données de carte)
      setPaymentState('confirming');

      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Étape 3: Confirmer le paiement et créer la commande
      if (orderData) {
        const confirmResponse = await stripeAPI.confirmPayment(
          createResponse.paymentIntentId,
          orderData
        );

        if (!confirmResponse.success) {
          throw new Error(confirmResponse.error || 'Erreur lors de la confirmation du paiement');
        }

        // Paiement réussi
        setPaymentState('success');
        toast.success('Paiement accepté ! Votre commande a été créée.');
        
        // Attendre un peu pour montrer le succès
        setTimeout(() => {
          onPaymentSuccess(confirmResponse.order?.id);
        }, 1500);
      } else {
        // Paiement simple sans commande
        setPaymentState('success');
        toast.success('Paiement accepté !');
        
        setTimeout(() => {
          onPaymentSuccess();
        }, 1500);
      }

    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      setPaymentState('error');
      const errorMsg = error.message || 'Une erreur est survenue lors du paiement';
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      onPaymentError?.(errorMsg);
    }
  };

  /**
   * Rendu du contenu selon l'état du paiement
   */
  const renderContent = () => {
    switch (paymentState) {
      case 'creating':
      case 'confirming':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">
              {paymentState === 'creating' 
                ? 'Initialisation du paiement...' 
                : 'Traitement en cours...'}
            </p>
            <p className="text-sm text-muted-foreground">
              Veuillez patienter, ne fermez pas cette fenêtre.
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-lg font-medium text-green-600">Paiement réussi !</p>
            <p className="text-sm text-muted-foreground text-center">
              Votre paiement de {amount.toFixed(2)} € a été accepté.
              <br />Vous allez être redirigé...
            </p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <p className="text-lg font-medium text-red-600">Paiement refusé</p>
            <Alert variant="destructive" className="max-w-sm">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
            <Button onClick={resetState} variant="outline">
              Réessayer
            </Button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Récapitulatif du paiement */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Récapitulatif du paiement
              </h4>
              
              {cardInfo && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Carte utilisée:</span>
                  <span className="font-mono">{cardInfo.maskedNumber}</span>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Montant à payer:</span>
                <span className="text-xl font-bold text-primary">{amount.toFixed(2)} €</span>
              </div>
            </div>

            {/* Message de sécurité */}
            <div className="flex items-start space-x-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p>
                Paiement sécurisé par Stripe. Vos informations bancaires sont 
                cryptées et ne sont jamais stockées sur nos serveurs.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Confirmation de paiement
          </DialogTitle>
          <DialogDescription>
            {paymentState === 'idle' && 'Confirmez votre paiement sécurisé'}
          </DialogDescription>
        </DialogHeader>

        {renderContent()}

        {paymentState === 'idle' && (
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleClose}>
              Annuler
            </Button>
            <Button 
              onClick={processPayment}
              className="bg-green-600 hover:bg-green-700"
            >
              <Shield className="h-4 w-4 mr-2" />
              Confirmer le paiement
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentProcessor;
