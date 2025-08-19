import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { ConfirmationCodeModal } from '@/components/auth/ConfirmationCodeModal';
import { useConfirmationCheck } from '@/hooks/useConfirmationCheck';
import axios from 'axios';
import { Lock, Unlock, Users, Shield, Key } from 'lucide-react';

interface LockedAccount {
  userId: string;
  failedAttempts: number;
  isLocked: boolean;
  lockedAt: string;
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface ConfirmationCode {
  id: string;
  userId: string;
  code: string;
  createdAt: string;
  expiresAt: string;
  isUsed: boolean;
  userInfo: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

const AdminPage: React.FC = () => {
  const [lockedAccounts, setLockedAccounts] = useState<LockedAccount[]>([]);
  const [confirmationCodes, setConfirmationCodes] = useState<ConfirmationCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const {
    showConfirmationModal,
    checkConfirmationAndExecute,
    handleConfirmationSuccess,
    handleConfirmationClose
  } = useConfirmationCheck();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';
      
      const [lockedResponse, codesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/confirmation/locked-accounts`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_BASE_URL}/api/confirmation/all-codes`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setLockedAccounts(lockedResponse.data);
      setConfirmationCodes(codesResponse.data);
    } catch (error: any) {
      if (error.response?.status === 403) {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administrateur",
          variant: "destructive",
        });
      } else if (error.response?.data?.requiresConfirmation) {
        checkConfirmationAndExecute(() => fetchData());
        return;
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les données",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const unlockAccount = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://server-gestion-ventes.onrender.com';
      
      const response = await axios.post(
        `${API_BASE_URL}/api/confirmation/unlock/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast({
          title: "Compte déverrouillé",
          description: "Le compte a été déverrouillé avec succès",
          className: "bg-green-500 text-white",
        });
        
        // Recharger les données
        fetchData();
      }
    } catch (error: any) {
      if (error.response?.data?.requiresConfirmation) {
        checkConfirmationAndExecute(() => unlockAccount(userId));
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de déverrouiller le compte",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    checkConfirmationAndExecute(() => fetchData());
  }, []);

  const handleConfirmationSuccessWrapper = () => {
    handleConfirmationSuccess();
    fetchData();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8" />
            Administration Sécurité
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion des comptes verrouillés et des codes de confirmation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Comptes verrouillés */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Comptes Verrouillés ({lockedAccounts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lockedAccounts.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  Aucun compte verrouillé
                </p>
              ) : (
                <div className="space-y-4">
                  {lockedAccounts.map((account) => (
                    <div
                      key={account.userId}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {account.userInfo?.firstName} {account.userInfo?.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {account.userInfo?.email}
                        </p>
                        <p className="text-xs text-red-600">
                          {account.failedAttempts} tentatives échouées
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Verrouillé le: {new Date(account.lockedAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => unlockAccount(account.userId)}
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Unlock className="w-4 h-4" />
                        Déverrouiller
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Codes de confirmation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Codes de Confirmation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {confirmationCodes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Aucun code généré
                  </p>
                ) : (
                  confirmationCodes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 20) // Afficher seulement les 20 derniers
                    .map((codeData) => (
                      <div
                        key={codeData.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">
                            {codeData.userInfo?.firstName} {codeData.userInfo?.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {codeData.userInfo?.email}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={codeData.isUsed ? "secondary" : "default"}
                              className="text-xs"
                            >
                              Code: {codeData.code}
                            </Badge>
                            <Badge
                              variant={codeData.isUsed ? "secondary" : "destructive"}
                              className="text-xs"
                            >
                              {codeData.isUsed ? "Utilisé" : "Non utilisé"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Créé: {new Date(codeData.createdAt).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Expire: {new Date(codeData.expiresAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <ConfirmationCodeModal
          isOpen={showConfirmationModal}
          onClose={handleConfirmationClose}
          onSuccess={handleConfirmationSuccessWrapper}
        />
      </div>
    </Layout>
  );
};

export default AdminPage;