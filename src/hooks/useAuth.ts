
/**
 * Hook personnalisé pour la gestion de l'authentification
 * Centralise la logique d'état d'authentification
 */

import { useState, useCallback } from 'react';
import { AuthService, User } from '../services/AuthService';

/**
 * Interface pour le hook d'authentification
 */
interface UseAuthReturn {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly login: (email: string, password: string) => Promise<boolean>;
  readonly register: (userData: Omit<User, 'id'>) => Promise<boolean>;
  readonly logout: () => void;
  readonly resetPassword: (email: string, newPassword: string) => Promise<boolean>;
}

/**
 * Hook pour gérer l'état d'authentification
 * @returns Objet avec utilisateur et méthodes d'authentification
 */
export const useAuth = (): UseAuthReturn => {
  // État local pour l'utilisateur connecté
  const [user, setUser] = useState<User | null>(() => AuthService.getCurrentUser());

  /**
   * Fonction de connexion avec mise à jour de l'état local
   */
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const success = await AuthService.login(email, password);
    if (success) {
      setUser(AuthService.getCurrentUser());
    }
    return success;
  }, []);

  /**
   * Fonction d'inscription
   */
  const register = useCallback(async (userData: Omit<User, 'id'>): Promise<boolean> => {
    return await AuthService.register(userData);
  }, []);

  /**
   * Fonction de déconnexion avec mise à jour de l'état local
   */
  const logout = useCallback((): void => {
    AuthService.logout();
    setUser(null);
  }, []);

  /**
   * Fonction de réinitialisation de mot de passe
   */
  const resetPassword = useCallback(async (email: string, newPassword: string): Promise<boolean> => {
    return await AuthService.resetPassword(email, newPassword);
  }, []);

  return {
    user,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    resetPassword
  };
};
