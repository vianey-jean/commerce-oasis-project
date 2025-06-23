// Configuration de base de l'API
import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

// Configuration d'Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No authentication token found');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Service d'authentification
export const authService = {
  async login(credentials: { email: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  },

  async register(userData: any) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  getCurrentUser() {
    const token = localStorage.getItem('authToken');
    return token ? { token } : null;
  },

  setCurrentUser(user: any) {
    if (user && user.token) {
      localStorage.setItem('authToken', user.token);
    } else {
      localStorage.removeItem('authToken');
    }
  },

  async checkEmail(email: string) {
    try {
      const response = await api.post('/auth/check-email', { email });
      return response.data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  },

  async resetPasswordRequest(data: { email: string }) {
    try {
      const response = await api.post('/auth/reset-password-request', data);
      return response.data.exists;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return false;
    }
  },

  async resetPassword(data: { email: string; newPassword: string; confirmPassword: string }) {
    try {
      const response = await api.post('/auth/reset-password', data);
      return response.data.success;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  }
};

// Service produits
export const productService = {
  async getProducts() {
    try {
      const response = await api.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  },

  async addProduct(product: any) {
    const response = await api.post('/products', product);
    return response.data;
  },

  async updateProduct(product: any) {
    const response = await api.put(`/products/${product.id}`, product);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  async searchProducts(query: string) {
    try {
      const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }
};

// Service ventes
export const salesService = {
  async getSales(month?: number, year?: number) {
    try {
      let url = '/sales';
      if (month && year) {
        url += `?month=${month}&year=${year}`;
      }
      console.log(`Fetching sales for month=${month} year=${year}`);
      
      const response = await api.get(url);
      console.log(`Fetched ${response.data?.length || 0} sales for ${month}/${year}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching sales:', error);
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  },

  async addSale(sale: any) {
    const response = await api.post('/sales', sale);
    return response.data;
  },

  async updateSale(sale: any) {
    const response = await api.put(`/sales/${sale.id}`, sale);
    return response.data;
  },

  async deleteSale(id: string) {
    const response = await api.delete(`/sales/${id}`);
    return response.data;
  }
};

// Service prêts famille
export const pretFamilleService = {
  async getPretFamilles() {
    try {
      const response = await api.get('/pret-familles');
      return response.data;
    } catch (error) {
      console.error('Error fetching pret familles:', error);
      return [];
    }
  },

  async addPretFamille(pret: any) {
    const response = await api.post('/pret-familles', pret);
    return response.data;
  },

  async updatePretFamille(id: string, pret: any) {
    const response = await api.put(`/pret-familles/${id}`, pret);
    return response.data;
  },

  async searchByName(name: string) {
    try {
      const response = await api.get(`/pret-familles/search?name=${encodeURIComponent(name)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching pret familles:', error);
      return [];
    }
  }
};

// Service prêts produit
export const pretProduitService = {
  async getPretProduits() {
    try {
      const response = await api.get('/pret-produits');
      return response.data;
    } catch (error) {
      console.error('Error fetching pret produits:', error);
      return [];
    }
  },

  async addPretProduit(pret: any) {
    const response = await api.post('/pret-produits', pret);
    return response.data;
  },

  async updatePretProduit(id: string, pret: any) {
    const response = await api.put(`/pret-produits/${id}`, pret);
    return response.data;
  },

  async deletePretProduit(id: string) {
    const response = await api.delete(`/pret-produits/${id}`);
    return response.data;
  }
};

// Service dépenses
export const depenseService = {
  async getMouvements() {
    try {
      const response = await api.get('/mouvements');
      return response.data;
    } catch (error) {
      console.error('Error fetching mouvements:', error);
      return [];
    }
  },

  async addMouvement(mouvement: any) {
    const response = await api.post('/mouvements', mouvement);
    return response.data;
  },

  async updateMouvement(id: string, mouvement: any) {
    const response = await api.put(`/mouvements/${id}`, mouvement);
    return response.data;
  },

  async deleteMouvement(id: string) {
    const response = await api.delete(`/mouvements/${id}`);
    return response.data;
  },

  async getDepensesFixe() {
    try {
      const response = await api.get('/depenses-fixe');
      return response.data;
    } catch (error) {
      console.error('Error fetching depenses fixe:', error);
      return {
        free: 0,
        internetZeop: 0,
        assuranceVoiture: 0,
        autreDepense: 0,
        assuranceVie: 0,
        total: 0
      };
    }
  },

  async updateDepensesFixe(depenses: any) {
    const response = await api.put('/depenses-fixe', depenses);
    return response.data;
  },

  async resetMouvements() {
    const response = await api.post('/mouvements/reset');
    return response.data;
  }
};

export default api;
