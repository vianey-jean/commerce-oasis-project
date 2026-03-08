/**
 * =============================================================================
 * FacturationPage - Module de Facturation & Devis PDF
 * =============================================================================
 * Permet de créer, gérer et exporter des factures et devis professionnels
 * avec génération PDF intégrée via jsPDF
 */

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import factureApi, { Facture, FactureLigne } from '@/services/api/factureApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileText, Plus, Download, Trash2, Edit3, Eye, Search,
  Receipt, FileCheck, Send, XCircle, Sparkles, Crown,
  Calendar, Euro, Users, Hash, Printer
} from 'lucide-react';

const STATUT_CONFIG = {
  brouillon: { label: 'Brouillon', color: 'bg-gray-500/20 text-gray-600 dark:text-gray-400', icon: FileText },
  envoyee: { label: 'Envoyée', color: 'bg-blue-500/20 text-blue-600 dark:text-blue-400', icon: Send },
  payee: { label: 'Payée', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400', icon: FileCheck },
  annulee: { label: 'Annulée', color: 'bg-red-500/20 text-red-600 dark:text-red-400', icon: XCircle },
};

const emptyLigne: FactureLigne = { description: '', quantite: 1, prixUnitaire: 0, total: 0 };

const FacturationPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { toast } = useToast();
  const [factures, setFactures] = useState<Facture[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'facture' | 'devis'>('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedFacture, setSelectedFacture] = useState<Facture | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    type: 'facture' as 'facture' | 'devis',
    clientNom: '', clientAdresse: '', clientPhone: '', clientEmail: '',
    date: new Date().toISOString().split('T')[0],
    dateEcheance: '',
    lignes: [{ ...emptyLigne }] as FactureLigne[],
    tva: 0,
    notes: '',
    statut: 'brouillon' as Facture['statut'],
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await factureApi.getAll();
      setFactures(res.data);
    } catch {
      console.error('Error fetching factures');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const calcSousTotal = (lignes: FactureLigne[]) => lignes.reduce((sum, l) => sum + l.total, 0);

  const updateLigne = (index: number, field: keyof FactureLigne, value: string | number) => {
    const newLignes = [...form.lignes];
    (newLignes[index] as any)[field] = value;
    newLignes[index].total = newLignes[index].quantite * newLignes[index].prixUnitaire;
    setForm({ ...form, lignes: newLignes });
  };

  const addLigne = () => setForm({ ...form, lignes: [...form.lignes, { ...emptyLigne }] });
  const removeLigne = (index: number) => {
    if (form.lignes.length <= 1) return;
    setForm({ ...form, lignes: form.lignes.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    if (!form.clientNom) {
      toast({ title: 'Erreur', description: 'Nom du client requis', variant: 'destructive' });
      return;
    }
    const sousTotal = calcSousTotal(form.lignes);
    const tvaMontant = sousTotal * (form.tva / 100);
    const totalTTC = sousTotal + tvaMontant;

    try {
      const data = { ...form, sousTotal, tvaMontant, totalTTC };
      if (selectedFacture) {
        await factureApi.update(selectedFacture.id, data);
        toast({ title: '✅ Facture modifiée' });
      } else {
        await factureApi.create(data);
        toast({ title: '✅ Facture créée' });
      }
      resetForm();
      fetchData();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await factureApi.delete(id);
      toast({ title: '✅ Facture supprimée' });
      setDeleteConfirm(null);
      fetchData();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const resetForm = () => {
    setForm({
      type: 'facture', clientNom: '', clientAdresse: '', clientPhone: '', clientEmail: '',
      date: new Date().toISOString().split('T')[0], dateEcheance: '',
      lignes: [{ ...emptyLigne }], tva: 0, notes: '', statut: 'brouillon',
    });
    setSelectedFacture(null);
    setShowForm(false);
  };

  const editFacture = (f: Facture) => {
    setSelectedFacture(f);
    setForm({
      type: f.type, clientNom: f.clientNom, clientAdresse: f.clientAdresse,
      clientPhone: f.clientPhone, clientEmail: f.clientEmail || '',
      date: f.date, dateEcheance: f.dateEcheance || '',
      lignes: f.lignes || [{ ...emptyLigne }],
      tva: f.tva || 0, notes: f.notes || '', statut: f.statut,
    });
    setShowForm(true);
  };

  const generatePDF = (f: Facture) => {
    const doc = new jsPDF();
    const isDevis = f.type === 'devis';

    // Header gradient effect
    doc.setFillColor(88, 28, 135);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, 210, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(isDevis ? 'DEVIS' : 'FACTURE', 20, 25);
    doc.setFontSize(12);
    doc.text(`N° ${f.numero}`, 20, 35);
    doc.text(`Date: ${new Date(f.date).toLocaleDateString('fr-FR')}`, 140, 25);
    if (f.dateEcheance) doc.text(`Échéance: ${new Date(f.dateEcheance).toLocaleDateString('fr-FR')}`, 140, 33);

    // Client info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Client:', 20, 60);
    doc.setFont('helvetica', 'normal');
    doc.text(f.clientNom, 20, 68);
    if (f.clientAdresse) doc.text(f.clientAdresse, 20, 75);
    if (f.clientPhone) doc.text(`Tél: ${f.clientPhone}`, 20, 82);

    // Table
    const tableData = (f.lignes || []).map(l => [
      l.description,
      l.quantite.toString(),
      `${l.prixUnitaire.toFixed(2)} €`,
      `${l.total.toFixed(2)} €`
    ]);

    autoTable(doc, {
      startY: 95,
      head: [['Description', 'Qté', 'Prix unitaire', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [88, 28, 135], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 243, 255] },
      styles: { fontSize: 10, cellPadding: 5 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Totals
    doc.setFont('helvetica', 'bold');
    doc.text('Sous-total HT:', 120, finalY);
    doc.text(`${(f.sousTotal || 0).toFixed(2)} €`, 175, finalY, { align: 'right' });

    if (f.tva > 0) {
      doc.text(`TVA (${f.tva}%):`, 120, finalY + 8);
      doc.text(`${(f.tvaMontant || 0).toFixed(2)} €`, 175, finalY + 8, { align: 'right' });
    }

    doc.setFillColor(88, 28, 135);
    doc.rect(115, finalY + 13, 80, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text('TOTAL TTC:', 120, finalY + 22);
    doc.text(`${(f.totalTTC || 0).toFixed(2)} €`, 190, finalY + 22, { align: 'right' });

    // Notes
    if (f.notes) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Notes: ${f.notes}`, 20, finalY + 40);
    }

    // Footer
    doc.setFillColor(88, 28, 135);
    doc.rect(0, 285, 210, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.text('Document généré par Riziky Gestion - Solution Premium', 105, 292, { align: 'center' });

    doc.save(`${f.numero}.pdf`);
    toast({ title: '✅ PDF généré', description: f.numero });
  };

  const filtered = factures.filter(f => {
    if (activeType !== 'all' && f.type !== activeType) return false;
    if (search && !f.clientNom.toLowerCase().includes(search.toLowerCase()) && !f.numero.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    total: factures.length,
    factures: factures.filter(f => f.type === 'facture').length,
    devis: factures.filter(f => f.type === 'devis').length,
    totalMontant: factures.filter(f => f.statut !== 'annulee').reduce((s, f) => s + (f.totalTTC || 0), 0),
  };

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50/30 to-purple-50/20 dark:from-[#030014] dark:via-[#0a0025] dark:to-[#0e0035]">
      {/* Hero */}
      <div className="relative overflow-hidden py-8 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-fuchsia-500/5" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Receipt className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                Facturation & Devis <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground">{stats.factures} factures · {stats.devis} devis</p>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            {[
              { label: 'Total', value: stats.total, icon: Hash, gradient: 'from-violet-500 to-purple-600' },
              { label: 'Factures', value: stats.factures, icon: FileText, gradient: 'from-blue-500 to-cyan-600' },
              { label: 'Devis', value: stats.devis, icon: FileCheck, gradient: 'from-emerald-500 to-teal-600' },
              { label: 'Montant', value: `${stats.totalMontant.toFixed(0)}€`, icon: Euro, gradient: 'from-amber-500 to-orange-600' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2 mx-auto', s.gradient)}>
                  <s.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-lg font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-700 rounded-2xl shadow-2xl p-5 border border-white/25 max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-wrap justify-center gap-3">
              <Button onClick={() => { resetForm(); setForm(f => ({ ...f, type: 'facture' })); setShowForm(true); }}
                className="bg-gradient-to-br from-cyan-500 to-blue-700 border border-cyan-300/40 text-white shadow-lg hover:shadow-xl rounded-2xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" /> Nouvelle Facture
              </Button>
              <Button onClick={() => { resetForm(); setForm(f => ({ ...f, type: 'devis' })); setShowForm(true); }}
                className="bg-gradient-to-br from-emerald-500 to-teal-700 border border-emerald-300/40 text-white shadow-lg hover:shadow-xl rounded-2xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105">
                <Plus className="h-4 w-4 mr-2" /> Nouveau Devis
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher par client ou numéro..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-10 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border-white/20" />
          </div>
          <div className="flex gap-2">
            {(['all', 'facture', 'devis'] as const).map(t => (
              <Button key={t} variant={activeType === t ? 'default' : 'outline'} size="sm"
                onClick={() => setActiveType(t)} className="rounded-xl">
                {t === 'all' ? 'Tout' : t === 'facture' ? 'Factures' : 'Devis'}
              </Button>
            ))}
          </div>
        </div>

        {/* Factures list */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Receipt className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">Aucune facture trouvée</p>
            <p className="text-sm">Créez votre première facture ou devis</p>
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {filtered.map((f, i) => {
                const statutConfig = STATUT_CONFIG[f.statut] || STATUT_CONFIG.brouillon;
                const StatutIcon = statutConfig.icon;
                return (
                  <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group p-4 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-lg',
                          f.type === 'facture' ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600')}>
                          {f.type === 'facture' ? <FileText className="h-5 w-5 text-white" /> : <FileCheck className="h-5 w-5 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-foreground truncate">{f.numero}</p>
                          <p className="text-xs text-muted-foreground truncate">{f.clientNom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-xs', statutConfig.color)}>
                          <StatutIcon className="h-3 w-3 mr-1" />{statutConfig.label}
                        </Badge>
                        <span className="font-black text-sm text-foreground">{(f.totalTTC || 0).toFixed(2)}€</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> {new Date(f.date).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setSelectedFacture(f); setShowDetail(true); }}
                          className="p-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </button>
                        <button onClick={() => editFacture(f)}
                          className="p-1.5 rounded-xl hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-all">
                          <Edit3 className="h-4 w-4 text-cyan-500" />
                        </button>
                        <button onClick={() => generatePDF(f)}
                          className="p-1.5 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-all">
                          <Download className="h-4 w-4 text-green-500" />
                        </button>
                        <button onClick={() => setDeleteConfirm(f.id)}
                          className="p-1.5 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create/Edit Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-violet-200/30 dark:border-violet-800/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black">
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center',
                form.type === 'facture' ? 'bg-gradient-to-br from-violet-500 to-purple-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600')}>
                {form.type === 'facture' ? <FileText className="h-4 w-4 text-white" /> : <FileCheck className="h-4 w-4 text-white" />}
              </div>
              {selectedFacture ? 'Modifier' : 'Nouvelle'} {form.type === 'facture' ? 'Facture' : 'Devis'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Nom du client *</label>
                <Input value={form.clientNom} onChange={e => setForm({ ...form, clientNom: e.target.value })} placeholder="Nom du client" className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Téléphone</label>
                <Input value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} placeholder="Téléphone" className="rounded-xl" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Adresse</label>
                <Input value={form.clientAdresse} onChange={e => setForm({ ...form, clientAdresse: e.target.value })} placeholder="Adresse" className="rounded-xl" />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Date</label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-xl" />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Échéance</label>
                <Input type="date" value={form.dateEcheance} onChange={e => setForm({ ...form, dateEcheance: e.target.value })} className="rounded-xl" />
              </div>
            </div>

            {/* Lignes */}
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-2 block">Lignes de {form.type}</label>
              <div className="space-y-2">
                {form.lignes.map((l, i) => (
                  <div key={i} className="flex gap-2 items-end p-3 rounded-xl bg-white/50 dark:bg-white/5 border border-white/20">
                    <div className="flex-1">
                      <Input value={l.description} onChange={e => updateLigne(i, 'description', e.target.value)} placeholder="Description" className="rounded-lg text-xs" />
                    </div>
                    <div className="w-16">
                      <Input type="number" value={l.quantite} onChange={e => updateLigne(i, 'quantite', parseInt(e.target.value) || 0)} className="rounded-lg text-xs" />
                    </div>
                    <div className="w-24">
                      <Input type="number" step="0.01" value={l.prixUnitaire} onChange={e => updateLigne(i, 'prixUnitaire', parseFloat(e.target.value) || 0)} placeholder="Prix" className="rounded-lg text-xs" />
                    </div>
                    <span className="text-xs font-bold w-20 text-right">{l.total.toFixed(2)}€</span>
                    {form.lignes.length > 1 && (
                      <button onClick={() => removeLigne(i)} className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"><Trash2 className="h-3 w-3" /></button>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={addLigne} className="mt-2 rounded-xl text-xs">
                <Plus className="h-3 w-3 mr-1" /> Ajouter une ligne
              </Button>
            </div>

            {/* TVA & Totals */}
            <div className="flex items-center gap-4 p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-200/30 dark:border-violet-800/30">
              <div className="w-24">
                <label className="text-xs font-bold text-muted-foreground">TVA %</label>
                <Input type="number" value={form.tva} onChange={e => setForm({ ...form, tva: parseFloat(e.target.value) || 0 })} className="rounded-lg text-xs" />
              </div>
              <div className="flex-1 text-right">
                <p className="text-xs text-muted-foreground">Sous-total: <span className="font-bold text-foreground">{calcSousTotal(form.lignes).toFixed(2)}€</span></p>
                {form.tva > 0 && <p className="text-xs text-muted-foreground">TVA: <span className="font-bold text-foreground">{(calcSousTotal(form.lignes) * form.tva / 100).toFixed(2)}€</span></p>}
                <p className="text-sm font-black text-foreground mt-1">Total: {(calcSousTotal(form.lignes) * (1 + form.tva / 100)).toFixed(2)}€</p>
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Statut</label>
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value as Facture['statut'] })}
                className="w-full p-2 rounded-xl bg-white dark:bg-white/10 border border-white/20 text-sm">
                <option value="brouillon">Brouillon</option>
                <option value="envoyee">Envoyée</option>
                <option value="payee">Payée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notes..."
                className="w-full p-3 rounded-xl bg-white dark:bg-white/10 border border-white/20 text-sm min-h-[60px] resize-none" />
            </div>

            <Button onClick={handleSave} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3">
              {selectedFacture ? 'Modifier' : 'Créer'} le {form.type}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl">
          {selectedFacture && (
            <div>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg font-black">
                  <Receipt className="h-5 w-5 text-violet-500" />
                  {selectedFacture.numero}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-3 mt-4">
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20">
                  <p className="text-xs text-muted-foreground">Client</p>
                  <p className="font-bold text-foreground">{selectedFacture.clientNom}</p>
                  {selectedFacture.clientAdresse && <p className="text-sm text-muted-foreground">{selectedFacture.clientAdresse}</p>}
                </div>
                {(selectedFacture.lignes || []).map((l, i) => (
                  <div key={i} className="flex justify-between p-2 rounded-lg bg-white/50 dark:bg-white/5">
                    <span className="text-sm">{l.description}</span>
                    <span className="text-sm font-bold">{l.quantite} × {l.prixUnitaire.toFixed(2)}€ = {l.total.toFixed(2)}€</span>
                  </div>
                ))}
                <div className="p-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-center">
                  <p className="text-xs opacity-80">Total TTC</p>
                  <p className="text-2xl font-black">{(selectedFacture.totalTTC || 0).toFixed(2)}€</p>
                </div>
                <Button onClick={() => generatePDF(selectedFacture)} className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold">
                  <Download className="h-4 w-4 mr-2" /> Télécharger PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="rounded-xl bg-red-500 hover:bg-red-600 text-white">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  if (embedded) return content;
  return <Layout requireAuth>{content}</Layout>;
};

export default FacturationPage;
