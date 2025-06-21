
import React from 'react';
import DataRetryLoader from '@/components/data-loading/DataRetryLoader';

interface ProprietesChargeurDonneesPage {
  fonctionRecuperation: () => Promise<any>;
  surReussite: (donnees: any) => void;
  surMaxTentativesAtteint?: () => void;
  messageChargement?: string;
  sousmessageChargement?: string;
  messageErreur?: string;
  enfants?: React.ReactNode;
  children?: React.ReactNode;
  
  // Aliases for compatibility
  fetchFunction?: () => Promise<any>;
  onSuccess?: (donnees: any) => void;
  onMaxRetriesReached?: () => void;
  loadingMessage?: string;
  loadingSubmessage?: string;
  errorMessage?: string;
}

const ChargeurDonneesPage: React.FC<ProprietesChargeurDonneesPage> = ({
  fonctionRecuperation,
  surReussite,
  surMaxTentativesAtteint,
  messageChargement = "Chargement de votre boutique...",
  sousmessageChargement = "Préparation de votre expérience shopping premium...",
  messageErreur = "Erreur de chargement des données",
  enfants,
  children,
  
  // Aliases
  fetchFunction,
  onSuccess,
  onMaxRetriesReached,
  loadingMessage,
  loadingSubmessage,
  errorMessage
}) => {
  // Use aliases if provided, otherwise use French props
  const finalFetchFunction = fetchFunction || fonctionRecuperation;
  const finalOnSuccess = onSuccess || surReussite;
  const finalOnMaxRetriesReached = onMaxRetriesReached || surMaxTentativesAtteint;
  const finalLoadingMessage = loadingMessage || messageChargement;
  const finalLoadingSubmessage = loadingSubmessage || sousmessageChargement;
  const finalErrorMessage = errorMessage || messageErreur;
  const content = enfants || children;

  return (
    <DataRetryLoader
      fetchFunction={finalFetchFunction}
      onSuccess={finalOnSuccess}
      onMaxRetriesReached={finalOnMaxRetriesReached}
      maxRetries={3}
      retryInterval={2000}
      errorMessage={finalErrorMessage}
      loadingVariant="boutique"
      loadingMessage={finalLoadingMessage}
      loadingSubmessage={finalLoadingSubmessage}
    >
      {content}
    </DataRetryLoader>
  );
};

export default ChargeurDonneesPage;
