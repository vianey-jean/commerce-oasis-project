import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Package, 
  Truck, 
  CheckCircle2, 
  Bell, 
  Calendar as CalendarIcon,
  Trash2,
  Edit,
  Phone,
  MapPin,
  ShoppingCart,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Commande, CommandeProduit } from '@/types/commande';

const CommandesPage: React.FC = () => {
  const { token } = useAuth();
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCommande, setSelectedCommande] = useState<Commande | null>(null);

  // Form states
  const [clientNom, setClientNom] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [type, setType] = useState<'commande' | 'reservation'>('commande');
  const [produits, setProduits] = useState<CommandeProduit[]>([{
    nom: '',
    description: '',
    prixUnitaire: 0,
    quantite: 1,
    prixVente: 0
  }]);
  const [dateArrivagePrevue, setDateArrivagePrevue] = useState<Date>();
  const [dateEcheance, setDateEcheance] = useState<Date>();
  const [statut, setStatut] = useState<'en_route' | 'arrive' | 'en_attente'>('en_attente');

  useEffect(() => {
    fetchCommandes();
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await axios.get('http://localhost:10000/api/commandes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommandes(response.data);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkNotifications = () => {
    const today = new Date();
    commandes.forEach(commande => {
      if (!commande.notificationEnvoyee) {
        if (commande.type === 'commande' && commande.statut === 'arrive') {
          toast({
            title: '📦 Produit Arrivé',
            description: `Contacter ${commande.clientNom} - Produit disponible!`,
            duration: 10000,
          });
        } else if (commande.type === 'reservation' && commande.dateEcheance) {
          const echeance = new Date(commande.dateEcheance);
          if (echeance <= today) {
            toast({
              title: '⏰ Échéance Réservation',
              description: `Contacter ${commande.clientNom} - Demander si il/elle souhaite toujours le produit`,
              duration: 10000,
            });
          }
        }
      }
    });
  };

  const addProduit = () => {
    setProduits([...produits, {
      nom: '',
      description: '',
      prixUnitaire: 0,
      quantite: 1,
      prixVente: 0
    }]);
  };

  const removeProduit = (index: number) => {
    setProduits(produits.filter((_, i) => i !== index));
  };

  const updateProduit = (index: number, field: keyof CommandeProduit, value: any) => {
    const newProduits = [...produits];
    newProduits[index] = { ...newProduits[index], [field]: value };
    setProduits(newProduits);
  };

  const resetForm = () => {
    setClientNom('');
    setClientPhone('');
    setClientAddress('');
    setType('commande');
    setProduits([{
      nom: '',
      description: '',
      prixUnitaire: 0,
      quantite: 1,
      prixVente: 0
    }]);
    setDateArrivagePrevue(undefined);
    setDateEcheance(undefined);
    setStatut('en_attente');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const commandeData = {
        clientNom,
        clientPhone,
        clientAddress,
        type,
        produits,
        dateCommande: new Date().toISOString(),
        dateArrivagePrevue: dateArrivagePrevue?.toISOString(),
        dateEcheance: dateEcheance?.toISOString(),
        statut,
        notificationEnvoyee: false
      };

      await axios.post('http://localhost:10000/api/commandes', commandeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Succès',
        description: `${type === 'commande' ? 'Commande' : 'Réservation'} ajoutée avec succès`,
      });

      setIsAddDialogOpen(false);
      resetForm();
      fetchCommandes();
    } catch (error) {
      console.error('Error creating commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer la commande',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateStatut = async (id: string, newStatut: 'en_route' | 'arrive' | 'en_attente') => {
    try {
      await axios.put(`http://localhost:10000/api/commandes/${id}`, 
        { statut: newStatut },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Statut mis à jour',
        description: `Statut changé en ${newStatut}`,
      });

      fetchCommandes();
    } catch (error) {
      console.error('Error updating statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette commande?')) return;

    try {
      await axios.delete(`http://localhost:10000/api/commandes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: 'Supprimé',
        description: 'Commande supprimée avec succès',
      });

      fetchCommandes();
    } catch (error) {
      console.error('Error deleting commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande',
        variant: 'destructive'
      });
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'arrive':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Arrivé</Badge>;
      case 'en_route':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Truck className="w-3 h-3 mr-1" />En route</Badge>;
      default:
        return <Badge className="bg-orange-500 hover:bg-orange-600"><Clock className="w-3 h-3 mr-1" />En attente</Badge>;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  Commandes & Réservations
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Gérez vos commandes et réservations clients
                </p>
              </div>
              
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      Nouvelle Commande/Réservation
                    </DialogTitle>
                    <DialogDescription>
                      Ajoutez une nouvelle commande ou réservation client
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Type */}
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={type} onValueChange={(value: 'commande' | 'reservation') => setType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="commande">
                            <div className="flex items-center">
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Commande
                            </div>
                          </SelectItem>
                          <SelectItem value="reservation">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              Réservation
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Client Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="clientNom">Nom du Client *</Label>
                        <Input
                          id="clientNom"
                          value={clientNom}
                          onChange={(e) => setClientNom(e.target.value)}
                          required
                          placeholder="Jean Dupont"
                        />
                      </div>
                      <div>
                        <Label htmlFor="clientPhone">Téléphone *</Label>
                        <Input
                          id="clientPhone"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          required
                          placeholder="0692123456"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="clientAddress">Adresse *</Label>
                      <Textarea
                        id="clientAddress"
                        value={clientAddress}
                        onChange={(e) => setClientAddress(e.target.value)}
                        required
                        placeholder="123 Rue de la Paix, Saint-Denis"
                        rows={2}
                      />
                    </div>

                    {/* Produits */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-lg font-semibold">Produits</Label>
                        <Button type="button" onClick={addProduit} size="sm" variant="outline">
                          <Plus className="w-4 h-4 mr-1" />
                          Ajouter produit
                        </Button>
                      </div>

                      {produits.map((produit, index) => (
                        <Card key={index} className="p-4 space-y-3 bg-gradient-to-br from-white to-indigo-50 dark:from-gray-800 dark:to-indigo-900/20">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-muted-foreground">Produit {index + 1}</span>
                            {produits.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProduit(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label>Nom</Label>
                              <Input
                                value={produit.nom}
                                onChange={(e) => updateProduit(index, 'nom', e.target.value)}
                                required
                                placeholder="Nom du produit"
                              />
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Input
                                value={produit.description}
                                onChange={(e) => updateProduit(index, 'description', e.target.value)}
                                placeholder="Description"
                              />
                            </div>
                            <div>
                              <Label>Prix Unitaire (€)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={produit.prixUnitaire}
                                onChange={(e) => updateProduit(index, 'prixUnitaire', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </div>
                            <div>
                              <Label>Quantité</Label>
                              <Input
                                type="number"
                                min="1"
                                value={produit.quantite}
                                onChange={(e) => updateProduit(index, 'quantite', parseInt(e.target.value) || 1)}
                                required
                              />
                            </div>
                            <div>
                              <Label>Prix de Vente (€)</Label>
                              <Input
                                type="number"
                                step="0.01"
                                value={produit.prixVente}
                                onChange={(e) => updateProduit(index, 'prixVente', parseFloat(e.target.value) || 0)}
                                required
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>

                    {/* Dates et Statut */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {type === 'commande' && (
                        <>
                          <div>
                            <Label>Date d'Arrivage Prévue</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left">
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {dateArrivagePrevue ? format(dateArrivagePrevue, 'PPP', { locale: fr }) : 'Sélectionner'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={dateArrivagePrevue}
                                  onSelect={setDateArrivagePrevue}
                                  locale={fr}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div>
                            <Label>Statut</Label>
                            <Select value={statut} onValueChange={(value: any) => setStatut(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en_attente">En attente</SelectItem>
                                <SelectItem value="en_route">En route</SelectItem>
                                <SelectItem value="arrive">Arrivé</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}

                      {type === 'reservation' && (
                        <div>
                          <Label>Date d'Échéance</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="outline" className="w-full justify-start text-left">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateEcheance ? format(dateEcheance, 'PPP', { locale: fr }) : 'Sélectionner'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={dateEcheance}
                                onSelect={setDateEcheance}
                                locale={fr}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                        Annuler
                      </Button>
                      <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        Enregistrer
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Table */}
          <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                    <TableHead className="font-bold">Type</TableHead>
                    <TableHead className="font-bold">Client</TableHead>
                    <TableHead className="font-bold hidden md:table-cell">Contact</TableHead>
                    <TableHead className="font-bold">Produits</TableHead>
                    <TableHead className="font-bold hidden lg:table-cell">Date</TableHead>
                    <TableHead className="font-bold">Statut</TableHead>
                    <TableHead className="font-bold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                          <span className="text-muted-foreground">Chargement...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : commandes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-2">
                          <Package className="w-12 h-12 text-muted-foreground/50" />
                          <p className="text-muted-foreground">Aucune commande pour le moment</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    commandes.map((commande) => (
                      <TableRow key={commande.id} className="hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 transition-colors">
                        <TableCell>
                          {commande.type === 'commande' ? (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              Commande
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              <Package className="w-3 h-3 mr-1" />
                              Réservation
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold">{commande.clientNom}</div>
                          <div className="text-xs text-muted-foreground md:hidden">{commande.clientPhone}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center text-sm space-y-1">
                            <Phone className="w-3 h-3 mr-1 text-muted-foreground" />
                            <span>{commande.clientPhone}</span>
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[200px]">{commande.clientAddress}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {commande.produits.map((produit, idx) => (
                              <div key={idx} className="text-sm">
                                <div className="font-medium">{produit.nom}</div>
                                <div className="text-xs text-muted-foreground">
                                  {produit.quantite}x {produit.prixUnitaire}€ → {produit.prixVente}€
                                </div>
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="text-sm">
                            {commande.type === 'commande' && commande.dateArrivagePrevue && (
                              <div className="flex items-center text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {format(new Date(commande.dateArrivagePrevue), 'dd/MM/yyyy')}
                              </div>
                            )}
                            {commande.type === 'reservation' && commande.dateEcheance && (
                              <div className="flex items-center text-xs">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                {format(new Date(commande.dateEcheance), 'dd/MM/yyyy')}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {commande.type === 'commande' ? (
                            <Select
                              value={commande.statut}
                              onValueChange={(value: any) => handleUpdateStatut(commande.id, value)}
                            >
                              <SelectTrigger className="w-[140px]">
                                {getStatutBadge(commande.statut)}
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en_attente">En attente</SelectItem>
                                <SelectItem value="en_route">En route</SelectItem>
                                <SelectItem value="arrive">Arrivé</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge variant="secondary">Réservé</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(commande.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CommandesPage;
