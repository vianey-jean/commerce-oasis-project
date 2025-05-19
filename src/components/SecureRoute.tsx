
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRealRoute, isValidSecureId } from '@/services/secureIds';
import NotFound from '@/pages/NotFound';
import { toast } from '@/components/ui/sonner';

interface SecureRouteProps {
  children: React.ReactNode;
}

const SecureRoute: React.FC<SecureRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.substring(1); // Enlever le / initial
  
  useEffect(() => {
    // Vérifier si c'est une route sécurisée connue
    const realPath = getRealRoute(path);
    
    if (!realPath && !isValidSecureId(path)) {
      toast.error("Ce lien n'est plus valide");
      navigate('/not-found', { replace: true });
    }
  }, [path, navigate]);

  // Si la route est sécurisée, afficher le contenu enfant
  return <>{children}</>;
};

export default SecureRoute;
