
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/services/AppointmentService';
import { AppointmentService } from '@/services/AppointmentService';
import { toast } from 'sonner';
import { Trash2, AlertTriangle, X, Sparkles } from 'lucide-react';

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
      <DialogContent className="sm:max-w-[600px] backdrop-blur-xl bg-white/95 border-0 shadow-2xl overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          {/* Header moderne */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200/50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              mode === 'delete' 
                ? 'bg-gradient-to-br from-red-500 to-pink-600' 
                : 'bg-gradient-to-br from-violet-500 to-purple-600'
            }`}>
              {mode === 'delete' ? (
                <Trash2 className="w-5 h-5 text-white" />
              ) : (
                <Sparkles className="w-5 h-5 text-white" />
              )}
            </div>
            <div className="flex-1">
              <DialogTitle className={`text-xl font-bold ${
                mode === 'delete' 
                  ? 'bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent'
              }`}>
                {title}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'add' && 'Créez un nouveau rendez-vous'}
                {mode === 'edit' && 'Modifiez les détails du rendez-vous'}
                {mode === 'delete' && 'Action irréversible'}
                {mode === 'search' && 'Trouvez vos rendez-vous'}
                {mode === 'select' && 'Choisissez un rendez-vous'}
              </p>
            </div>
          
          </div>

          {/* Content */}
          {mode === 'delete' && confirmDelete ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 mb-1">
                      Confirmer la suppression
                    </p>
                    <p className="text-sm text-red-600">
                      Cette action est définitive et ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmDelete(false)}
                  disabled={isProcessing}
                  className="px-6 border-2 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                >
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  disabled={isProcessing}
                  className="px-6 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Suppression...
                    </div>
                  ) : (
                    'Confirmer la suppression'
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
