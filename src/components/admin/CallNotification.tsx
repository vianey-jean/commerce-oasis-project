
import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, PhoneOff } from 'lucide-react';
import { useVideoCall } from '@/contexts/VideoCallContext';

interface CallNotificationProps {
  callerName: string;
  onAccept: () => void;
  onDecline: () => void;
}

const CallNotification: React.FC<CallNotificationProps> = ({
  callerName,
  onAccept,
  onDecline,
}) => {
  const [open, setOpen] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isCallActive } = useVideoCall();

  useEffect(() => {
    // Création d'un élément audio pour la sonnerie
    const audio = new Audio('/ringtone.mp3');
    audioRef.current = audio;
    audio.loop = true;
    
    // Gestion des erreurs de lecture audio
    const handleError = (e: Event) => {
      console.log("Ringtone error: ", e);
      // Ne pas afficher de toast ici car ce n'est pas critique pour l'utilisateur
    };
    
    audio.addEventListener('error', handleError);
    
    // Tentative de lecture avec gestion des promesses
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // La lecture a démarré avec succès
        })
        .catch(error => {
          // La lecture a échoué, probablement à cause des autorisations du navigateur
          console.log("Ringtone autoplay failed:", error);
        });
    }
    
    return () => {
      // Nettoyage
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    // Arrêter la sonnerie si l'appel est actif ou si le dialog est fermé
    if (!open || isCallActive) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [open, isCallActive]);

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setOpen(false);
    onAccept();
  };

  const handleDecline = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setOpen(false);
    onDecline();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Appel entrant</DialogTitle>
          <DialogDescription className="text-center">
            {callerName} vous appelle
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center py-6">
          <div className="animate-pulse bg-blue-100 dark:bg-blue-900 rounded-full p-4">
            <Phone className="h-16 w-16 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <DialogFooter className="flex justify-between space-x-4">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDecline}
            className="flex-1"
          >
            <PhoneOff className="mr-2 h-4 w-4" />
            Refuser
          </Button>
          <Button
            type="button"
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={handleAccept}
          >
            <Phone className="mr-2 h-4 w-4" />
            Accepter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallNotification;
