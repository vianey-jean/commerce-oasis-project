
import React, { useState, useEffect } from 'react';
import { ClientService } from '@/services/ClientService';
import { Users } from 'lucide-react';

interface ClientStatsDisplayProps {
  refreshTrigger?: number;
}

const ClientStatsDisplay: React.FC<ClientStatsDisplayProps> = ({ refreshTrigger = 0 }) => {
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const clients = await ClientService.getAllClients();
      setTotalClients(clients.length);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-gray-300 to-gray-400 p-4 rounded-xl animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl premium-shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold font-medium opacity-90 mb-1">
              Nombre total de clients
            </p>
            <p className="text-2xl font-bold">
              {totalClients}
            </p>
          </div>
          <Users className="w-8 h-8 opacity-80" />
        </div>
      </div>
    </div>
  );
};

export default ClientStatsDisplay;
