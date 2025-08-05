import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, MapPin, Calendar, Crown, Star, Sparkles, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Client, ClientService } from '@/services/ClientService';
import { toast } from 'sonner';
import ClientStatsDisplay from '@/components/ClientStatsDisplay';

interface ClientManagerProps {
  onClientAdded?: () => void;
  onClientUpdate?: () => void;
}
  

const ClientManager: React.FC<ClientManagerProps> = ({ onClientAdded, onClientUpdate }) => {
  const [refreshTrigger]= useState(0);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    dateNaissance: '',
    notes: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const clientsData = await ClientService.getAllClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      toast.error('Erreur lors du chargement des clients');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nom.trim() || !formData.prenom.trim()) {
      toast.error('Le nom et le prénom sont obligatoires');
      return;
    }

    setIsLoading(true);
    try {
      let success = false;
      
      if (isEditing && selectedClient) {
        success = await ClientService.updateClient(selectedClient.id, formData);
      } else {
        success = await ClientService.addClient(formData);
      }

      if (success) {
        await loadClients();
        resetForm();
        setIsDialogOpen(false);
        
        if (!isEditing && onClientAdded) {
          onClientAdded();
        }
        
        if (onClientUpdate) {
          onClientUpdate();
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du client');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setFormData({
      nom: client.nom,
      prenom: client.prenom,
      email: client.email || '',
      telephone: client.telephone || '',
      adresse: client.adresse || '',
      dateNaissance: client.dateNaissance || '',
      notes: client.notes || ''
    });
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (client: Client) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${client.prenom} ${client.nom} ?`)) {
      setIsLoading(true);
      try {
        const success = await ClientService.deleteClient(client.id);
        if (success) {
          await loadClients();
          if (onClientUpdate) {
            onClientUpdate();
          }
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression du client');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
      dateNaissance: '',
      notes: ''
    });
    setIsEditing(false);
    setSelectedClient(null);
  };

  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.telephone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background premium */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-purple-400/20 rounded-full blur-3xl animate-pulse floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000 floating-animation"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header premium */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 premium-gradient rounded-3xl premium-shadow-xl mb-8 relative overflow-hidden floating-animation">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
            <User className="w-14 h-14 text-white relative z-10" />
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold luxury-text-gradient mb-4">
            Gestion des Clients Premium
          </h1>
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-xl text-muted-foreground font-medium">
              Gérez vos clients avec élégance et efficacité
            </p>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>
          <ClientStatsDisplay refreshTrigger={refreshTrigger} />
        {/* Actions et recherche */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-2 border-primary/20 focus:border-primary/40 rounded-xl h-12"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="premium-gradient text-white rounded-xl h-12 px-8 premium-shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Client
                <Diamond className="h-4 w-4 ml-2" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white rounded-3xl border-0 premium-shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 rounded-3xl"></div>
              <div className="relative z-10">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold luxury-text-gradient flex items-center gap-3">
                    <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    {isEditing ? 'Modifier le client' : 'Nouveau client'}
                    <Sparkles className="w-5 h-5 text-primary" />
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="prenom" className="text-sm font-semibold text-gray-700">
                        Prénom *
                      </Label>
                      <Input
                        id="prenom"
                        value={formData.prenom}
                        onChange={(e) => setFormData(prev => ({ ...prev, prenom: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nom" className="text-sm font-semibold text-gray-700">
                        Nom *
                      </Label>
                      <Input
                        id="nom"
                        value={formData.nom}
                        onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telephone" className="text-sm font-semibold text-gray-700">
                        Téléphone
                      </Label>
                      <Input
                        id="telephone"
                        value={formData.telephone}
                        onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateNaissance" className="text-sm font-semibold text-gray-700">
                        Date de naissance
                      </Label>
                      <Input
                        id="dateNaissance"
                        type="date"
                        value={formData.dateNaissance}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateNaissance: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adresse" className="text-sm font-semibold text-gray-700">
                        Adresse
                      </Label>
                      <Input
                        id="adresse"
                        value={formData.adresse}
                        onChange={(e) => setFormData(prev => ({ ...prev, adresse: e.target.value }))}
                        className="bg-gray-50/80 border-2 border-gray-200 focus:border-primary/40 rounded-xl h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-semibold text-gray-700">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      className="bg-gray-50/80  text-black border-2 border-gray-200 focus:border-primary/40 rounded-xl min-h-[100px] resize-none"
                      placeholder="Notes supplémentaires..."
                    />
                  </div>

                  <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="cancel"
                      onClick={() => setIsDialogOpen(false)}
                      className="px-6 py-3 rounded-xl"
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="premium-gradient text-white px-8 py-3 rounded-xl premium-shadow hover:scale-105 transition-all duration-200"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Sauvegarde...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {isEditing ? 'Modifier' : 'Créer'}
                          <Crown className="w-4 h-4" />
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des clients */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-white/80 backdrop-blur-sm border-2 border-white/50 premium-shadow hover:premium-shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/10 pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      {client.prenom} {client.nom}
                    </CardTitle>
                    <Badge variant={client.status === 'actif' ? 'default' : 'secondary'} className="rounded-full">
                      {client.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {client.email && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Mail className="w-4 h-4 text-primary" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.telephone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{client.telephone}</span>
                    </div>
                  )}
                  {client.adresse && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="truncate">{client.adresse}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>Créé le {client.dateCreation}</span>
                  </div>
                  
                  <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(client)}
                      className="rounded-lg hover:bg-primary/10 hover:border-primary/30"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(client)}
                      className="rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {filteredClients.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Aucun client trouvé' : 'Aucun client enregistré'}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez par ajouter votre premier client'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientManager;
