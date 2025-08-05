
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Clock, MapPin, CalendarIcon, Reply, Sparkles, Star, User, Phone, Cake, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

type AppointmentDetailsProps = {
  appointment: Appointment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
};

const AppointmentDetails = ({
  appointment,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: AppointmentDetailsProps) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    if (confirmDelete) {
      setIsDeleting(true);
      try {
        const success = await AppointmentService.delete(appointment.id);
        if (success) {
          toast.success("Rendez-vous supprimé avec succès");
          onDelete();
          onOpenChange(false);
        } else {
          toast.error("Erreur lors de la suppression du rendez-vous");
          setConfirmDelete(false);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error("Une erreur est survenue");
      } finally {
        setIsDeleting(false);
      }
    } else {
      setConfirmDelete(true);
    }
  };
  
  // Formatter la date et l'heure pour l'affichage
  const formattedDate = format(
    parseISO(appointment.date),
    'EEEE d MMMM yyyy',
    { locale: fr }
  );
  
  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) setConfirmDelete(false);
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-md backdrop-blur-xl bg-white/95 border-0 shadow-2xl overflow-hidden ">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/30 to-transparent"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 overflow-y-auto max-h-[90vh] pr-1">
          <DialogHeader className="pb-6 border-b border-gray-200/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {appointment.titre}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={appointment.statut === 'validé' ? 'default' : 'destructive'}>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {appointment.statut || 'validé'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-violet-500" />
            </div>
            <DialogDescription className="text-gray-600">
              Détails complets du rendez-vous
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-5">
            {(appointment.nom || appointment.prenom) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Nom et Prénom</p>
                    <p className="text-green-700 font-medium">{appointment.prenom} {appointment.nom}</p>
                  </div>
                </div>
              </div>
            )}

            {appointment.dateNaissance && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cake className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Date de naissance</p>
                    <p className="text-pink-700 font-medium">{appointment.dateNaissance}</p>
                  </div>
                </div>
              </div>
            )}

            {appointment.telephone && (
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 mb-1">Téléphone</p>
                    <p className="text-indigo-700 font-medium">{appointment.telephone}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CalendarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Date & Heure</p>
                  <p className="text-violet-700 font-medium">{formattedDate}</p>
                  <p className="text-sm text-gray-600 mt-1">à {appointment.heure}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Durée</p>
                  <p className="text-blue-700 font-medium">{appointment.duree} minutes</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">Lieu</p>
                  <p className="text-emerald-700 font-medium">{appointment.location}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200/50">
              <p className="font-semibold text-gray-800 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{appointment.description}</p>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200/50">
            {confirmDelete ? (
              <div className="w-full space-y-4">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-700 font-medium text-center">
                    <Trash2 className="w-4 h-4" />
                    <span>Confirmer la suppression définitive ?</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={isDeleting}
                  >
                    <Reply className="mr-2 h-4 w-4" />
                    Annuler
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Suppression...
                      </div>
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Confirmer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1 border-2 border-violet-200 hover:border-violet-300 bg-violet-50/50 hover:bg-violet-100/50 text-violet-700 backdrop-blur-sm transition-all duration-300"
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
                <Button 
                  variant="destructive" 
                  className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
