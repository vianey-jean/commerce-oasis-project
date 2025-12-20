// Types pour la Gestion avancée

export interface RendezVous {
  id: string;
  titre: string;
  description?: string;
  clientId?: string;
  clientNom?: string;
  dateDebut: string;
  dateFin: string;
  lieu?: string;
  type: 'Réunion' | 'Appel' | 'Visite' | 'Démonstration' | 'Autre';
  statut: 'Planifié' | 'En cours' | 'Terminé' | 'Annulé' | 'Reporté';
  priorite: 'Basse' | 'Normale' | 'Haute' | 'Urgente';
  rappel?: string;
  notes?: string;
  couleur?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Projet {
  id: string;
  nom: string;
  description?: string;
  clientId?: string;
  clientNom?: string;
  dateDebut: string;
  dateFin?: string;
  dateFinPrevue: string;
  budget: number;
  depenses: number;
  statut: 'En attente' | 'En cours' | 'En pause' | 'Terminé' | 'Annulé';
  priorite: 'Basse' | 'Normale' | 'Haute' | 'Critique';
  progression: number; // 0-100
  responsableId?: string;
  responsableNom?: string;
  taches: Tache[];
  createdAt: string;
  updatedAt: string;
}

export interface Tache {
  id: string;
  projetId: string;
  titre: string;
  description?: string;
  assigneA?: string;
  dateDebut: string;
  dateFin: string;
  statut: 'À faire' | 'En cours' | 'En révision' | 'Terminé';
  priorite: 'Basse' | 'Normale' | 'Haute';
  progression: number;
  ordre: number;
}

export interface OpportuniteCRM {
  id: string;
  nom: string;
  clientId?: string;
  clientNom: string;
  contactEmail?: string;
  contactTelephone?: string;
  valeurEstimee: number;
  probabilite: number; // 0-100
  etape: 'Prospection' | 'Qualification' | 'Proposition' | 'Négociation' | 'Clôturé Gagné' | 'Clôturé Perdu';
  source: 'Site web' | 'Référence' | 'Appel entrant' | 'Salon' | 'Publicité' | 'Autre';
  datePrevueCloture: string;
  dateCreation: string;
  dateModification: string;
  notes?: string;
  historiqueActions: ActionCRM[];
}

export interface ActionCRM {
  id: string;
  type: 'Appel' | 'Email' | 'Réunion' | 'Note' | 'Tâche';
  date: string;
  description: string;
  resultat?: string;
}

export interface KPI {
  id: string;
  nom: string;
  valeurActuelle: number;
  objectif: number;
  unite: string;
  tendance: 'hausse' | 'baisse' | 'stable';
  pourcentageAtteinte: number;
  periode: string;
  categorie: 'Ventes' | 'Finance' | 'Clients' | 'RH' | 'Opérations';
}

export interface Notification {
  id: string;
  titre: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  categorie: 'Système' | 'Vente' | 'Stock' | 'Finance' | 'RH' | 'Client' | 'Projet';
  lue: boolean;
  actionUrl?: string;
  dateCreation: string;
  dateExpiration?: string;
}

export interface RendezVousFormData {
  titre: string;
  description?: string;
  clientId?: string;
  dateDebut: string;
  dateFin: string;
  lieu?: string;
  type: RendezVous['type'];
  priorite: RendezVous['priorite'];
  rappel?: string;
  notes?: string;
  couleur?: string;
}

export interface ProjetFormData {
  nom: string;
  description?: string;
  clientId?: string;
  dateDebut: string;
  dateFinPrevue: string;
  budget: number;
  priorite: Projet['priorite'];
  responsableId?: string;
}

export interface OpportuniteFormData {
  nom: string;
  clientNom: string;
  contactEmail?: string;
  contactTelephone?: string;
  valeurEstimee: number;
  probabilite: number;
  etape: OpportuniteCRM['etape'];
  source: OpportuniteCRM['source'];
  datePrevueCloture: string;
  notes?: string;
}
