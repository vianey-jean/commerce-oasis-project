
import { clientApi } from '../core/apiClient';

export interface CarteBancaireSauvegardee {
  id: string;
  utilisateurId: string;
  numeroMasque: string;
  nomTitulaire: string;
  dateExpiration: string;
  typeCarte: string;
  estPrincipale: boolean;
  dateCreation: string;
}

export const cartesBancairesAPI = {
  /**
   * Récupère les cartes sauvegardées de l'utilisateur
   */
  obtenirCartesSauvegardees: () => 
    clientApi.get<CarteBancaireSauvegardee[]>('/cartes-bancaires/utilisateur'),

  /**
   * Sauvegarde une nouvelle carte
   */
  sauvegarderCarte: (donneesCarte: {
    donneesChiffrees: string;
    numeroMasque: string;
    nomTitulaire: string;
    dateExpiration: string;
    typeCarte: string;
    estPrincipale: boolean;
  }) => 
    clientApi.post<CarteBancaireSauvegardee>('/cartes-bancaires', donneesCarte),

  /**
   * Supprime une carte sauvegardée
   */
  supprimerCarte: (idCarte: string) => 
    clientApi.delete(`/cartes-bancaires/${idCarte}`),

  /**
   * Valide le paiement avec 3DS
   */
  validerPaiement3DS: (donneesValidation: {
    idCarte?: string;
    donneesNouvelleCarte?: any;
    montant: number;
    monnaie: string;
    idCommande: string;
  }) => 
    clientApi.post('/paiements/validation-3ds', donneesValidation),

  /**
   * Confirme le paiement après validation 3DS
   */
  confirmerPaiement: (idTransaction: string, codeValidation: string) => 
    clientApi.post('/paiements/confirmer', { idTransaction, codeValidation })
};
