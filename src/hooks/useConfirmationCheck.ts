import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useConfirmationCheck = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { toast } = useToast();

  const checkConfirmationAndExecute = useCallback((action: () => void) => {
    // Vérifier si la confirmation est déjà validée pour cette session
    const isConfirmed = sessionStorage.getItem('confirmationValidated') === 'true';
    
    if (isConfirmed) {
      // Exécuter l'action directement
      action();
    } else {
      // Demander la confirmation
      setPendingAction(() => action);
      setShowConfirmationModal(true);
    }
  }, []);

  const handleConfirmationSuccess = useCallback(() => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setShowConfirmationModal(false);
  }, [pendingAction]);

  const handleConfirmationClose = useCallback(() => {
    setPendingAction(null);
    setShowConfirmationModal(false);
  }, []);

  return {
    showConfirmationModal,
    checkConfirmationAndExecute,
    handleConfirmationSuccess,
    handleConfirmationClose
  };
};