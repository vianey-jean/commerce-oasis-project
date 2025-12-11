/**
 * @fileoverview Modal de confirmation de paiement
 * 
 * Ce composant affiche une modal pour confirmer ou annuler le paiement
 * avant de procéder à la transaction Stripe.
 * 
 * @version 1.0.0
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Shield, CreditCard, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentConfirmationModalProps {
  /** Si la modal est ouverte */
  isOpen: boolean;
  /** Callback pour fermer la modal */
  onClose: () => void;
  /** Callback pour confirmer le paiement */
  onConfirm: () => void;
  /** Montant total à payer */
  totalAmount: number;
  /** Méthode de paiement sélectionnée */
  paymentMethod: string;
  /** Si le paiement est en cours */
  isProcessing: boolean;
  /** Message d'erreur éventuel */
  errorMessage?: string;
}

/**
 * Formate le montant en euros
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};

/**
 * Retourne le label de la méthode de paiement
 */
const getPaymentMethodLabel = (method: string): string => {
  const labels: Record<string, string> = {
    'card': 'Carte bancaire',
    'paypal': 'PayPal',
    'applepay': 'Apple Pay',
    'cash': 'Paiement à la livraison'
  };
  return labels[method] || method;
};

/**
 * Modal de confirmation de paiement
 */
const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  paymentMethod,
  isProcessing,
  errorMessage
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md border-0 bg-gradient-to-br from-white via-gray-50 to-white dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 shadow-2xl rounded-3xl overflow-hidden">
        {/* Header avec icône */}
        <AlertDialogHeader className="text-center pb-4">
          <motion.div 
            className="mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                {isProcessing ? (
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                ) : errorMessage ? (
                  <XCircle className="h-10 w-10 text-white" />
                ) : (
                  <Shield className="h-10 w-10 text-white" />
                )}
              </div>
              {!isProcessing && !errorMessage && (
                <motion.div 
                  className="absolute -top-1 -right-1 bg-yellow-400 p-2 rounded-full shadow-md"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <CreditCard className="h-4 w-4 text-yellow-800" />
                </motion.div>
              )}
            </div>
          </motion.div>

          <AlertDialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {isProcessing 
              ? "Traitement en cours..." 
              : errorMessage 
                ? "Erreur de paiement" 
                : "Confirmer votre paiement"
            }
          </AlertDialogTitle>

          <AlertDialogDescription asChild>
            <div className="space-y-4 mt-4">
              {errorMessage ? (
                <motion.div 
                  className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl p-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-red-700 dark:text-red-400 text-sm">
                    {errorMessage}
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Vous êtes sur le point de confirmer votre paiement. Cette action est irréversible.
                  </p>

                  {/* Récapitulatif */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl p-5 space-y-3 border border-gray-200 dark:border-neutral-600">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 dark:text-neutral-400">Mode de paiement</span>
                      <span className="font-medium text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        {getPaymentMethodLabel(paymentMethod)}
                      </span>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-neutral-600 to-transparent" />
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-500 dark:text-neutral-400">Montant total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {formatPrice(totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Sécurité */}
                  <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span>Paiement sécurisé par Stripe</span>
                  </div>
                </>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
          {!isProcessing && (
            <>
              <AlertDialogCancel 
                onClick={onClose}
                className="flex-1 border-2 border-gray-200 dark:border-neutral-600 hover:border-gray-300 dark:hover:border-neutral-500 rounded-xl py-3 font-medium transition-all duration-300"
              >
                {errorMessage ? "Fermer" : "Annuler"}
              </AlertDialogCancel>
              
              {!errorMessage && (
                <AlertDialogAction
                  onClick={onConfirm}
                  className="flex-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-xl py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Confirmer le paiement
                </AlertDialogAction>
              )}
            </>
          )}
          
          {isProcessing && (
            <div className="w-full text-center py-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Veuillez patienter, ne fermez pas cette fenêtre...
              </p>
            </div>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PaymentConfirmationModal;
