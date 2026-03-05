import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import tacheApi, { Tache } from '@/services/api/tacheApi';
import travailleurApi, { Travailleur } from '@/services/api/travailleurApi';
import TacheCalendar from './TacheCalendar';
import TacheHero from './TacheHero';
import TacheDayModal from './TacheDayModal';
import TacheFormModal from './TacheFormModal';
import TacheWeekModal from './TacheWeekModal';
import TacheConfirmDialog from './TacheConfirmDialog';
import TacheNotificationBar, { TacheNotification } from './TacheNotificationBar';
import TacheValidationModal from './TacheValidationModal';
import TravailleurModal from '@/components/pointage/modals/TravailleurModal';

const premiumBtnClass = "group relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-105 px-4 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold";
const mirrorShine = "absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500";

const TacheView: React.FC = () => {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taches, setTaches] = useState<Tache[]>([]);
  const [travailleurs, setTravailleurs] = useState<Travailleur[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showDayModal, setShowDayModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [editingTache, setEditingTache] = useState<Tache | null>(null);

  // Confirm dialogs
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [moveConfirm, setMoveConfirm] = useState<{ tacheId: string; newDate: string; newHeure: string } | null>(null);

  // Validation modal
  const [validationTache, setValidationTache] = useState<Tache | null>(null);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState<TacheNotification[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());

  // Travailleur modal
  const [showTravailleurModal, setShowTravailleurModal] = useState(false);
  const [travailleurForm, setTravailleurForm] = useState({ nom: '', prenom: '', adresse: '', phone: '', genre: 'homme' as 'homme' | 'femme' });

  // Follow-up form (pre-filled)
  const [followUpTache, setFollowUpTache] = useState<Tache | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tRes, travRes] = await Promise.all([
        tacheApi.getByMonth(year, month + 1),
        travailleurApi.getAll()
      ]);
      setTaches(tRes.data);
      setTravailleurs(travRes.data);
    } catch (err) {
      console.error('Error fetching taches:', err);
    } finally {
      setLoading(false);
    }
  }, [year, month]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Check for expired taches periodically and add notifications
  useEffect(() => {
    const checkExpired = () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      taches.forEach(tache => {
        if (tache.completed) return;
        if (tache.date !== todayStr) return;
        if (notifiedRef.current.has(tache.id)) return;

        const [h, m] = tache.heureFin.split(':').map(Number);
        const end = new Date(tache.date + 'T00:00:00');
        end.setHours(h, m, 0, 0);

        if (now >= end) {
          notifiedRef.current.add(tache.id);
          setNotifications(prev => [...prev, {
            id: `notif-${tache.id}-${Date.now()}`,
            tache,
            message: 'Vérifiez si cette tâche est terminée !'
          }]);
        }
      });
    };

    const interval = setInterval(checkExpired, 5000);
    checkExpired();
    return () => clearInterval(interval);
  }, [taches]);

  const handleAddTache = async (data: Omit<Tache, 'id' | 'createdAt'>) => {
    try {
      await tacheApi.create(data);
      toast({ title: '✅ Tâche ajoutée' });
      setShowFormModal(false);
      setEditingTache(null);
      setFollowUpTache(null);
      fetchData();
    } catch {
      toast({ title: 'Erreur', description: "Impossible d'ajouter la tâche", variant: 'destructive' });
    }
  };

  const handleUpdateTache = async (id: string, data: Partial<Tache>) => {
    try {
      await tacheApi.update(id, data);
      toast({ title: '✅ Tâche modifiée' });
      setShowFormModal(false);
      setEditingTache(null);
      fetchData();
    } catch {
      toast({ title: 'Erreur', description: "Impossible de modifier la tâche", variant: 'destructive' });
    }
  };

  const handleDeleteTache = async (id: string) => {
    try {
      await tacheApi.delete(id);
      toast({ title: '✅ Tâche supprimée' });
      setDeleteConfirm(null);
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Impossible de supprimer';
      toast({ title: 'Erreur', description: msg, variant: 'destructive' });
      setDeleteConfirm(null);
    }
  };

  const handleMoveTache = async () => {
    if (!moveConfirm) return;
    try {
      await tacheApi.update(moveConfirm.tacheId, {
        date: moveConfirm.newDate,
        heureDebut: moveConfirm.newHeure
      });
      toast({ title: '✅ Tâche déplacée' });
      setMoveConfirm(null);
      fetchData();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
      setMoveConfirm(null);
    }
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDay(dateStr);
    setShowDayModal(true);
  };

  const handleCalendarDrag = (tacheId: string, newDate: string) => {
    const tache = taches.find(t => t.id === tacheId);
    if (!tache || tache.importance === 'pertinent') {
      toast({ title: '⚠️ Interdit', description: 'Les tâches pertinentes ne peuvent pas être déplacées', variant: 'destructive' });
      return;
    }
    setMoveConfirm({ tacheId, newDate, newHeure: tache.heureDebut });
  };

  // Validate task as completed
  const handleValidateTache = (tache: Tache) => {
    setValidationTache(tache);
    setShowValidationModal(true);
  };

  const handleConfirmValidation = async (tache: Tache) => {
    try {
      await tacheApi.update(tache.id, { completed: true });
      // Also mark all related parent/child tasks as completed
      const relatedTaches = taches.filter(t =>
        t.parentId === tache.id || t.id === tache.parentId ||
        (tache.parentId && t.parentId === tache.parentId)
      );
      for (const rt of relatedTaches) {
        if (!rt.completed) {
          await tacheApi.update(rt.id, { completed: true });
        }
      }
      toast({ title: '✅ Tâche validée comme terminée' });
      setShowValidationModal(false);
      setValidationTache(null);
      // Remove related notifications
      setNotifications(prev => prev.filter(n => n.tache.id !== tache.id));
      fetchData();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const handleCreateFollowUp = (tache: Tache) => {
    setShowValidationModal(false);
    setValidationTache(null);
    // Remove notification
    setNotifications(prev => prev.filter(n => n.tache.id !== tache.id));
    // Open form pre-filled with tache data but empty date/time
    setFollowUpTache(tache);
    setEditingTache(null);
    setShowDayModal(false);
    setShowFormModal(true);
  };

  const handleNotificationClick = (notif: TacheNotification) => {
    setNotifications(prev => prev.filter(n => n.id !== notif.id));
    handleValidateTache(notif.tache);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Travailleur
  const handleAddTravailleur = async () => {
    if (!travailleurForm.nom || !travailleurForm.prenom) {
      toast({ title: 'Erreur', description: 'Nom et prénom requis', variant: 'destructive' });
      return;
    }
    try {
      await travailleurApi.create(travailleurForm);
      toast({ title: '✅ Travailleur ajouté' });
      setShowTravailleurModal(false);
      setTravailleurForm({ nom: '', prenom: '', adresse: '', phone: '', genre: 'homme' });
      // Refresh travailleurs
      const travRes = await travailleurApi.getAll();
      setTravailleurs(travRes.data);
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return {
      start: monday.toISOString().split('T')[0],
      end: sunday.toISOString().split('T')[0]
    };
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTaches = taches.filter(t => t.date === todayStr);
  const pertinentCount = taches.filter(t => t.importance === 'pertinent').length;
  const optionnelCount = taches.filter(t => t.importance === 'optionnel').length;

  // Build form default for follow-up
  const followUpDefaults = followUpTache ? {
    ...followUpTache,
    id: undefined,
    createdAt: undefined,
    completed: undefined,
    parentId: followUpTache.id,
    date: '',
    heureDebut: '',
    heureFin: '',
  } : null;

  return (
    <>
      <TacheHero
        totalTaches={taches.length}
        todayCount={todayTaches.length}
        pertinentCount={pertinentCount}
        optionnelCount={optionnelCount}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
        onAddTache={() => { setEditingTache(null); setFollowUpTache(null); setShowFormModal(true); }}
        onShowToday={() => { setSelectedDay(todayStr); setShowDayModal(true); }}
        onShowWeek={() => setShowWeekModal(true)}
        onAddTravailleur={() => setShowTravailleurModal(true)}
      />

      <div className="max-w-7xl mx-auto px-4 pb-12">
        <TacheCalendar
          currentDate={currentDate}
          taches={taches}
          onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
          onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
          onDayClick={handleDayClick}
          onDragTache={handleCalendarDrag}
        />
      </div>

      <TacheDayModal
        open={showDayModal}
        onOpenChange={setShowDayModal}
        selectedDay={selectedDay}
        taches={taches}
        onEdit={(t) => { setEditingTache(t); setFollowUpTache(null); setShowDayModal(false); setShowFormModal(true); }}
        onDelete={(id) => setDeleteConfirm(id)}
        onAddTache={() => { setEditingTache(null); setFollowUpTache(null); setShowDayModal(false); setShowFormModal(true); }}
        onMoveTache={(id, newHeure) => {
          const tache = taches.find(t => t.id === id);
          if (!tache || tache.importance === 'pertinent') {
            toast({ title: '⚠️ Interdit', description: 'Tâche pertinente non modifiable', variant: 'destructive' });
            return;
          }
          setMoveConfirm({ tacheId: id, newDate: selectedDay || '', newHeure });
        }}
        onValidateTache={handleValidateTache}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
      />

      <TacheFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        travailleurs={travailleurs}
        editingTache={followUpTache ? ({ ...followUpTache, id: '', date: '', heureDebut: '', heureFin: '' } as any) : editingTache}
        onSubmit={editingTache
          ? (data) => handleUpdateTache(editingTache.id, data)
          : (data) => handleAddTache(followUpTache ? { ...data, parentId: followUpTache.id } : data)
        }
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
        defaultDate={selectedDay || undefined}
        isFollowUp={!!followUpTache}
      />

      <TacheWeekModal
        open={showWeekModal}
        onOpenChange={setShowWeekModal}
        weekDates={getWeekDates()}
        taches={taches}
        fetchWeekTaches={async () => {
          const { start, end } = getWeekDates();
          const res = await tacheApi.getByWeek(start, end);
          return res.data;
        }}
      />

      <TacheConfirmDialog
        deleteConfirm={deleteConfirm}
        setDeleteConfirm={setDeleteConfirm}
        onDelete={handleDeleteTache}
        moveConfirm={moveConfirm}
        setMoveConfirm={setMoveConfirm}
        onMoveConfirm={handleMoveTache}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
      />

      <TacheValidationModal
        open={showValidationModal}
        onOpenChange={setShowValidationModal}
        tache={validationTache}
        onValidate={handleConfirmValidation}
        onCreateFollowUp={handleCreateFollowUp}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
      />

      <TravailleurModal
        open={showTravailleurModal}
        onOpenChange={setShowTravailleurModal}
        form={travailleurForm}
        setForm={setTravailleurForm}
        onSubmit={handleAddTravailleur}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
      />

      <TacheNotificationBar
        notifications={notifications}
        onClickNotification={handleNotificationClick}
        onDismiss={handleDismissNotification}
      />
    </>
  );
};

export default TacheView;
