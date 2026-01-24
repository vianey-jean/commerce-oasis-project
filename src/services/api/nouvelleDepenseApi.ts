// Service API pour les nouvelles dépenses
import api from './api';
import { DepenseFormData } from '@/types/comptabilite';
import { AxiosResponse } from 'axios';

export interface NouvelleDepense {
  id: string;
  date: string;
  description: string;
  montant: number;
  type: 'taxes' | 'carburant' | 'autre_depense';
  categorie: string;
}

export interface DepenseStats {
  total: number;
  count: number;
  byType: Record<string, { total: number; count: number }>;
  byCategorie: Record<string, { total: number; count: number }>;
}

export interface DepenseYearlyStats extends DepenseStats {
  byMonth: Record<number, { total: number; count: number }>;
}

export const nouvelleDepenseApiService = {
  // Récupérer toutes les dépenses
  async getAll(): Promise<NouvelleDepense[]> {
    console.log('📦 Fetching all depenses from API...');
    const response: AxiosResponse<NouvelleDepense[]> = await api.get('/api/nouvelle-depense');
    console.log(`✅ Retrieved ${response.data.length} depenses from API`);
    return response.data;
  },

  // Récupérer les dépenses par mois et année
  async getByMonthYear(year: number, month: number): Promise<NouvelleDepense[]> {
    console.log(`📦 Fetching depenses for ${month}/${year}...`);
    const response: AxiosResponse<NouvelleDepense[]> = await api.get(`/api/nouvelle-depense/monthly/${year}/${month}`);
    console.log(`✅ Retrieved ${response.data.length} depenses for ${month}/${year}`);
    return response.data;
  },

  // Récupérer les dépenses par année
  async getByYear(year: number): Promise<NouvelleDepense[]> {
    console.log(`📦 Fetching depenses for year ${year}...`);
    const response: AxiosResponse<NouvelleDepense[]> = await api.get(`/api/nouvelle-depense/yearly/${year}`);
    console.log(`✅ Retrieved ${response.data.length} depenses for year ${year}`);
    return response.data;
  },

  // Récupérer les statistiques mensuelles
  async getMonthlyStats(year: number, month: number): Promise<DepenseStats> {
    console.log(`📊 Fetching monthly depense stats for ${month}/${year}...`);
    const response: AxiosResponse<DepenseStats> = await api.get(`/api/nouvelle-depense/stats/monthly/${year}/${month}`);
    return response.data;
  },

  // Récupérer les statistiques annuelles
  async getYearlyStats(year: number): Promise<DepenseYearlyStats> {
    console.log(`📊 Fetching yearly depense stats for ${year}...`);
    const response: AxiosResponse<DepenseYearlyStats> = await api.get(`/api/nouvelle-depense/stats/yearly/${year}`);
    return response.data;
  },

  // Récupérer une dépense par ID
  async getById(id: string): Promise<NouvelleDepense> {
    const response: AxiosResponse<NouvelleDepense> = await api.get(`/api/nouvelle-depense/${id}`);
    return response.data;
  },

  // Créer une nouvelle dépense
  async create(data: DepenseFormData): Promise<NouvelleDepense> {
    console.log('📝 Creating new depense:', data);
    const response: AxiosResponse<NouvelleDepense> = await api.post('/api/nouvelle-depense', data);
    console.log('✅ Depense created successfully:', response.data);
    return response.data;
  },

  // Mettre à jour une dépense
  async update(id: string, data: Partial<DepenseFormData>): Promise<NouvelleDepense> {
    console.log('📝 Updating depense:', data);
    const response: AxiosResponse<NouvelleDepense> = await api.put(`/api/nouvelle-depense/${id}`, data);
    console.log('✅ Depense updated successfully:', response.data);
    return response.data;
  },

  // Supprimer une dépense
  async delete(id: string): Promise<boolean> {
    console.log('🗑️ Deleting depense with ID:', id);
    await api.delete(`/api/nouvelle-depense/${id}`);
    console.log('✅ Depense deleted successfully');
    return true;
  },
};

export default nouvelleDepenseApiService;
