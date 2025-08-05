
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, User } from '@/services/AuthService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, 'id'>) => Promise<boolean>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  resetPasswordRequest: (email: string) => Promise<boolean>;
  checkEmail: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est déjà connecté au chargement
    const currentUser = AuthService.getCurrentUser();
    console.log('Utilisateur actuel au chargement:', currentUser);
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext: Tentative de connexion pour:', email);
    setIsLoading(true);
    try {
      const success = await AuthService.login(email, password);
      console.log('AuthContext: Résultat de la connexion:', success);
      
      if (success) {
        const currentUser = AuthService.getCurrentUser();
        console.log('AuthContext: Utilisateur récupéré après connexion:', currentUser);
        setUser(currentUser);
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('AuthContext: Erreur lors de la connexion:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await AuthService.register(userData);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('AuthContext: Erreur lors de l\'inscription:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext: Déconnexion');
    AuthService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await AuthService.resetPassword(email, newPassword);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('AuthContext: Erreur lors de la réinitialisation:', error);
      setIsLoading(false);
      return false;
    }
  };

  const resetPasswordRequest = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simuler une requête de réinitialisation
      const result = await AuthService.checkEmail(email);
      setIsLoading(false);
      return result;
    } catch (error) {
      console.error('AuthContext: Erreur lors de la demande de réinitialisation:', error);
      setIsLoading(false);
      return false;
    }
  };

  const checkEmail = async (email: string): Promise<boolean> => {
    try {
      return await AuthService.checkEmail(email);
    } catch (error) {
      console.error('AuthContext: Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    token: user ? 'mock-token' : null,
    login,
    register,
    logout,
    resetPassword,
    resetPasswordRequest,
    checkEmail
  };

  console.log('AuthContext: État actuel de l\'utilisateur:', user);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
