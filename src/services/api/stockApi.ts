/**
 * Service API pour les mouvements de stock
 */
import api from './api';

export interface StockMovement {
  id: string;
  productId: string;
  type: 'entree' | 'sortie';
  quantity: number;
  raison: string;
  createdAt: string;
}

export interface LowStockProduct {
  id: string;
  description: string;
  quantity: number;
  purchasePrice: number;
}

const stockApi = {
  getAll: () => api.get<StockMovement[]>('/api/stocks'),
  getByProduct: (productId: string) => api.get<StockMovement[]>(`/api/stocks?productId=${productId}`),
  getLowStock: (threshold?: number) => api.get<LowStockProduct[]>(`/api/stocks/alerts/low${threshold ? `?threshold=${threshold}` : ''}`),
  create: (data: Omit<StockMovement, 'id' | 'createdAt'>) => api.post<StockMovement>('/api/stocks', data),
  delete: (id: string) => api.delete(`/api/stocks/${id}`),
};

export default stockApi;
