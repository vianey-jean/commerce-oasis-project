
import React, { useState } from 'react';
import ClientManager from '@/components/ClientManager';
import ClientStatsDisplay from '@/components/ClientStatsDisplay';

const ClientsPage: React.FC = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleClientUpdate = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-[80px]">
      {/* Background premium - plus clair */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Statistiques des clients */}
        {/* <ClientStatsDisplay refreshTrigger={refreshTrigger} /> */}
        
        <ClientManager onClientUpdate={handleClientUpdate} />
      </div>
    </div>
  );
};

export default ClientsPage;
