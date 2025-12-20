// Types pour les Ressources Humaines

export interface Employe {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  dateEmbauche: string;
  poste: string;
  departement: string;
  salaireBrut: number;
  typeContrat: 'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Freelance';
  statut: 'Actif' | 'Inactif' | 'Congé' | 'Maladie';
  adresse?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conge {
  id: string;
  employeId: string;
  employeNom: string;
  type: 'Annuel' | 'Maladie' | 'Maternité' | 'Paternité' | 'Sans solde' | 'Exceptionnel';
  dateDebut: string;
  dateFin: string;
  joursOuvrables: number;
  motif?: string;
  statut: 'En attente' | 'Approuvé' | 'Refusé' | 'Annulé';
  validePar?: string;
  dateValidation?: string;
  createdAt: string;
}

export interface FichePaie {
  id: string;
  employeId: string;
  employeNom: string;
  mois: number;
  annee: number;
  salaireBrut: number;
  cotisationsSalariales: number;
  cotisationsPatronales: number;
  salaireNet: number;
  primes: number;
  deductions: number;
  heuresSupplementaires: number;
  tauxHoraireSup: number;
  statut: 'Brouillon' | 'Validé' | 'Payé';
  datePaiement?: string;
  createdAt: string;
}

export interface Evaluation {
  id: string;
  employeId: string;
  employeNom: string;
  evaluateurId: string;
  evaluateurNom: string;
  dateEvaluation: string;
  periode: string;
  noteGlobale: number; // 1-5
  performances: {
    critere: string;
    note: number;
    commentaire: string;
  }[];
  objectifsAtteints: string[];
  objectifsFuturs: string[];
  pointsForts: string[];
  pointsAmeliorer: string[];
  commentaireGeneral?: string;
  statut: 'En cours' | 'Terminé' | 'Validé';
  createdAt: string;
}

export interface EmployeFormData {
  matricule: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  dateEmbauche: string;
  poste: string;
  departement: string;
  salaireBrut: number;
  typeContrat: Employe['typeContrat'];
  adresse?: string;
}

export interface CongeFormData {
  employeId: string;
  type: Conge['type'];
  dateDebut: string;
  dateFin: string;
  motif?: string;
}
