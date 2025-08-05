
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContactMessage } from '@/services/MessageService';
import { Trash2, AlertTriangle, X } from 'lucide-react';

interface ConfirmDeleteMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: ContactMessage;
  isDeleting?: boolean;
}

const ConfirmDeleteMessageModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  message, 
  isDeleting = false 
}: ConfirmDeleteMessageModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border-0 shadow-2xl overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50"></div>
        
        <div className="relative z-10 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-white" />
            </div>
            
            <DialogTitle className="text-2xl font-bold text-red-800 mb-4">
              Confirmer la suppression
            </DialogTitle>
            
            <div className="bg-white/80 rounded-2xl p-4 mb-6 border border-red-200">
              <p className="font-bold text-gray-800 mb-2">{message.sujet}</p>
              <p className="text-gray-600 mb-1">De: {message.nom} ({message.email})</p>
              <p className="text-gray-600 text-sm line-clamp-2">{message.message}</p>
            </div>
            
            <p className="text-red-700 font-medium mb-8">
              Êtes-vous sûr de vouloir supprimer ce message ?<br />
              <span className="text-red-600 text-sm">Cette action est irréversible.</span>
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-2xl transition-all duration-200"
              >
                Annuler
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 premium-shadow-lg font-semibold rounded-2xl transition-all duration-200 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteMessageModal;
