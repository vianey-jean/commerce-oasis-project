/**
 * @fileoverview Sélecteur de méthode de paiement avec intégration Stripe
 * 
 * Ce composant permet à l'utilisateur de :
 * - Choisir une carte bancaire enregistrée
 * - Ajouter une nouvelle carte
 * - Confirmer et traiter le paiement via Stripe
 * 
 * @version 2.0.0
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Plus, Shield } from 'lucide-react';
import SavedCardsList from './SavedCardsList';
import CreditCardForm from './CreditCardForm';
import StripePaymentProcessor from './StripePaymentProcessor';
import { cardsAPI, type SavedCard } from '@/services/cards';
import { toast } from '@/components/ui/sonner';

/**
 * Props du composant PaymentMethodSelector
 */
interface PaymentMethodSelectorProps {
  /** Callback appelé après un paiement réussi */
  onPaymentSuccess: () => void;
  /** Montant total à payer en euros */
  totalAmount?: number;
  /** Données de commande pour Stripe */
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
}

/**
 * Composant de sélection de méthode de paiement
 * 
 * Gère l'affichage des cartes enregistrées, l'ajout de nouvelles cartes
 * et le traitement des paiements via Stripe.
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant JSX
 */
const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({ 
  onPaymentSuccess,
  totalAmount = 0,
  orderData
}) => {
  // ID de la carte sélectionnée
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  // Onglet actif (cartes sauvegardées ou nouvelle carte)
  const [activeTab, setActiveTab] = useState('saved');
  // Indique si l'utilisateur a des cartes sauvegardées
  const [hasSavedCards, setHasSavedCards] = useState(false);
  // Liste des cartes de l'utilisateur
  const [cards, setCards] = useState<SavedCard[]>([]);
  // État d'ouverture de la modale de paiement Stripe
  const [showStripeModal, setShowStripeModal] = useState(false);
  // Informations sur la carte sélectionnée pour l'affichage
  const [selectedCardInfo, setSelectedCardInfo] = useState<{
    maskedNumber: string;
    cardName: string;
    cardType: string;
  } | undefined>();

  /**
   * Charge les cartes de l'utilisateur au montage du composant
   */
  useEffect(() => {
    checkSavedCards();
  }, []);

  /**
   * Vérifie et charge les cartes sauvegardées de l'utilisateur
   */
  const checkSavedCards = async () => {
    try {
      const userCards = await cardsAPI.getUserCards();
      setCards(userCards);
      setHasSavedCards(userCards.length > 0);
      
      // Sélectionner automatiquement la carte par défaut
      const defaultCard = userCards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
        setSelectedCardInfo({
          maskedNumber: defaultCard.maskedNumber,
          cardName: defaultCard.cardName,
          cardType: defaultCard.cardType
        });
      }
      
      // Si pas de cartes sauvegardées, aller directement à l'onglet nouvelle carte
      if (userCards.length === 0) {
        setActiveTab('new');
      }
    } catch (error) {
      console.error('Erreur lors de la vérification des cartes:', error);
    }
  };

  /**
   * Gère la sélection d'une carte
   * 
   * @param cardId - L'ID de la carte sélectionnée
   */
  const handleCardSelect = (cardId: string) => {
    setSelectedCardId(cardId);
    
    // Mettre à jour les infos de la carte sélectionnée
    const card = cards.find(c => c.id === cardId);
    if (card) {
      setSelectedCardInfo({
        maskedNumber: card.maskedNumber,
        cardName: card.cardName,
        cardType: card.cardType
      });
    }
  };

  /**
   * Lance le processus de paiement avec une carte sauvegardée
   */
  const handlePayWithSavedCard = async () => {
    if (!selectedCardId) {
      toast.error('Veuillez sélectionner une carte');
      return;
    }

    // Ouvrir la modale de confirmation Stripe
    setShowStripeModal(true);
  };

  /**
   * Callback appelé après un paiement Stripe réussi
   * 
   * @param orderId - L'ID de la commande créée (optionnel)
   */
  const handleStripePaymentSuccess = (orderId?: string) => {
    setShowStripeModal(false);
    onPaymentSuccess();
  };

  /**
   * Callback appelé en cas d'erreur de paiement Stripe
   * 
   * @param error - Le message d'erreur
   */
  const handleStripePaymentError = (error: string) => {
    console.error('Erreur Stripe:', error);
    // La modale reste ouverte pour permettre de réessayer
  };

  /**
   * Gère le succès de l'ajout d'une nouvelle carte
   * Ouvre automatiquement la modale de paiement
   */
  const handleNewCardSuccess = () => {
    checkSavedCards();
    // Ouvrir directement la modale de paiement après ajout de carte
    setShowStripeModal(true);
  };

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Méthode de paiement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Onglets de sélection */}
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="saved" disabled={!hasSavedCards}>
                Cartes enregistrées
              </TabsTrigger>
              <TabsTrigger value="new">
                <Plus className="h-4 w-4 mr-1" />
                Nouvelle carte
              </TabsTrigger>
            </TabsList>
            
            {/* Contenu: Cartes sauvegardées */}
            <TabsContent value="saved" className="space-y-4">
              <SavedCardsList 
                onCardSelect={handleCardSelect}
                selectedCardId={selectedCardId}
              />
              
              {/* Affichage du montant */}
              {totalAmount > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Montant à payer:</span>
                  <span className="text-lg font-bold text-primary">{totalAmount.toFixed(2)} €</span>
                </div>
              )}
              
              <Button 
                onClick={handlePayWithSavedCard}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!selectedCardId}
              >
                <Shield className="h-4 w-4 mr-2" />
                Payer avec cette carte
              </Button>
            </TabsContent>
            
            {/* Contenu: Nouvelle carte */}
            <TabsContent value="new">
              {/* Affichage du montant */}
              {totalAmount > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">Montant à payer:</span>
                  <span className="text-lg font-bold text-primary">{totalAmount.toFixed(2)} €</span>
                </div>
              )}
              
              <CreditCardForm 
                onSuccess={handleNewCardSuccess}
                totalAmount={totalAmount}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modale de traitement du paiement Stripe */}
      <StripePaymentProcessor
        isOpen={showStripeModal}
        onClose={() => setShowStripeModal(false)}
        amount={totalAmount}
        orderData={orderData}
        onPaymentSuccess={handleStripePaymentSuccess}
        onPaymentError={handleStripePaymentError}
        cardInfo={selectedCardInfo}
      />
    </>
  );
};

export default PaymentMethodSelector;
