import api from './api';

export interface Avance {
  id: string;
  travailleurId: string;
  travailleurNom: string;
  entrepriseId: string;
  entrepriseNom: string;
  montant: number;
  date: string;
  createdAt: string;
}

const avanceApi = {
  getAll: () => api.get<Avance[]>('/api/avances'),
  getByMonth: (year: number, month: number) => api.get<Avance[]>(`/api/avances?year=${year}&month=${month}`),
  getByTravailleur: (travailleurId: string, year: number, month: number) => 
    api.get<Avance[]>(`/api/avances?travailleurId=${travailleurId}&year=${year}&month=${month}`),
  create: (data: Partial<Avance>) => api.post<Avance>('/api/avances', data),
  delete: (id: string) => api.delete(`/api/avances/${id}`),
};

export default avanceApi;
