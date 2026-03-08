/**
 * Service API pour les factures et devis
 */
import api from './api';

export interface FactureLigne {
  description: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Facture {
  id: string;
  numero: string;
  type: 'facture' | 'devis';
  clientNom: string;
  clientAdresse: string;
  clientPhone: string;
  clientEmail: string;
  date: string;
  dateEcheance: string;
  lignes: FactureLigne[];
  sousTotal: number;
  tva: number;
  tvaMontant: number;
  totalTTC: number;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'annulee';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

const factureApi = {
  getAll: () => api.get<Facture[]>('/api/factures'),
  getByType: (type: string) => api.get<Facture[]>(`/api/factures?type=${type}`),
  getByMonth: (year: number, month: number) => api.get<Facture[]>(`/api/factures?year=${year}&month=${month}`),
  getById: (id: string) => api.get<Facture>(`/api/factures/${id}`),
  getNextNumber: (type: string) => api.get<{ numero: string }>(`/api/factures/next-number/${type}`),
  create: (data: Partial<Facture>) => api.post<Facture>('/api/factures', data),
  update: (id: string, data: Partial<Facture>) => api.put<Facture>(`/api/factures/${id}`, data),
  delete: (id: string) => api.delete(`/api/factures/${id}`),
};

export default factureApi;
