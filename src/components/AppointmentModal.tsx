
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/AppointmentService';
import { AppointmentService } from '@/services/AppointmentService';
import { toast } from 'sonner';

/**
 * Type de props pour le composant AppointmentModal
 */
type AppointmentModalProps = {
  isOpen: boolean; // État d'ouverture de la modal
  onClose: () => void; // Fonction pour fermer la modal
  title: string; // Titre de la modal
  mode: 'add' | 'edit' | 'select' | 'delete' | 'search'; // Mode de la modal
  appointment?: Appointment; // Rendez-vous sélectionné (optionnel)
  onSuccess: () => void; // Fonction appelée après une action réussie
  onSelect?: (appointment: Appointment) => void; // Fonction appelée lors de la sélection d'un rendez-vous
  children?: React.ReactNode; // Éléments enfants (contenu personnalisé)
};

/**
 * Composant réutilisable pour les modals liées aux rendez-vous
 * Prend en charge différents modes: ajout, modification, suppression, recherche
 */
const AppointmentModal = ({
  isOpen,
  onClose,
  title,
  mode,
  appointment,
  onSuccess,
  onSelect,
  children
}: AppointmentModalProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Gère la suppression d'un rendez-vous après confirmation
   */
  const handleDelete = async () => {
    if (!appointment) return;
    
    setIsProcessing(true);
    try {
      const success = await AppointmentService.delete(appointment.id);
      if (success) {
        toast.success("Rendez-vous supprimé avec succès");
        onSuccess();
        onClose();
      } else {
        toast.error("Erreur lors de la suppression du rendez-vous");
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Réinitialise l'état de la modal lors de sa fermeture
   */
  const handleCloseModal = () => {
    setConfirmDelete(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogTitle>{title}</DialogTitle>
        
        {mode === 'delete' && confirmDelete ? (
          <div className="space-y-4">
            <div className="text-red-500 text-sm font-medium">
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setConfirmDelete(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleDelete}
                disabled={isProcessing}
              >
                {isProcessing ? "Suppression..." : "Confirmer"}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {children}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
