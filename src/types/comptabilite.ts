// Types pour la Comptabilité

export interface EcritureComptable {
  id: string;
  dateEcriture: string;
  numeroCompte: string;
  libelleCompte: string;
  libelle: string;
  debit: number;
  credit: number;
  pieceJustificative?: string;
  reference?: string;
  createdAt: string;
}

export interface CompteComptable {
  numero: string;
  libelle: string;
  type: 'Actif' | 'Passif' | 'Charges' | 'Produits' | 'Capitaux';
  soldeDebiteur: number;
  soldeCrediteur: number;
}

export interface BilanFinancier {
  dateGeneration: string;
  periode: string;
  actifs: {
    immobilisations: number;
    stocks: number;
    creances: number;
    tresorerie: number;
    totalActifs: number;
  };
  passifs: {
    capitauxPropres: number;
    emprunts: number;
    dettesFournisseurs: number;
    autresDettes: number;
    totalPassifs: number;
  };
}

export interface CompteResultat {
  dateGeneration: string;
  periode: string;
  produits: {
    ventesMarchandises: number;
    prestationsServices: number;
    autresProduits: number;
    totalProduits: number;
  };
  charges: {
    achats: number;
    chargesPersonnel: number;
    chargesExternes: number;
    amortissements: number;
    autresCharges: number;
    impots: number;
    totalCharges: number;
  };
  resultatNet: number;
}

export interface Facture {
  id: string;
  numero: string;
  type: 'Client' | 'Fournisseur';
  clientId?: string;
  clientNom: string;
  clientAdresse?: string;
  dateEmission: string;
  dateEcheance: string;
  lignes: LigneFacture[];
  sousTotal: number;
  tva: number;
  tauxTva: number;
  totalTTC: number;
  statut: 'Brouillon' | 'Envoyée' | 'Payée' | 'En retard' | 'Annulée';
  dateReglement?: string;
  modeReglement?: string;
  notes?: string;
  createdAt: string;
}

export interface LigneFacture {
  id: string;
  description: string;
  quantite: number;
  prixUnitaire: number;
  tauxTva: number;
  montantHT: number;
  montantTVA: number;
  montantTTC: number;
}

export interface RapportFiscal {
  id: string;
  periode: string;
  type: 'TVA' | 'IS' | 'Annuel';
  dateGeneration: string;
  totalVentes: number;
  totalAchats: number;
  tvaCollectee: number;
  tvaDeductible: number;
  tvaNette: number;
  baseImposable: number;
  impotEstime: number;
  statut: 'Brouillon' | 'Validé' | 'Déclaré';
}

export interface FactureFormData {
  type: 'Client' | 'Fournisseur';
  clientId?: string;
  clientNom: string;
  clientAdresse?: string;
  dateEmission: string;
  dateEcheance: string;
  tauxTva: number;
  notes?: string;
  lignes: Omit<LigneFacture, 'id' | 'montantHT' | 'montantTVA' | 'montantTTC'>[];
}
