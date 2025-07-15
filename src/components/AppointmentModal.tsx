
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
      <DialogContent className="sm:max-w-[700px] calendar-luxury border-0 premium-shadow-xl overflow-hidden rounded-3xl">
        {/* Background luxury decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-primary/5 to-purple-500/10"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-400/10 to-primary/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Header premium */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-primary/20">
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
              <div className="flex items-center gap-2 text-muted-foreground">
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
                  className="px-8 py-3 border-2 border-primary/30 luxury-card hover:border-primary/50 font-semibold rounded-2xl premium-hover"
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
