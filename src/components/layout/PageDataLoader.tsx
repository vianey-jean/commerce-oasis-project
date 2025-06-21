
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
}

const ChargeurDonneesPage: React.FC<ProprietesChargeurDonneesPage> = ({
  fonctionRecuperation,
  surReussite,
  surMaxTentativesAtteint,
  messageChargement = "Chargement de votre boutique...",
  sousmessageChargement = "Préparation de votre expérience shopping premium...",
  messageErreur = "Erreur de chargement des données",
  enfants
}) => {
  return (
    <DataRetryLoader
      fetchFunction={fonctionRecuperation}
      onSuccess={surReussite}
      onMaxRetriesReached={surMaxTentativesAtteint}
      maxRetries={3} // Réduit de 6 à 3 pour des chargements plus rapides
      retryInterval={2000} // Réduit de 5s à 2s
      errorMessage={messageErreur}
      loadingVariant="boutique"
      loadingMessage={messageChargement}
      loadingSubmessage={sousmessageChargement}
    >
      {enfants}
    </DataRetryLoader>
  );
};

export default ChargeurDonneesPage;
