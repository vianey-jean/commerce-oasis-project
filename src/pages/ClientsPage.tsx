/**
 * =============================================================================
 * ClientsPage - Page de gestion des clients
 * =============================================================================
 * 
 * Cette page permet de gérer les clients : ajout, modification, suppression.
 * Elle utilise des sous-composants décomposés pour le hero et la recherche.
 * 
 * @module ClientsPage
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useClientSync } from '@/hooks/useClientSync';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Phone, MapPin, Users, Sparkles, Crown, Star, Diamond, MessageSquare, PhoneCall, Navigation } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import ConfirmDeleteDialog from '@/components/dashboard/forms/ConfirmDeleteDialog';
import Layout from '@/components/Layout';
import PremiumLoading from '@/components/ui/premium-loading';
import { motion } from "framer-motion";

// Sous-composants décomposés
import { ClientHero, ClientSearchSection } from './clients';

// ============================================================================
// Types
// ============================================================================

interface Client {
  id: string;
  nom: string;
  phone: string;
  adresse: string;
  dateCreation: string;
}

// ============================================================================
// Composant Principal
// ============================================================================

const ClientsPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { isAuthenticated } = useAuth();
  const { clients, isLoading, refetch } = useClientSync();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // =========================================================================
  // États
  // =========================================================================
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nom: '', phone: '', adresse: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [phoneActionOpen, setPhoneActionOpen] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState<string>('');
  const [addressActionOpen, setAddressActionOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000';

  // =========================================================================
  // Handlers téléphone et adresse
  // =========================================================================
  const handlePhoneClick = (phone: string) => { setSelectedPhone(phone); setPhoneActionOpen(true); };
  const handleCall = () => { window.location.href = `tel:${selectedPhone}`; setPhoneActionOpen(false); };
  const handleMessage = () => {
    if (isMobile) { window.location.href = `sms:${selectedPhone}`; }
    else { toast({ title: "Message", description: `Préparez un message pour ${selectedPhone}`, className: "notification-success" }); }
    setPhoneActionOpen(false);
  };
  const handleAddressClick = (address: string) => {
    if (isMobile) { setSelectedAddress(address); setAddressActionOpen(true); }
    else { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank'); }
  };
  const openGoogleMaps = () => { window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedAddress)}`, '_blank'); setAddressActionOpen(false); };
  const openWaze = () => { window.open(`https://waze.com/ul?q=${encodeURIComponent(selectedAddress)}`, '_blank'); setAddressActionOpen(false); };
  const openAppleMaps = () => { window.open(`https://maps.apple.com/?q=${encodeURIComponent(selectedAddress)}`, '_blank'); setAddressActionOpen(false); };

  // =========================================================================
  // Filtrage et pagination
  // =========================================================================
  const filteredClients = searchQuery.length >= 3 
    ? clients.filter(client => 
        client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone.includes(searchQuery) ||
        client.adresse.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : clients;

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / itemsPerPage));

  useEffect(() => { setCurrentPage(1); }, [searchQuery]);
  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [currentPage, totalPages]);

  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // =========================================================================
  // CRUD Handlers
  // =========================================================================
  const resetForm = () => { setFormData({ nom: '', phone: '', adresse: '' }); setEditingClient(null); };
  const handleAddClient = () => { resetForm(); setIsAddDialogOpen(true); };
  const handleEditClient = (client: Client) => { setFormData({ nom: client.nom, phone: client.phone, adresse: client.adresse }); setEditingClient(client); setIsAddDialogOpen(true); };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom.trim() || !formData.phone.trim() || !formData.adresse.trim()) {
      toast({ title: "Erreur", description: "Tous les champs sont obligatoires", variant: "destructive", className: "notification-erreur" });
      return;
    }
    if (editingClient) { setShowEditConfirm(true); } else { setShowAddConfirm(true); }
  };

  const confirmAdd = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/clients`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Succès", description: "Client ajouté avec succès", className: "notification-success" });
      setIsAddDialogOpen(false); setShowAddConfirm(false); resetForm(); refetch();
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de l'ajout", variant: "destructive", className: "notification-erreur" });
    } finally { setIsSubmitting(false); }
  };

  const confirmEdit = async () => {
    if (!editingClient) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_BASE_URL}/api/clients/${editingClient.id}`, formData, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Succès", description: "Client mis à jour avec succès", className: "notification-success" });
      setIsAddDialogOpen(false); setShowEditConfirm(false); resetForm(); refetch();
    } catch (error) {
      toast({ title: "Erreur", description: "Une erreur est survenue lors de la modification", variant: "destructive", className: "notification-erreur" });
    } finally { setIsSubmitting(false); }
  };

  const handleDeleteClient = (client: Client) => { setClientToDelete(client); setShowDeleteConfirm(true); };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/clients/${clientToDelete.id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast({ title: "Succès", description: "Client supprimé avec succès", className: "notification-success" });
      setShowDeleteConfirm(false); setClientToDelete(null); refetch();
    } catch (error) {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive", className: "notification-erreur" });
    } finally { setIsSubmitting(false); }
  };

  // =========================================================================
  // Loading
  // =========================================================================
  if (isLoading) {
    if (embedded) return <PremiumLoading text="Bienvenue sur Listes des Clients" size="xl" overlay={false} variant="default" />;
    return (
      <Layout>
        <PremiumLoading text="Bienvenue sur Listes des Clients" size="xl" overlay={true} variant="default" />
      </Layout>
    );
  }

  // =========================================================================
  // Rendu
  // =========================================================================
  const mirrorShine = "absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500";

  const mainContent = (
    <>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-[#030014] dark:via-[#0a0025] dark:to-[#0e0035]">
      {!embedded && <Navbar />}
      {!embedded && <ScrollToTop />}

      <ClientHero clientCount={clients.length} onAddClient={handleAddClient} />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <ClientSearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCount={filteredClients.length}
        />

        {/* Grille des clients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {paginatedClients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={mirrorShine} />
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-bold text-foreground group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-300 truncate">
                        {client.nom}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground mt-1">
                        <span className="inline-flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-500" />
                          {new Date(client.dateCreation).toLocaleDateString('fr-FR')}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => handleEditClient(client)} className="h-8 w-8 p-0 hover:bg-violet-100 dark:hover:bg-violet-900/30 rounded-lg">
                        <Edit className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClient(client)} className="h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 pt-0">
                  <div className="space-y-2">
                    <div onClick={() => handlePhoneClick(client.phone)} className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-500/[0.08] border border-emerald-200/40 dark:border-emerald-500/10 cursor-pointer hover:bg-emerald-100/80 dark:hover:bg-emerald-500/[0.12] transition-all duration-200">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/20">
                        <Phone className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground">{client.phone}</span>
                    </div>
                    <div onClick={() => handleAddressClick(client.adresse)} className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-500/[0.08] border border-blue-200/40 dark:border-blue-500/10 cursor-pointer hover:bg-blue-100/80 dark:hover:bg-blue-500/[0.12] transition-all duration-200">
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/20 shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-sm text-foreground leading-relaxed line-clamp-2">{client.adresse}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {searchQuery.length >= 3 && filteredClients.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg mb-6">
              <Users className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Aucun client trouvé</h3>
            <p className="text-sm text-muted-foreground mb-6">Aucun résultat pour "{searchQuery}"</p>
            <Button onClick={() => setSearchQuery('')} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-lg">Effacer la recherche</Button>
          </div>
        )}

        {filteredClients.length > 0 && totalPages > 1 && (
          <div className="flex flex-wrap justify-center items-center gap-2 mt-8 mb-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10 disabled:opacity-40 text-xs font-semibold">
              <span className="hidden sm:inline">← Précédent</span><span className="sm:hidden">←</span>
            </Button>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page: number;
                if (totalPages <= 5) { page = i + 1; }
                else if (currentPage <= 3) { page = i + 1; }
                else if (currentPage >= totalPages - 2) { page = totalPages - 4 + i; }
                else { page = currentPage - 2 + i; }
                return (
                  <Button key={page} variant={currentPage === page ? 'default' : 'outline'} size="sm" onClick={() => setCurrentPage(page)} className={`min-w-[36px] h-9 rounded-xl text-xs font-bold transition-all ${currentPage === page ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 border-0' : 'bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10'}`}>{page}</Button>
                );
              })}
            </div>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="rounded-xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10 disabled:opacity-40 text-xs font-semibold">
              <span className="hidden sm:inline">Suivant →</span><span className="sm:hidden">→</span>
            </Button>
          </div>
        )}

        {clients.length === 0 && searchQuery.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white/60 dark:bg-white/[0.06] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-lg mb-8">
              <Users className="w-12 h-12 text-violet-500" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">Votre Empire Clientèle vous attend</h3>
            <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">Commencez à construire votre réseau de clients</p>
            <Button onClick={handleAddClient} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg shadow-violet-500/25 font-semibold">
              <Plus className="w-5 h-5 mr-2" />Créer votre Premier Client
            </Button>
          </div>
        )}
      </div>

      {!embedded && <Footer />}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              {editingClient ? 'Modifier le client' : 'Nouveau client'}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {editingClient ? 'Modifiez les informations du client.' : 'Ajoutez un nouveau client.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-5 py-5">
              <div className="space-y-1.5">
                <Label htmlFor="nom" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nom complet</Label>
                <Input id="nom" value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} placeholder="Nom et prénom" className="bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Téléphone</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="Ex: 0692123456" className="bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="adresse" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adresse</Label>
                <Input id="adresse" value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} placeholder="Adresse complète" className="bg-white/60 dark:bg-white/[0.06] backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl" required />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isSubmitting} className="rounded-xl border border-white/20 dark:border-white/10">Annuler</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-lg">
                {editingClient ? 'Modifier' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showAddConfirm} onOpenChange={setShowAddConfirm}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl"><DialogHeader><DialogTitle>Confirmer l'ajout</DialogTitle><DialogDescription>Voulez-vous vraiment ajouter ce client ?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setShowAddConfirm(false)} disabled={isSubmitting} className="rounded-xl">Annuler</Button><Button onClick={confirmAdd} disabled={isSubmitting} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">{isSubmitting ? 'Ajout...' : 'Oui, ajouter'}</Button></DialogFooter></DialogContent>
      </Dialog>

      <Dialog open={showEditConfirm} onOpenChange={setShowEditConfirm}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl"><DialogHeader><DialogTitle>Confirmer la modification</DialogTitle><DialogDescription>Voulez-vous vraiment modifier ce client ?</DialogDescription></DialogHeader><DialogFooter><Button variant="outline" onClick={() => setShowEditConfirm(false)} disabled={isSubmitting} className="rounded-xl">Annuler</Button><Button onClick={confirmEdit} disabled={isSubmitting} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl">{isSubmitting ? 'Modification...' : 'Oui, modifier'}</Button></DialogFooter></DialogContent>
      </Dialog>

      <ConfirmDeleteDialog isOpen={showDeleteConfirm} onClose={() => { setShowDeleteConfirm(false); setClientToDelete(null); }} onConfirm={confirmDelete} title="Confirmer la suppression" description={`Voulez-vous vraiment supprimer ${clientToDelete?.nom} ?`} isSubmitting={isSubmitting} />

      <Dialog open={phoneActionOpen} onOpenChange={setPhoneActionOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg"><Phone className="w-5 h-5 text-white" /></div>{selectedPhone}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">Que souhaitez-vous faire ?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button onClick={handleCall} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white py-5 text-base font-semibold rounded-xl shadow-lg"><PhoneCall className="w-5 h-5" />Appeler</Button>
            <Button onClick={handleMessage} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-5 text-base font-semibold rounded-xl shadow-lg"><MessageSquare className="w-5 h-5" />{isMobile ? 'SMS' : 'Message'}</Button>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setPhoneActionOpen(false)} className="w-full rounded-xl border border-white/20 dark:border-white/10">Annuler</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addressActionOpen} onOpenChange={setAddressActionOpen}>
        <DialogContent className="sm:max-w-md bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg"><Navigation className="w-5 h-5 text-white" /></div>Navigation
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">Ouvrir dans quelle application ?</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-4">
            <Button onClick={openGoogleMaps} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 text-base font-semibold rounded-xl shadow-lg"><MapPin className="w-5 h-5" />Google Maps</Button>
            <Button onClick={openWaze} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-5 text-base font-semibold rounded-xl shadow-lg"><Navigation className="w-5 h-5" />Waze</Button>
            <Button onClick={openAppleMaps} className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white py-5 text-base font-semibold rounded-xl shadow-lg"><MapPin className="w-5 h-5" />Apple Maps</Button>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddressActionOpen(false)} className="w-full rounded-xl border border-white/20 dark:border-white/10">Annuler</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </>
  );

  if (embedded) return mainContent;
  return mainContent;
};

export default ClientsPage;
