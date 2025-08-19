import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';

interface ConfirmationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConfirmationCodeModal: React.FC<ConfirmationCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [code, setCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  // Générer un code automatiquement à l'ouverture
  useEffect(() => {
    if (isOpen && !generatedCode && !isLocked) {
      generateCode();
    }
  }, [isOpen]);

  const generateCode = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';
      
      const response = await axios.post(
        `${API_BASE_URL}/api/confirmation/generate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setGeneratedCode(response.data.code);
        toast({
          title: "Code généré",
          description: `Votre code de confirmation: ${response.data.code}`,
          className: "bg-blue-500 text-white",
        });
      }
    } catch (error: any) {
      if (error.response?.status === 423) {
        setIsLocked(true);
        toast({
          title: "Compte verrouillé",
          description: "Votre compte est verrouillé. Contactez un administrateur.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de générer le code de confirmation",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir le code de confirmation",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';
      
      const response = await axios.post(
        `${API_BASE_URL}/api/confirmation/verify`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        // Marquer la session comme confirmée
        sessionStorage.setItem('confirmationValidated', 'true');
        
        toast({
          title: "Code vérifié",
          description: "Accès autorisé",
          className: "bg-green-500 text-white",
        });
        
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      if (error.response?.status === 423) {
        setIsLocked(true);
        toast({
          title: "Compte verrouillé",
          description: "Trop de tentatives échouées. Votre compte est verrouillé.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Code invalide",
          description: "Le code saisi est incorrect ou expiré",
          variant: "destructive",
        });
      }
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCode('');
    setGeneratedCode('');
    setIsLocked(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {isLocked ? 'Compte Verrouillé' : 'Code de Confirmation Requis'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLocked ? (
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Votre compte est verrouillé suite à trop de tentatives échouées.
              </p>
              <p className="text-sm text-muted-foreground">
                Veuillez contacter un administrateur pour déverrouiller votre compte.
              </p>
              <Button onClick={handleClose} className="mt-4">
                Fermer
              </Button>
            </div>
          ) : (
            <>
              {generatedCode && (
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Votre code de confirmation:
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {generatedCode}
                  </p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium">
                  Saisissez le code de confirmation:
                </label>
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Entrez le code à 6 chiffres"
                  maxLength={6}
                  className="mt-1"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={verifyCode}
                  disabled={isLoading || !code.trim()}
                  className="flex-1"
                >
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={generateCode}
                  disabled={isLoading}
                >
                  Nouveau Code
                </Button>
              </div>
              
              <Button variant="ghost" onClick={handleClose} className="w-full">
                Annuler
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};