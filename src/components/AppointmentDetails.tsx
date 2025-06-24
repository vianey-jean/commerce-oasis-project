
import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Edit, Trash2, Clock, MapPin, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {Reply } from 'lucide-react';

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{appointment.titre}</DialogTitle>
          <DialogDescription>
            Détails du rendez-vous
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Date</p>
              <p className="text-gray-600">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Heure et durée</p>
              <p className="text-gray-600">
                {appointment.heure} ({appointment.duree} minutes)
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Lieu</p>
              <p className="text-gray-600">{appointment.location}</p>
            </div>
          </div>
          
          <div className="pt-2">
            <p className="font-medium">Description</p>
            <p className="text-gray-600 mt-1">{appointment.description}</p>
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between">
          {confirmDelete ? (
            <>
              <div className="text-red-500 text-sm font-medium mb-2 sm:mb-0">
                Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setConfirmDelete(false)}
                  disabled={isDeleting}
                >
                  <Reply className="mr-1 h-4 w-4" />
                  Annuler
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Suppression..." : "Confirmer"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button variant="outline" className="sm:mr-auto" onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button variant="destructive" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDetails;
