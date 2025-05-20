
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Pencil, Trash, Search, CheckCircle, XCircle } from 'lucide-react';
import { authAPI } from '@/services/api';

interface User {
  id: string;
  nom: string;
  prenom?: string;
  email: string;
  role: string;
  dateCreation: string;
}

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await authAPI.getAllUsers(token);
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => 
          user.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        await authAPI.deleteUser(userId, token);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Gestion des Utilisateurs</h1>
        
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un utilisateur..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Date d'inscription</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    Aucun utilisateur trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={`${user.id}_${index}`}>
                    <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                    <TableCell>{user.nom} {user.prenom || ''}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <XCircle className="mr-1 h-3 w-3" />
                        )}
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(user.dateCreation).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        aria-label="Modifier l'utilisateur"
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        aria-label="Supprimer l'utilisateur"
                        title="Supprimer"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersPage;
