/**
 * @fileoverview Formulaire de paiement avec modal de confirmation
 * 
 * Ce composant gère la sélection de la méthode de paiement et affiche
 * une modal de confirmation avant de procéder au paiement.
 * 
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import PaymentMethods from '@/components/checkout/PaymentMethods';
import PaymentConfirmationModal from '@/components/checkout/PaymentConfirmationModal';

interface PaymentFormProps {
  /** Méthode de paiement sélectionnée */
  paymentMethod: string;
  /** Si le paiement est en cours de traitement */
  loading: boolean;
  /** Montant total à payer */
  totalAmount?: number;
  /** Callback pour changer la méthode de paiement */
  onMethodChange: (method: string) => void;
  /** Callback pour soumettre le formulaire */
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => void;
  /** Callback pour retourner à l'étape de livraison */
  onBackToShipping: () => void;
}

/**
 * Formulaire de paiement avec modal de confirmation
 */
const PaymentForm: React.FC<PaymentFormProps> = ({
  paymentMethod,
  loading,
  totalAmount = 0,
  onMethodChange,
  onSubmit,
  onBackToShipping
}) => {
  // État pour la modal de confirmation
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  /**
   * Gère le clic sur le bouton de confirmation
   */
  const handleConfirmClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      return;
    }
    
    // Ouvrir la modal de confirmation
    setShowConfirmModal(true);
    setErrorMessage(undefined);
  };

  /**
   * Gère la confirmation du paiement depuis la modal
   */
  const handlePaymentConfirm = () => {
    setIsProcessing(true);
    setErrorMessage(undefined);
    
    // Créer un événement de formulaire synthétique
    const syntheticEvent = {
      preventDefault: () => {},
      stopPropagation: () => {},
      currentTarget: document.createElement('form'),
      target: document.createElement('form'),
      nativeEvent: new Event('submit'),
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      eventPhase: 0,
      isTrusted: true,
      timeStamp: Date.now(),
      type: 'submit',
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      persist: () => {}
    } as React.SyntheticEvent<HTMLFormElement>;
    
    // Appeler onSubmit avec l'événement
    onSubmit(syntheticEvent);
    
    // La modal sera fermée par le parent quand loading change
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmModal(false);
    }, 500);
  };

  /**
   * Ferme la modal de confirmation
   */
  const handleCloseModal = () => {
    if (!isProcessing) {
      setShowConfirmModal(false);
      setErrorMessage(undefined);
    }
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <motion.div 
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Méthode de paiement
              </h2>
              <p className="text-gray-600 mt-1">Choisissez votre mode de paiement sécurisé</p>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <PaymentMethods 
              selectedMethod={paymentMethod}
              onMethodChange={onMethodChange}
            />
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col sm:flex-row justify-between gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button 
            type="button" 
            variant="outline"
            onClick={onBackToShipping}
            className="flex items-center px-8 py-4 h-14 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300 hover:scale-105"
          >
            Retour aux informations
          </Button>
          <Button 
            type="button"
            onClick={handleConfirmClick}
            className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 hover:from-green-600 hover:via-emerald-600 hover:to-blue-600 text-white px-10 py-4 h-14 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !paymentMethod}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Traitement en cours...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                Confirmer la commande
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Modal de confirmation de paiement */}
      <PaymentConfirmationModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handlePaymentConfirm}
        totalAmount={totalAmount}
        paymentMethod={paymentMethod}
        isProcessing={isProcessing || loading}
        errorMessage={errorMessage}
      />
    </>
  );
};

export default PaymentForm;