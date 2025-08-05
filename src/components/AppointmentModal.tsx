
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/AppointmentService';
import { AppointmentService } from '@/services/AppointmentService';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, X, Sparkles, Crown, Star, Diamond } from 'lucide-react';

/**
 * Type de props pour le composant AppointmentModal
 */
type AppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode: 'add' | 'edit' | 'select' | 'delete' | 'search';
  appointment?: Appointment;
  onSuccess: () => void;
  onSelect?: (appointment: Appointment) => void;
  children?: React.ReactNode;
};

/**
 * Composant réutilisable pour les modals liées aux rendez-vous avec design moderne
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
      <DialogContent className="text-black sm:max-w-[700px] bg-white border-0 shadow-lg overflow-hidden rounded-3xl">
        {/* Background light decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/30 to-purple-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-100/20 to-blue-100/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Close button */}
          {/* <button
            onClick={handleCloseModal}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
        
          </button> */}

          {/* Header premium */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-200">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center relative overflow-hidden ${
              mode === 'delete' 
                ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                : 'premium-gradient'
            }`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="relative z-10">
                {mode === 'delete' ? (
                  <Trash2 className="w-7 h-7 text-white" />
                ) : (
                  <Crown className="w-7 h-7 text-white" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <DialogTitle className={`text-2xl font-bold mb-2 ${
                mode === 'delete' 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent' 
                  : 'luxury-text-gradient'
              }`}>
                {title}
              </DialogTitle>
              <div className="flex items-center gap-2 text-gray-600">
                <p className="text-base">
                  {mode === 'add' && 'Créez un nouveau rendez-vous premium'}
                  {mode === 'edit' && 'Modifiez les détails avec élégance'}
                  {mode === 'delete' && 'Action irréversible - Attention requise'}
                  {mode === 'search' && 'Trouvez vos rendez-vous rapidement'}
                  {mode === 'select' && 'Sélectionnez avec style'}
                </p>
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-yellow-400" />
              <Diamond className="w-4 h-4 text-primary" />
            </div>
          </div>

          {/* Content */}
          {mode === 'delete' && confirmDelete ? (
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl p-6 premium-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-red-800 mb-2 text-lg">
                      Confirmer la suppression
                    </p>
                    <p className="text-red-600 font-medium">
                      Cette action est définitive et ne peut pas être annulée.
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-red-400" />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmDelete(false)}
                  disabled={isProcessing}
                  className="text-black px-8 py-3 border-2 border-gray-300 bg-white text-black hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-2xl premium-hover"
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 premium-shadow-lg font-semibold rounded-2xl premium-hover"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Suppression...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Trash2 className="w-4 h-4" />
                      Confirmer la suppression
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="relative">
              {children}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentModal;
