import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import tacheApi, { Tache } from '@/services/api/tacheApi';
import travailleurApi, { Travailleur } from '@/services/api/travailleurApi';
import TacheCalendar from './TacheCalendar';
import TacheHero from './TacheHero';
import TacheDayModal from './TacheDayModal';
import TacheFormModal from './TacheFormModal';
import TacheWeekModal from './TacheWeekModal';
import TacheConfirmDialog from './TacheConfirmDialog';

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

  const handleAddTache = async (data: Omit<Tache, 'id' | 'createdAt'>) => {
    try {
      await tacheApi.create(data);
      toast({ title: '✅ Tâche ajoutée' });
      setShowFormModal(false);
      setEditingTache(null);
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

  return (
    <>
      <TacheHero
        totalTaches={taches.length}
        todayCount={todayTaches.length}
        pertinentCount={pertinentCount}
        optionnelCount={optionnelCount}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
        onAddTache={() => { setEditingTache(null); setShowFormModal(true); }}
        onShowToday={() => { setSelectedDay(todayStr); setShowDayModal(true); }}
        onShowWeek={() => setShowWeekModal(true)}
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
        onEdit={(t) => { setEditingTache(t); setShowDayModal(false); setShowFormModal(true); }}
        onDelete={(id) => setDeleteConfirm(id)}
        onAddTache={() => { setEditingTache(null); setShowDayModal(false); setShowFormModal(true); }}
        onMoveTache={(id, newHeure) => {
          const tache = taches.find(t => t.id === id);
          if (!tache || tache.importance === 'pertinent') {
            toast({ title: '⚠️ Interdit', description: 'Tâche pertinente non modifiable', variant: 'destructive' });
            return;
          }
          setMoveConfirm({ tacheId: id, newDate: selectedDay || '', newHeure });
        }}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
      />

      <TacheFormModal
        open={showFormModal}
        onOpenChange={setShowFormModal}
        travailleurs={travailleurs}
        editingTache={editingTache}
        onSubmit={editingTache ? (data) => handleUpdateTache(editingTache.id, data) : handleAddTache}
        premiumBtnClass={premiumBtnClass}
        mirrorShine={mirrorShine}
        defaultDate={selectedDay || undefined}
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
    </>
  );
};

export default TacheView;