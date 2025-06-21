
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { VideoCallProvider } from '@/contexts/VideoCallContext';
import { Toaster } from '@/components/ui/sonner';
import { Toaster as OldToaster } from '@/components/ui/toaster';
import CookieManager from '@/components/prompts/CookieManager';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
      retryDelay: 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <BrowserRouter>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <StoreProvider>
                <VideoCallProvider>
                  {children}
                  <CookieManager position="fixed" />
                  <Toaster />
                  <OldToaster />
                </VideoCallProvider>
              </StoreProvider>
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default AppProviders;
