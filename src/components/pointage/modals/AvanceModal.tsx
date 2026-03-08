import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Banknote, Search, User, X, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Travailleur } from '@/services/api/travailleurApi';
import { Entreprise } from '@/services/api/entrepriseApi';
import pointageApi, { PointageEntry } from '@/services/api/pointageApi';
import avanceApi from '@/services/api/avanceApi';
import { useToast } from '@/hooks/use-toast';

interface AvanceModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  travailleurs: Travailleur[];
  entreprises: Entreprise[];
  premiumBtnClass: string;
  mirrorShine: string;
}

const AvanceModal: React.FC<AvanceModalProps> = ({
  open, onOpenChange, travailleurs, entreprises, premiumBtnClass, mirrorShine
}) => {
  const { toast } = useToast();
  const [travSearch, setTravSearch] = useState('');
  const [travailleurId, setTravailleurId] = useState('');
  const [travailleurNom, setTravailleurNom] = useState('');
  const [showTravDropdown, setShowTravDropdown] = useState(false);
  const [entrepriseId, setEntrepriseId] = useState('');
  const [montantAvance, setMontantAvance] = useState('');
  const [loading, setLoading] = useState(false);
  const [salaryInfo, setSalaryInfo] = useState<{ totalPointage: number; totalAvances: number; reste: number } | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);

  const travDropdownRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  useEffect(() => {
    if (!open) {
      setTravSearch('');
      setTravailleurId('');
      setTravailleurNom('');
      setEntrepriseId('');
      setMontantAvance('');
      setSalaryInfo(null);
      setConfirmShow(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (travDropdownRef.current && !travDropdownRef.current.contains(e.target as Node)) setShowTravDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fetch salary info when travailleur and entreprise selected
  useEffect(() => {
    if (!travailleurId || !entrepriseId) {
      setSalaryInfo(null);
      return;
    }
    const fetchInfo = async () => {
      setLoadingInfo(true);
      try {
        const [ptRes, avRes] = await Promise.all([
          pointageApi.getByMonth(currentYear, currentMonth),
          avanceApi.getByTravailleur(travailleurId, currentYear, currentMonth)
        ]);
        
        const travPointages = ptRes.data.filter(
          (p: PointageEntry) => p.travailleurId === travailleurId && p.entrepriseId === entrepriseId
        );
        const totalPointage = travPointages.reduce((sum: number, p: PointageEntry) => sum + p.montantTotal, 0);
        const totalAvances = avRes.data
          .filter(a => a.entrepriseId === entrepriseId)
          .reduce((sum, a) => sum + a.montant, 0);
        const reste = totalPointage - totalAvances;
        
        setSalaryInfo({ totalPointage, totalAvances, reste });
      } catch {
        setSalaryInfo(null);
      } finally {
        setLoadingInfo(false);
      }
    };
    fetchInfo();
  }, [travailleurId, entrepriseId, currentMonth, currentYear]);

  const filteredTravailleurs = travSearch.length >= 3
    ? travailleurs.filter(t => {
        const q = travSearch.toLowerCase();
        return `${t.prenom} ${t.nom}`.toLowerCase().includes(q) || `${t.nom} ${t.prenom}`.toLowerCase().includes(q);
      })
    : [];

  const selectedEntreprise = entreprises.find(e => e.id === entrepriseId);

  const handleSubmit = () => {
    if (!travailleurId || !entrepriseId || !montantAvance) {
      toast({ title: 'Erreur', description: 'Tous les champs sont requis', variant: 'destructive' });
      return;
    }
    const avanceNum = parseFloat(montantAvance);
    if (isNaN(avanceNum) || avanceNum <= 0) {
      toast({ title: 'Erreur', description: 'Montant invalide', variant: 'destructive' });
      return;
    }
    if (salaryInfo && avanceNum > salaryInfo.reste) {
      toast({ title: 'Erreur', description: `Le montant dépasse le reste disponible (${salaryInfo.reste.toFixed(2)}€)`, variant: 'destructive' });
      return;
    }
    setConfirmShow(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await avanceApi.create({
        travailleurId,
        travailleurNom,
        entrepriseId,
        entrepriseNom: selectedEntreprise?.nom || '',
        montant: parseFloat(montantAvance),
        date: new Date().toISOString().split('T')[0]
      });
      toast({ title: '✅ Avance enregistrée', description: `${montantAvance}€ pour ${travailleurNom}` });
      setConfirmShow(false);
      onOpenChange(false);
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-amber-900/20 to-orange-900/10 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader className="text-center space-y-3 pb-4">
            <div className="mx-auto w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Banknote className="h-7 w-7 text-white" />
            </div>
            <DialogTitle className="text-xl font-black bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              💰 Prise d'Avance
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Travailleur search */}
            <div className="space-y-2" ref={travDropdownRef}>
              <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                <User className="h-4 w-4 text-purple-400" /> Personne (min. 3 caractères)
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                <Input value={travSearch}
                  onChange={e => {
                    setTravSearch(e.target.value);
                    setTravailleurId('');
                    setTravailleurNom('');
                    if (e.target.value.length >= 3) setShowTravDropdown(true);
                    else setShowTravDropdown(false);
                  }}
                  placeholder="Nom et prénom..."
                  className="bg-white/10 border border-white/20 focus:border-amber-400 rounded-xl text-white placeholder:text-white/40 pl-10"
                />
                {showTravDropdown && filteredTravailleurs.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto rounded-xl bg-slate-800/95 backdrop-blur-2xl border border-white/20 shadow-2xl">
                    {filteredTravailleurs.map(t => (
                      <button key={t.id} type="button"
                        onClick={() => {
                          setTravailleurId(t.id);
                          setTravailleurNom(`${t.prenom} ${t.nom}`);
                          setTravSearch(`${t.prenom} ${t.nom}`);
                          setShowTravDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/5 last:border-0"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                          {t.prenom[0]}{t.nom[0]}
                        </div>
                        <div className="text-sm font-bold text-white">{t.prenom} {t.nom}</div>
                      </button>
                    ))}
                  </div>
                )}
                {travailleurNom && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <User className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300">{travailleurNom}</span>
                    <button onClick={() => { setTravailleurId(''); setTravailleurNom(''); setTravSearch(''); }}
                      className="ml-auto text-white/50 hover:text-white"><X className="h-3 w-3" /></button>
                  </div>
                )}
              </div>
            </div>

            {/* Entreprise select */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-400" /> Entreprise
              </Label>
              <select
                value={entrepriseId}
                onChange={e => setEntrepriseId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm"
              >
                <option value="" className="bg-slate-800">Choisir une entreprise</option>
                {entreprises.map(ent => (
                  <option key={ent.id} value={ent.id} className="bg-slate-800">{ent.nom}</option>
                ))}
              </select>
            </div>

            {/* Salary info */}
            {loadingInfo && (
              <div className="text-center py-3 text-white/50 text-sm animate-pulse">⏳ Chargement des données...</div>
            )}
            {salaryInfo && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total pointage du mois</span>
                  <span className="font-black text-emerald-400">{salaryInfo.totalPointage.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Avances déjà prises</span>
                  <span className="font-black text-red-400">{salaryInfo.totalAvances.toFixed(2)}€</span>
                </div>
                <div className="h-px bg-white/10" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/80 font-bold">Reste disponible</span>
                  <span className={cn("font-black text-lg", salaryInfo.reste > 0 ? "text-amber-400" : "text-red-400")}>
                    {salaryInfo.reste.toFixed(2)}€
                  </span>
                </div>
              </div>
            )}

            {/* Montant avance */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/80 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-amber-400" /> Montant de l'avance (€)
              </Label>
              <Input
                type="number"
                value={montantAvance}
                onChange={e => setMontantAvance(e.target.value)}
                placeholder="0.00"
                max={salaryInfo?.reste || undefined}
                className="bg-white/10 border border-white/20 focus:border-amber-400 rounded-xl text-white text-lg font-bold placeholder:text-white/30"
              />
              {salaryInfo && montantAvance && parseFloat(montantAvance) > salaryInfo.reste && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Le montant dépasse le reste disponible
                </div>
              )}
              {salaryInfo && montantAvance && parseFloat(montantAvance) > 0 && parseFloat(montantAvance) <= salaryInfo.reste && (
                <div className="text-xs text-emerald-400 font-bold">
                  Reste après avance: {(salaryInfo.reste - parseFloat(montantAvance)).toFixed(2)}€
                </div>
              )}
            </div>

            <Button onClick={handleSubmit} 
              disabled={!travailleurId || !entrepriseId || !montantAvance || loading}
              className={cn(premiumBtnClass, "w-full bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 border-amber-300/40 text-white shadow-[0_20px_70px_rgba(245,158,11,0.5)] disabled:opacity-50")}>
              <span className={mirrorShine} />
              <span className="relative flex items-center justify-center w-full">
                💰 Enregistrer l'avance
              </span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmShow} onOpenChange={setConfirmShow}>
        <DialogContent className="max-w-sm rounded-3xl bg-gradient-to-br from-slate-900 via-amber-900/20 to-slate-900 border border-white/10">
          <div className="text-center space-y-4 p-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Banknote className="h-6 w-6 text-white" />
            </div>
            <p className="text-base font-black text-white">Confirmer l'avance ?</p>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 text-sm">
              <p className="text-white/70">Personne: <span className="font-bold text-white">{travailleurNom}</span></p>
              <p className="text-white/70">Entreprise: <span className="font-bold text-white">{selectedEntreprise?.nom}</span></p>
              <p className="text-white/70">Montant: <span className="font-black text-amber-400 text-lg">{montantAvance}€</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setConfirmShow(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/20 text-white/70 font-bold text-sm hover:bg-white/5 transition-colors">
                Annuler
              </button>
              <button onClick={handleConfirm} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50">
                {loading ? '⏳...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AvanceModal;
