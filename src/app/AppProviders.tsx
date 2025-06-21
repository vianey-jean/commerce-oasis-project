
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { FournisseurMagasin } from '@/contexts/StoreContext';
import { Toaster } from '@/components/ui/sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000,
      gcTime: 5 * 60 * 1000,
    },
  },
});

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FournisseurMagasin>
          {children}
          <Toaster closeButton richColors position="top-center" />
        </FournisseurMagasin>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
