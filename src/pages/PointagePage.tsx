import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import {
  Clock, Building2, Plus, CalendarDays, ChevronLeft, ChevronRight,
  Edit, Trash2, Eye, Euro, Timer, Briefcase, Sparkles, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import entrepriseApi, { Entreprise } from '@/services/api/entrepriseApi';
import pointageApi, { PointageEntry } from '@/services/api/pointageApi';

const PointagePage: React.FC = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [pointages, setPointages] = useState<PointageEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showEntrepriseModal, setShowEntrepriseModal] = useState(false);
  const [showPointageModal, setShowPointageModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingPointage, setEditingPointage] = useState<PointageEntry | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editConfirm, setEditConfirm] = useState(false);

  // Entreprise form
  const [entForm, setEntForm] = useState({ nom: '', adresse: '', typePaiement: 'journalier' as 'journalier' | 'horaire', prix: '' });

  // Pointage form
  const [ptForm, setPtForm] = useState({ date: new Date().toISOString().split('T')[0], entrepriseId: '', heures: '', prixJournalier: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [entRes, ptRes] = await Promise.all([
        entrepriseApi.getAll(),
        pointageApi.getByMonth(year, month + 1)
      ]);
      setEntreprises(entRes.data);
      setPointages(ptRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calendar helpers
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const getPointagesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return pointages.filter(p => p.date === dateStr);
  };

  const getTotalForDay = (day: number) => {
    return getPointagesForDay(day).reduce((sum, p) => sum + p.montantTotal, 0);
  };

  const getMonthTotal = () => pointages.reduce((sum, p) => sum + p.montantTotal, 0);

  // Entreprise CRUD
  const handleAddEntreprise = async () => {
    if (!entForm.nom || !entForm.prix) {
      toast({ title: 'Erreur', description: 'Nom et prix requis', variant: 'destructive' });
      return;
    }
    try {
      await entrepriseApi.create({ nom: entForm.nom, adresse: entForm.adresse, typePaiement: entForm.typePaiement, prix: parseFloat(entForm.prix) });
      toast({ title: '✅ Entreprise ajoutée' });
      setEntForm({ nom: '', adresse: '', typePaiement: 'journalier', prix: '' });
      setShowEntrepriseModal(false);
      fetchData();
    } catch (err) {
      toast({ title: 'Erreur', description: 'Impossible d\'ajouter', variant: 'destructive' });
    }
  };

  // Pointage CRUD
  const selectedEntreprise = entreprises.find(e => e.id === ptForm.entrepriseId);

  const handleAddPointage = async () => {
    if (!ptForm.date || !ptForm.entrepriseId) {
      toast({ title: 'Erreur', description: 'Date et entreprise requis', variant: 'destructive' });
      return;
    }
    const ent = entreprises.find(e => e.id === ptForm.entrepriseId);
    if (!ent) return;

    let montantTotal = 0;
    let heures = 0;
    let prixJournalier = 0;
    let prixHeure = 0;

    if (ent.typePaiement === 'journalier') {
      prixJournalier = ptForm.prixJournalier ? parseFloat(ptForm.prixJournalier) : ent.prix;
      montantTotal = prixJournalier;
    } else {
      heures = ptForm.heures ? parseFloat(ptForm.heures) : 0;
      prixHeure = ent.prix;
      montantTotal = heures * prixHeure;
    }

    try {
      await pointageApi.create({
        date: ptForm.date,
        entrepriseId: ent.id,
        entrepriseNom: ent.nom,
        typePaiement: ent.typePaiement,
        heures, prixJournalier, prixHeure, montantTotal
      });
      toast({ title: '✅ Pointage enregistré', description: `${ent.nom} - ${montantTotal.toFixed(2)}€` });
      setPtForm({ date: new Date().toISOString().split('T')[0], entrepriseId: '', heures: '', prixJournalier: '' });
      setShowPointageModal(false);
      fetchData();
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleDeletePointage = async (id: string) => {
    try {
      await pointageApi.delete(id);
      toast({ title: '✅ Pointage supprimé' });
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleEditPointage = async () => {
    if (!editingPointage) return;
    try {
      const ent = entreprises.find(e => e.id === editingPointage.entrepriseId);
      let montantTotal = editingPointage.montantTotal;
      if (editingPointage.typePaiement === 'journalier') {
        montantTotal = editingPointage.prixJournalier;
      } else {
        montantTotal = editingPointage.heures * editingPointage.prixHeure;
      }
      await pointageApi.update(editingPointage.id, { ...editingPointage, montantTotal });
      toast({ title: '✅ Pointage modifié' });
      setEditConfirm(false);
      setShowEditModal(false);
      setEditingPointage(null);
      fetchData();
    } catch (err) {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-[#030014] dark:via-[#0a0025] dark:to-[#0e0035]">
        {/* Hero */}
        <div className="relative overflow-hidden py-8 sm:py-12">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-indigo-500/5" />
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 backdrop-blur-xl">
                <Clock className="h-5 w-5 text-cyan-500" />
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Gestion du Pointage</span>
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent mb-2">
                ⏰ Pointage de Travail
              </h1>
              <p className="text-muted-foreground">Suivez vos heures et revenus par entreprise</p>

              {/* Stats row */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
                  <p className="text-xs text-muted-foreground">Entreprises</p>
                  <p className="text-xl font-black text-cyan-500">{entreprises.length}</p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
                  <p className="text-xs text-muted-foreground">Pointages ce mois</p>
                  <p className="text-xl font-black text-blue-500">{pointages.length}</p>
                </div>
                <div className="px-5 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-xl">
                  <p className="text-xs text-muted-foreground">Total du mois</p>
                  <p className="text-xl font-black text-emerald-500">{getMonthTotal().toFixed(2)}€</p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => setShowEntrepriseModal(true)} className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/25 hover:shadow-2xl hover:shadow-cyan-500/40 border-0 px-6 py-3 font-bold mirror-shine">
                    <Building2 className="h-5 w-5 mr-2" />
                    Ajouter Entreprise
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => { setPtForm({ ...ptForm, date: new Date().toISOString().split('T')[0] }); setShowPointageModal(true); }} className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 border-0 px-6 py-3 font-bold mirror-shine">
                    <Timer className="h-5 w-5 mr-2" />
                    Nouveau Pointage
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Calendar */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-4 sm:p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" onClick={prevMonth} className="rounded-2xl hover:bg-cyan-500/10">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {monthNames[month]} {year}
              </h2>
              <Button variant="ghost" onClick={nextMonth} className="rounded-2xl hover:bg-cyan-500/10">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {dayNames.map(d => (
                <div key={d} className="text-center text-xs sm:text-sm font-bold text-muted-foreground py-2">{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {Array.from({ length: adjustedFirstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dayPointages = getPointagesForDay(day);
                const dayTotal = getTotalForDay(day);
                const hasData = dayPointages.length > 0;
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                return (
                  <motion.div
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedDay(dateStr); setShowDayModal(true); }}
                    className={cn(
                      'aspect-square rounded-xl sm:rounded-2xl p-1 sm:p-2 cursor-pointer transition-all duration-300 border flex flex-col items-center justify-center relative overflow-hidden',
                      isToday(day)
                        ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/40 shadow-lg shadow-cyan-500/20'
                        : hasData
                          ? 'bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20'
                          : 'bg-white/40 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10'
                    )}
                  >
                    <span className={cn('text-xs sm:text-sm font-bold', isToday(day) ? 'text-cyan-600 dark:text-cyan-400' : '')}>
                      {day}
                    </span>
                    {hasData && (
                      <>
                        <span className="text-[10px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                          {dayTotal.toFixed(0)}€
                        </span>
                        <div className="flex gap-0.5 mt-0.5">
                          {dayPointages.slice(0, 3).map((_, idx) => (
                            <div key={idx} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-500" />
                          ))}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Entreprises list */}
          {entreprises.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="mt-6 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-2xl p-4 sm:p-6">
              <h3 className="text-lg font-black bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-cyan-500" /> Mes Entreprises
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {entreprises.map(ent => (
                  <div key={ent.id} className="p-4 rounded-2xl bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{ent.nom}</h4>
                        {ent.adresse && <p className="text-xs text-muted-foreground mt-1">{ent.adresse}</p>}
                      </div>
                      <span className={cn(
                        'text-[10px] px-2 py-1 rounded-full font-bold',
                        ent.typePaiement === 'journalier'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      )}>
                        {ent.typePaiement === 'journalier' ? 'Journalier' : 'Horaire'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <Euro className="h-4 w-4 text-emerald-500" />
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        {ent.prix}€ {ent.typePaiement === 'horaire' ? '/h' : '/jour'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* ============ MODALS ============ */}

        {/* Add Entreprise Modal */}
        <Dialog open={showEntrepriseModal} onOpenChange={setShowEntrepriseModal}>
          <DialogContent className="bg-gradient-to-br from-slate-900 via-cyan-900/30 to-blue-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl max-w-md">
            <DialogHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-cyan-500/30">
                <Building2 className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                ✨ Nouvelle Entreprise
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-cyan-400" /> Nom de l'entreprise
                </Label>
                <Input value={entForm.nom} onChange={e => setEntForm({ ...entForm, nom: e.target.value })} placeholder="Ex: Restaurant Le Paradis"
                  className="bg-white/10 border border-white/20 focus:border-cyan-400 rounded-xl text-white placeholder:text-white/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-400" /> Adresse (optionnel)
                </Label>
                <Input value={entForm.adresse} onChange={e => setEntForm({ ...entForm, adresse: e.target.value })} placeholder="Ex: 12 rue de la Paix"
                  className="bg-white/10 border border-white/20 focus:border-blue-400 rounded-xl text-white placeholder:text-white/40" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80">Type de paiement</Label>
                <Select value={entForm.typePaiement} onValueChange={v => setEntForm({ ...entForm, typePaiement: v as 'journalier' | 'horaire' })}>
                  <SelectTrigger className="bg-white/10 border border-white/20 rounded-xl text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="journalier">💰 Paiement Journalier</SelectItem>
                    <SelectItem value="horaire">⏰ Paiement par Heure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Euro className="h-4 w-4 text-emerald-400" />
                  {entForm.typePaiement === 'journalier' ? 'Prix par jour (€)' : 'Prix par heure (€)'}
                </Label>
                <Input type="number" step="0.01" value={entForm.prix} onChange={e => setEntForm({ ...entForm, prix: e.target.value })} placeholder="Ex: 25"
                  className="bg-white/10 border border-white/20 focus:border-emerald-400 rounded-xl text-white placeholder:text-white/40" />
              </div>
              <div className="flex gap-3 pt-2">
                <Button onClick={handleAddEntreprise} className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg border-0">
                  ✅ Ajouter
                </Button>
                <Button variant="outline" onClick={() => setShowEntrepriseModal(false)} className="flex-1 rounded-xl border-white/20 text-white/80 hover:bg-white/10">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Pointage Modal */}
        <Dialog open={showPointageModal} onOpenChange={setShowPointageModal}>
          <DialogContent className="bg-gradient-to-br from-slate-900 via-emerald-900/30 to-teal-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl max-w-md">
            <DialogHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <Timer className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                ✨ Nouveau Pointage
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-cyan-400" /> Date
                </Label>
                <Input type="date" value={ptForm.date} onChange={e => setPtForm({ ...ptForm, date: e.target.value })}
                  className="bg-white/10 border border-white/20 focus:border-cyan-400 rounded-xl text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-blue-400" /> Entreprise
                </Label>
                <Select value={ptForm.entrepriseId} onValueChange={v => setPtForm({ ...ptForm, entrepriseId: v })}>
                  <SelectTrigger className="bg-white/10 border border-white/20 rounded-xl text-white">
                    <SelectValue placeholder="Choisir une entreprise" />
                  </SelectTrigger>
                  <SelectContent>
                    {entreprises.map(e => (
                      <SelectItem key={e.id} value={e.id}>
                        {e.nom} ({e.typePaiement === 'journalier' ? `${e.prix}€/jour` : `${e.prix}€/h`})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEntreprise && selectedEntreprise.typePaiement === 'journalier' && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                    <Euro className="h-4 w-4 text-amber-400" /> Prix journalier (€)
                  </Label>
                  <Input type="number" step="0.01" value={ptForm.prixJournalier || selectedEntreprise.prix}
                    onChange={e => setPtForm({ ...ptForm, prixJournalier: e.target.value })} placeholder={`${selectedEntreprise.prix}`}
                    className="bg-white/10 border border-white/20 focus:border-amber-400 rounded-xl text-white placeholder:text-white/40" />
                  <p className="text-xs text-emerald-400 font-bold">
                    💰 Total: {(ptForm.prixJournalier ? parseFloat(ptForm.prixJournalier) : selectedEntreprise.prix).toFixed(2)}€
                  </p>
                </div>
              )}

              {selectedEntreprise && selectedEntreprise.typePaiement === 'horaire' && (
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" /> Nombre d'heures
                  </Label>
                  <Input type="number" step="0.5" value={ptForm.heures} onChange={e => setPtForm({ ...ptForm, heures: e.target.value })} placeholder="Ex: 8"
                    className="bg-white/10 border border-white/20 focus:border-blue-400 rounded-xl text-white placeholder:text-white/40" />
                  {ptForm.heures && (
                    <p className="text-xs text-emerald-400 font-bold">
                      💰 Total: {(parseFloat(ptForm.heures) * selectedEntreprise.prix).toFixed(2)}€ ({ptForm.heures}h × {selectedEntreprise.prix}€)
                    </p>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button onClick={handleAddPointage} className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg border-0" disabled={!ptForm.entrepriseId}>
                  ✅ Enregistrer
                </Button>
                <Button variant="outline" onClick={() => setShowPointageModal(false)} className="flex-1 rounded-xl border-white/20 text-white/80 hover:bg-white/10">
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Day Detail Modal */}
        <Dialog open={showDayModal} onOpenChange={setShowDayModal}>
          <DialogContent className="bg-gradient-to-br from-slate-900 via-indigo-900/30 to-violet-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
                <CalendarDays className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                📅 {selectedDay && new Date(selectedDay + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </DialogTitle>
            </DialogHeader>
            {selectedDay && (
              <div className="space-y-3">
                {pointages.filter(p => p.date === selectedDay).length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/50 font-bold">Aucun pointage ce jour</p>
                    <Button onClick={() => { setPtForm({ ...ptForm, date: selectedDay }); setShowDayModal(false); setShowPointageModal(true); }}
                      className="mt-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold border-0">
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un pointage
                    </Button>
                  </div>
                ) : (
                  <>
                    {pointages.filter(p => p.date === selectedDay).map(pt => (
                      <div key={pt.id} className="p-4 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-xl">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm">{pt.entrepriseNom}</h4>
                            <p className="text-xs text-white/60 mt-1">
                              {pt.typePaiement === 'journalier'
                                ? `Journalier: ${pt.prixJournalier}€`
                                : `${pt.heures}h × ${pt.prixHeure}€/h`}
                            </p>
                          </div>
                          <span className="text-lg font-black text-emerald-400">{pt.montantTotal.toFixed(2)}€</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="ghost" onClick={() => { setEditingPointage({ ...pt }); setShowDayModal(false); setShowEditModal(true); }}
                            className="rounded-xl text-blue-400 hover:bg-blue-500/10 text-xs">
                            <Edit className="h-3 w-3 mr-1" /> Modifier
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setDeleteConfirm(pt.id)}
                            className="rounded-xl text-red-400 hover:bg-red-500/10 text-xs">
                            <Trash2 className="h-3 w-3 mr-1" /> Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                      <span className="text-sm font-black text-emerald-400">
                        Total du jour: {pointages.filter(p => p.date === selectedDay).reduce((s, p) => s + p.montantTotal, 0).toFixed(2)}€
                      </span>
                    </div>
                    <Button onClick={() => { setPtForm({ ...ptForm, date: selectedDay }); setShowDayModal(false); setShowPointageModal(true); }}
                      className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold border-0 mt-2">
                      <Plus className="h-4 w-4 mr-2" /> Ajouter un autre pointage
                    </Button>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Pointage Modal */}
        <Dialog open={showEditModal} onOpenChange={v => { if (!v) { setShowEditModal(false); setEditingPointage(null); } }}>
          <DialogContent className="bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl max-w-md">
            <DialogHeader className="text-center space-y-3 pb-4">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                <Edit className="h-7 w-7 text-white" />
              </div>
              <DialogTitle className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                ✏️ Modifier Pointage
              </DialogTitle>
            </DialogHeader>
            {editingPointage && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/10 border border-white/10">
                  <p className="text-sm font-bold text-white">{editingPointage.entrepriseNom}</p>
                  <p className="text-xs text-white/60">{editingPointage.typePaiement === 'journalier' ? 'Paiement journalier' : 'Paiement horaire'}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-white/80">Date</Label>
                  <Input type="date" value={editingPointage.date} onChange={e => setEditingPointage({ ...editingPointage, date: e.target.value })}
                    className="bg-white/10 border border-white/20 rounded-xl text-white" />
                </div>
                {editingPointage.typePaiement === 'journalier' ? (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-white/80">Prix journalier (€)</Label>
                    <Input type="number" step="0.01" value={editingPointage.prixJournalier}
                      onChange={e => setEditingPointage({ ...editingPointage, prixJournalier: parseFloat(e.target.value) || 0 })}
                      className="bg-white/10 border border-white/20 rounded-xl text-white" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-white/80">Nombre d'heures</Label>
                    <Input type="number" step="0.5" value={editingPointage.heures}
                      onChange={e => setEditingPointage({ ...editingPointage, heures: parseFloat(e.target.value) || 0 })}
                      className="bg-white/10 border border-white/20 rounded-xl text-white" />
                    <p className="text-xs text-emerald-400 font-bold">
                      💰 Total: {(editingPointage.heures * editingPointage.prixHeure).toFixed(2)}€
                    </p>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button onClick={() => setEditConfirm(true)} className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg border-0">
                    ✅ Sauvegarder
                  </Button>
                  <Button variant="outline" onClick={() => { setShowEditModal(false); setEditingPointage(null); }} className="flex-1 rounded-xl border-white/20 text-white/80 hover:bg-white/10">
                    Annuler
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
          <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-red-900/30 to-rose-900/20 backdrop-blur-2xl border border-white/10 rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white font-black">🗑️ Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                Voulez-vous vraiment supprimer ce pointage ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl border-white/20 text-white/80 hover:bg-white/10">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteConfirm && handleDeletePointage(deleteConfirm)}
                className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold border-0">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Confirmation */}
        <AlertDialog open={editConfirm} onOpenChange={setEditConfirm}>
          <AlertDialogContent className="bg-gradient-to-br from-slate-900 via-blue-900/30 to-indigo-900/20 backdrop-blur-2xl border border-white/10 rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white font-black">✏️ Confirmer la modification</AlertDialogTitle>
              <AlertDialogDescription className="text-white/70">
                Voulez-vous enregistrer les modifications de ce pointage ?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-xl border-white/20 text-white/80 hover:bg-white/10">Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleEditPointage}
                className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold border-0">
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
};

export default PointagePage;
