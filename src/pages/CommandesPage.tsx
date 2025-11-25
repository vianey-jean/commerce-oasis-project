import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Package, Plus, Trash2, Edit } from 'lucide-react';
import { Commande, CommandeProduit } from '@/types/commande';
import api from '@/service/api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
}

interface Product {
  id: string;
  description: string;
  purchasePrice: number;
}

export default function CommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCommande, setEditingCommande] = useState<Commande | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Form state
  const [clientNom, setClientNom] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [type, setType] = useState<'commande' | 'reservation'>('commande');
  const [produitNom, setProduitNom] = useState('');
  const [prixUnitaire, setPrixUnitaire] = useState('');
  const [quantite, setQuantite] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [dateArrivagePrevue, setDateArrivagePrevue] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  
  // Autocomplete state
  const [clientSearch, setClientSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  useEffect(() => {
    fetchCommandes();
    fetchClients();
    fetchProducts();
    
    // Check for notifications
    const interval = setInterval(checkNotifications, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const fetchCommandes = async () => {
    try {
      const response = await api.get('/commandes');
      setCommandes(response.data);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les commandes',
        variant: 'destructive',
      });
    }
  };

  const fetchClients = async () => {
    try {
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const checkNotifications = () => {
    const now = new Date();
    commandes.forEach((commande) => {
      if (commande.type === 'commande' && commande.statut === 'arrive' && !commande.notificationEnvoyee) {
        toast({
          title: '📦 Produit arrivé!',
          description: `Contacter ${commande.clientNom} (${commande.clientPhone})`,
        });
        updateNotificationStatus(commande.id);
      }
      
      if (commande.type === 'reservation' && commande.dateEcheance) {
        const echeance = new Date(commande.dateEcheance);
        if (now >= echeance && !commande.notificationEnvoyee) {
          toast({
            title: '⏰ Réservation échue!',
            description: `Demander à ${commande.clientNom} s'il veut toujours ce produit`,
          });
          updateNotificationStatus(commande.id);
        }
      }
    });
  };

  const updateNotificationStatus = async (id: string) => {
    try {
      await api.put(`/commandes/${id}`, { notificationEnvoyee: true });
      fetchCommandes();
    } catch (error) {
      console.error('Error updating notification status:', error);
    }
  };

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (clientSearch.length < 3) return [];
    return clients.filter(client => 
      client.nom.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clientSearch, clients]);

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (productSearch.length < 3) return [];
    return products.filter(product => 
      product.description.toLowerCase().includes(productSearch.toLowerCase())
    );
  }, [productSearch, products]);

  const handleClientSelect = (client: Client) => {
    setClientNom(client.nom);
    setClientPhone(client.phone);
    setClientAddress(client.adresse);
    setClientSearch(client.nom);
    setShowClientSuggestions(false);
  };

  const handleProductSelect = (product: Product) => {
    setProduitNom(product.description);
    setPrixUnitaire(product.purchasePrice.toString());
    setProductSearch(product.description);
    setShowProductSuggestions(false);
  };

  const isFormValid = () => {
    return (
      clientNom.trim() !== '' &&
      clientPhone.trim() !== '' &&
      clientAddress.trim() !== '' &&
      produitNom.trim() !== '' &&
      prixUnitaire.trim() !== '' &&
      quantite.trim() !== '' &&
      prixVente.trim() !== '' &&
      (type === 'commande' ? dateArrivagePrevue.trim() !== '' : dateEcheance.trim() !== '')
    );
  };

  const resetForm = () => {
    setClientNom('');
    setClientPhone('');
    setClientAddress('');
    setProduitNom('');
    setPrixUnitaire('');
    setQuantite('');
    setPrixVente('');
    setDateArrivagePrevue('');
    setDateEcheance('');
    setType('commande');
    setClientSearch('');
    setProductSearch('');
    setEditingCommande(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: 'Erreur',
        description: 'Tous les champs sont obligatoires',
        variant: 'destructive',
      });
      return;
    }

    const produit: CommandeProduit = {
      nom: produitNom,
      prixUnitaire: parseFloat(prixUnitaire),
      quantite: parseInt(quantite),
      prixVente: parseFloat(prixVente),
    };

    const commandeData: Partial<Commande> = {
      clientNom,
      clientPhone,
      clientAddress,
      type,
      produits: [produit],
      dateCommande: new Date().toISOString(),
      statut: type === 'commande' ? 'en_route' : 'en_attente',
    };

    if (type === 'commande') {
      commandeData.dateArrivagePrevue = dateArrivagePrevue;
    } else {
      commandeData.dateEcheance = dateEcheance;
    }

    try {
      if (editingCommande) {
        await api.put(`/commandes/${editingCommande.id}`, commandeData);
        toast({
          title: 'Succès',
          description: 'Commande modifiée avec succès',
        });
      } else {
        await api.post('/commandes', commandeData);
        toast({
          title: 'Succès',
          description: 'Commande ajoutée avec succès',
        });
      }
      fetchCommandes();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la commande',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (commande: Commande) => {
    setEditingCommande(commande);
    setClientNom(commande.clientNom);
    setClientPhone(commande.clientPhone);
    setClientAddress(commande.clientAddress);
    setType(commande.type);
    
    if (commande.produits.length > 0) {
      const produit = commande.produits[0];
      setProduitNom(produit.nom);
      setPrixUnitaire(produit.prixUnitaire.toString());
      setQuantite(produit.quantite.toString());
      setPrixVente(produit.prixVente.toString());
    }
    
    setDateArrivagePrevue(commande.dateArrivagePrevue || '');
    setDateEcheance(commande.dateEcheance || '');
    setClientSearch(commande.clientNom);
    setProductSearch(commande.produits[0]?.nom || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/commandes/${id}`);
      toast({
        title: 'Succès',
        description: 'Commande supprimée avec succès',
      });
      fetchCommandes();
      setDeleteId(null);
    } catch (error) {
      console.error('Error deleting commande:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer la commande',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'en_route' | 'arrive' | 'en_attente') => {
    try {
      await api.put(`/commandes/${id}`, { statut: newStatus });
      toast({
        title: 'Succès',
        description: 'Statut mis à jour',
      });
      fetchCommandes();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'arrive':
        return <Badge className="bg-green-500">Arrivé</Badge>;
      case 'en_route':
        return <Badge className="bg-blue-500">En route</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>{statut}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Commandes & Réservations
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez vos commandes et réservations clients
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto" size="lg">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle Commande/Réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCommande ? 'Modifier' : 'Nouvelle'} Commande/Réservation</DialogTitle>
              <DialogDescription>
                Remplissez tous les champs pour enregistrer
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations Client</h3>
                
                <div className="relative">
                  <Label htmlFor="clientNom">Nom du Client</Label>
                  <Input
                    id="clientNom"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setClientNom(e.target.value);
                      setShowClientSuggestions(e.target.value.length >= 3);
                    }}
                    placeholder="Saisir au moins 3 caractères..."
                    required
                  />
                  {showClientSuggestions && filteredClients.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.map((client) => (
                        <div
                          key={client.id}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => handleClientSelect(client)}
                        >
                          <div className="font-medium">{client.nom}</div>
                          <div className="text-sm text-muted-foreground">{client.phone}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="clientPhone">Téléphone</Label>
                  <Input
                    id="clientPhone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Numéro de téléphone"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="clientAddress">Adresse</Label>
                  <Input
                    id="clientAddress"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    placeholder="Adresse complète"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Informations Produit</h3>
                
                <div className="relative">
                  <Label htmlFor="produitNom">Nom du Produit</Label>
                  <Input
                    id="produitNom"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProduitNom(e.target.value);
                      setShowProductSuggestions(e.target.value.length >= 3);
                    }}
                    placeholder="Saisir au moins 3 caractères..."
                    required
                  />
                  {showProductSuggestions && filteredProducts.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-2 hover:bg-accent cursor-pointer"
                          onClick={() => handleProductSelect(product)}
                        >
                          <div className="font-medium">{product.description}</div>
                          <div className="text-sm text-muted-foreground">Prix: {product.purchasePrice}€</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prixUnitaire">Prix Unitaire (€)</Label>
                    <Input
                      id="prixUnitaire"
                      type="number"
                      step="0.01"
                      value={prixUnitaire}
                      onChange={(e) => setPrixUnitaire(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="quantite">Quantité</Label>
                    <Input
                      id="quantite"
                      type="number"
                      value={quantite}
                      onChange={(e) => setQuantite(e.target.value)}
                      placeholder="1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="prixVente">Prix de Vente (€)</Label>
                    <Input
                      id="prixVente"
                      type="number"
                      step="0.01"
                      value={prixVente}
                      onChange={(e) => setPrixVente(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Détails</h3>
                
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={type} onValueChange={(value: 'commande' | 'reservation') => setType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commande">Commande</SelectItem>
                      <SelectItem value="reservation">Réservation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {type === 'commande' ? (
                  <div>
                    <Label htmlFor="dateArrivagePrevue">Date d'Arrivage Prévue</Label>
                    <Input
                      id="dateArrivagePrevue"
                      type="date"
                      value={dateArrivagePrevue}
                      onChange={(e) => setDateArrivagePrevue(e.target.value)}
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <Label htmlFor="dateEcheance">Date d'Échéance</Label>
                    <Input
                      id="dateEcheance"
                      type="date"
                      value={dateEcheance}
                      onChange={(e) => setDateEcheance(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={!isFormValid()}>
                {editingCommande ? 'Modifier' : 'Enregistrer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Liste des Commandes et Réservations
          </CardTitle>
          <CardDescription>
            Total: {commandes.length} {commandes.length > 1 ? 'commandes' : 'commande'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commandes.map((commande) => (
                  <TableRow key={commande.id}>
                    <TableCell className="font-medium">
                      <div>{commande.clientNom}</div>
                      <div className="text-xs text-muted-foreground">{commande.clientAddress}</div>
                    </TableCell>
                    <TableCell>{commande.clientPhone}</TableCell>
                    <TableCell>
                      {commande.produits.map((p, idx) => (
                        <div key={idx} className="text-sm">
                          <div className="font-medium">{p.nom}</div>
                          <div className="text-muted-foreground">Qté: {p.quantite}</div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {commande.produits.map((p, idx) => (
                        <div key={idx} className="text-sm">
                          <div>Unitaire: {p.prixUnitaire}€</div>
                          <div className="font-medium">Vente: {p.prixVente}€</div>
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={commande.type === 'commande' ? 'default' : 'secondary'}>
                        {commande.type === 'commande' ? 'Commande' : 'Réservation'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {commande.type === 'commande' ? (
                        <div>
                          <div className="text-muted-foreground">Arrivage:</div>
                          <div>{new Date(commande.dateArrivagePrevue || '').toLocaleDateString()}</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-muted-foreground">Échéance:</div>
                          <div>{new Date(commande.dateEcheance || '').toLocaleDateString()}</div>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {commande.type === 'commande' ? (
                        <Select value={commande.statut} onValueChange={(value) => handleStatusChange(commande.id, value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en_route">En route</SelectItem>
                            <SelectItem value="arrive">Arrivé</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        getStatusBadge(commande.statut)
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(commande)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(commande.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDelete(deleteId)}>
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
