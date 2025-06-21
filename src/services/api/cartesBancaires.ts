
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export interface CarteBancaireEnregistree {
  id: string;
  dernierChiffres: string;
  typeCarte: string;
  nomTitulaire: string;
  dateExpiration: string;
  donneesChiffrees: string;
  estPrincipale: boolean;
}

export interface CarteBancaireSauvegardee extends CarteBancaireEnregistree {}

export const cartesBancairesAPI = {
  obtenirCartesSauvegardees: (): Promise<AxiosResponse<CarteBancaireSauvegardee[]>> => {
    return axios.get(`${API_BASE_URL}/api/cartes-bancaires`);
  },

  // Alias pour compatibilité
  obtenirCartes: (userId: string): Promise<AxiosResponse<CarteBancaireEnregistree[]>> => {
    return axios.get(`${API_BASE_URL}/api/cartes-bancaires?userId=${userId}`);
  },

  sauvegarderCarte: (donneesCarte: {
    donneesChiffrees: string;
    dernierChiffres: string;
    typeCarte: string;
    nomTitulaire: string;
    dateExpiration: string;
    estPrincipale: boolean;
  }): Promise<AxiosResponse<CarteBancaireSauvegardee>> => {
    return axios.post(`${API_BASE_URL}/api/cartes-bancaires`, donneesCarte);
  },

  // Alias pour compatibilité
  enregistrerCarte: (userId: string, donneesCarte: any): Promise<AxiosResponse<CarteBancaireEnregistree>> => {
    return axios.post(`${API_BASE_URL}/api/cartes-bancaires`, { ...donneesCarte, userId });
  },

  supprimerCarte: (idCarte: string): Promise<AxiosResponse<void>> => {
    return axios.delete(`${API_BASE_URL}/api/cartes-bancaires/${idCarte}`);
  },

  validerPaiement3DS: (donneesValidation: {
    montant: number;
    carteBancaire: any;
    commande: string;
  }): Promise<AxiosResponse<{ succes: boolean; transactionId: string }>> => {
    return axios.post(`${API_BASE_URL}/api/paiements/3ds`, donneesValidation);
  }
};
