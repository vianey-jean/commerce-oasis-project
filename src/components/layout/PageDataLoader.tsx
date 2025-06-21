
import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProprietesChargeurDonneesPage {
  // French props (original)
  fonctionRecuperation?: () => Promise<any>;
  surReussite?: (data?: any) => void;
  surEchecMaximum?: () => void;
  messageChargement?: string;
  sousmessageChargement?: string;
  messageErreur?: string;
  
  // English props (for compatibility)
  fetchFunction?: () => Promise<any>;
  onSuccess?: (data?: any) => void;
  onMaxRetriesReached?: () => void;
  loadingMessage?: string;
  loadingSubmessage?: string;
  errorMessage?: string;
  
  enfants?: React.ReactNode;
  children?: React.ReactNode;
  essaisMaximaux?: number;
  delaiEntreEssais?: number;
}

const PageDataLoader: React.FC<ProprietesChargeurDonneesPage> = ({
  // French props
  fonctionRecuperation,
  surReussite,
  surEchecMaximum,
  messageChargement = "Chargement...",
  sousmessageChargement,
  messageErreur = "Erreur de chargement",
  
  // English props (for compatibility)
  fetchFunction,
  onSuccess,
  onMaxRetriesReached,
  loadingMessage,
  loadingSubmessage,
  errorMessage,
  
  enfants,
  children,
  essaisMaximaux = 3,
  delaiEntreEssais = 2000
}) => {
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [essaiActuel, setEssaiActuel] = useState(0);
  const [donnees, setDonnees] = useState<any>(null);

  // Use English or French props (English takes precedence for compatibility)
  const fetchFn = fetchFunction || fonctionRecuperation;
  const onSuccessFn = onSuccess || surReussite;
  const onMaxRetriesFn = onMaxRetriesReached || surEchecMaximum;
  const loadingMsg = loadingMessage || messageChargement;
  const loadingSubMsg = loadingSubmessage || sousmessageChargement;
  const errorMsg = errorMessage || messageErreur;
  const content = children || enfants;

  const chargerDonnees = async (essai = 0) => {
    if (!fetchFn) {
      setChargement(false);
      return;
    }

    try {
      setChargement(true);
      setErreur(null);
      
      const result = await fetchFn();
      setDonnees(result);
      
      if (onSuccessFn) {
        onSuccessFn(result);
      }
      
      setChargement(false);
    } catch (error) {
      console.error(`Erreur lors du chargement (essai ${essai + 1}):`, error);
      
      if (essai < essaisMaximaux - 1) {
        setEssaiActuel(essai + 1);
        setTimeout(() => {
          chargerDonnees(essai + 1);
        }, delaiEntreEssais);
      } else {
        setErreur(errorMsg);
        setChargement(false);
        
        if (onMaxRetriesFn) {
          onMaxRetriesFn();
        }
      }
    }
  };

  useEffect(() => {
    chargerDonnees();
  }, []);

  const reessayer = () => {
    setEssaiActuel(0);
    chargerDonnees();
  };

  if (chargement) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        </div>
        
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {loadingMsg}
          </h3>
          {loadingSubMsg && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {loadingSubMsg}
            </p>
          )}
          
          {essaiActuel > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Tentative {essaiActuel + 1} sur {essaisMaximaux}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-red-50 dark:bg-red-950/20 rounded-full p-4 mb-6">
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        
        <div className="text-center max-w-md">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {errorMsg}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Nous n'avons pas pu charger les données après {essaisMaximaux} tentatives.
          </p>
          
          <Button onClick={reessayer} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Réessayer</span>
          </Button>
        </div>
      </div>
    );
  }

  return <>{content}</>;
};

export default PageDataLoader;
