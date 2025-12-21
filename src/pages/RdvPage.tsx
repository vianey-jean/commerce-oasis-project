import React, { useState, useMemo, useCallback } from 'react';
import Layout from '@/components/Layout';
import { RdvCalendar, RdvForm, RdvCard, RdvNotifications } from '@/components/rdv';
import { UnifiedSearchBar } from '@/components/shared';
import { ConfirmDialog } from '@/components/shared';
import { useRdv } from '@/hooks/useRdv';
import { RDV, RDVFormData } from '@/types/rdv';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Calendar, 
  List, 
  Search,
  CalendarCheck,
  CalendarX,
  Clock,
  CheckCircle,
  Package
} from 'lucide-react';
import { format, isToday, isTomorrow, parseISO, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion } from 'framer-motion';

const RdvPage: React.FC = () => {
  const { rdvs, loading, createRdv, updateRdv, deleteRdv, markAsNotified, checkConflicts } = useRdv();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedRdv, setSelectedRdv] = useState<RDV | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rdvToDelete, setRdvToDelete] = useState<RDV | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [defaultDate, setDefaultDate] = useState<string | undefined>();
  const [defaultTime, setDefaultTime] = useState<string | undefined>();
  const [conflicts, setConflicts] = useState<RDV[]>([]);
  const [activeTab, setActiveTab] = useState('calendar');

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRdvs = rdvs.filter(r => r.date === today);
    const confirmedRdvs = rdvs.filter(r => r.statut === 'confirme');
    const pendingRdvs = rdvs.filter(r => r.statut === 'planifie');
    const cancelledRdvs = rdvs.filter(r => r.statut === 'annule');

    return {
      today: todayRdvs.length,
      confirmed: confirmedRdvs.length,
      pending: pendingRdvs.length,
      cancelled: cancelledRdvs.length,
      total: rdvs.length,
    };
  }, [rdvs]);

  // RDV filtrés par recherche
  const filteredRdvs = useMemo(() => {
    if (!searchQuery.trim()) return rdvs;
    
    const query = searchQuery.toLowerCase();
    return rdvs.filter(rdv =>
      rdv.titre.toLowerCase().includes(query) ||
      rdv.clientNom.toLowerCase().includes(query) ||
      rdv.description?.toLowerCase().includes(query) ||
      rdv.lieu?.toLowerCase().includes(query)
    );
  }, [rdvs, searchQuery]);

  // RDV à venir
  const upcomingRdvs = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return filteredRdvs
      .filter(r => r.date >= today && r.statut !== 'annule')
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.heureDebut.localeCompare(b.heureDebut);
      });
  }, [filteredRdvs]);

  // Handlers
  const handleOpenForm = useCallback((rdv?: RDV, date?: string, time?: string) => {
    setSelectedRdv(rdv || null);
    setDefaultDate(date);
    setDefaultTime(time);
    setConflicts([]);
    setIsFormOpen(true);
  }, []);

  const handleCloseForm = useCallback(() => {
    setIsFormOpen(false);
    setSelectedRdv(null);
    setDefaultDate(undefined);
    setDefaultTime(undefined);
    setConflicts([]);
  }, []);

  const handleSubmit = useCallback(async (data: RDVFormData) => {
    // Vérifier les conflits
    const existingConflicts = await checkConflicts(
      data.date,
      data.heureDebut,
      data.heureFin,
      selectedRdv?.id
    );

    if (existingConflicts.length > 0) {
      setConflicts(existingConflicts);
      // On continue quand même mais avec un avertissement visible
    }

    if (selectedRdv) {
      await updateRdv(selectedRdv.id, data);
    } else {
      await createRdv(data);
    }
    handleCloseForm();
  }, [selectedRdv, updateRdv, createRdv, checkConflicts, handleCloseForm]);

  const handleDelete = useCallback(async () => {
    if (rdvToDelete) {
      await deleteRdv(rdvToDelete.id);
      setDeleteDialogOpen(false);
      setRdvToDelete(null);
    }
  }, [rdvToDelete, deleteRdv]);

  const confirmDelete = useCallback((rdv: RDV) => {
    setRdvToDelete(rdv);
    setDeleteDialogOpen(true);
  }, []);

  const handleRdvDrop = useCallback(async (rdv: RDV, newDate: string, newTime: string) => {
    // Calculer la durée du RDV
    const [startH, startM] = rdv.heureDebut.split(':').map(Number);
    const [endH, endM] = rdv.heureFin.split(':').map(Number);
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    
    // Calculer la nouvelle heure de fin
    const [newH, newM] = newTime.split(':').map(Number);
    const newEndMinutes = newH * 60 + newM + durationMinutes;
    const newEndH = Math.floor(newEndMinutes / 60);
    const newEndM = newEndMinutes % 60;
    const newHeureFin = `${newEndH.toString().padStart(2, '0')}:${newEndM.toString().padStart(2, '0')}`;

    await updateRdv(rdv.id, {
      date: newDate,
      heureDebut: newTime,
      heureFin: newHeureFin,
    });
  }, [updateRdv]);

  const formatRdvDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Aujourd'hui";
    if (isTomorrow(date)) return "Demain";
    return format(date, 'EEEE d MMMM', { locale: fr });
  };

  // Grouper les RDV par date
  const groupedRdvs = useMemo(() => {
    const groups: Record<string, RDV[]> = {};
    upcomingRdvs.forEach(rdv => {
      if (!groups[rdv.date]) groups[rdv.date] = [];
      groups[rdv.date].push(rdv);
    });
    return groups;
  }, [upcomingRdvs]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-8 px-4 mb-6"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-primary" />
                  Gestion des Rendez-vous
                </h1>
                <p className="text-muted-foreground mt-1">
                  Planifiez et gérez vos rendez-vous clients
                </p>
              </div>
              <Button onClick={() => handleOpenForm()} size="lg" className="shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Nouveau rendez-vous
              </Button>
              <RdvNotifications
                rdvs={rdvs}
                onRdvClick={(rdv) => handleOpenForm(rdv)}
                onMarkAsNotified={markAsNotified}
              />
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 pb-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
                    </div>
                    <Clock className="h-8 w-8 text-blue-500/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Confirmés</p>
                      <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
                    </div>
                    <CalendarCheck className="h-8 w-8 text-green-500/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">En attente</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-orange-500/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500/50" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <UnifiedSearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Rechercher un rendez-vous (titre, client, lieu...)"
            />
          </div>

          {/* Tabs: Calendar / List */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Calendrier
              </TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Liste
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <RdvCalendar
                rdvs={filteredRdvs}
                onRdvClick={(rdv) => handleOpenForm(rdv)}
                onSlotClick={(date, time) => handleOpenForm(undefined, date, time)}
                onRdvDrop={handleRdvDrop}
                onRdvDelete={confirmDelete}
              />
            </TabsContent>

            <TabsContent value="list">
              <div className="space-y-6">
                {Object.entries(groupedRdvs).length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-medium">Aucun rendez-vous à venir</h3>
                      <p className="text-muted-foreground mt-1">
                        Créez votre premier rendez-vous pour commencer
                      </p>
                      <Button onClick={() => handleOpenForm()} className="mt-4">
                        <Plus className="h-4 w-4 mr-2" />
                        Nouveau rendez-vous
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  Object.entries(groupedRdvs).map(([date, rdvList]) => (
                    <div key={date}>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        {formatRdvDate(date)}
                        <Badge variant="secondary">{rdvList.length}</Badge>
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {rdvList.map(rdv => (
                          <RdvCard
                            key={rdv.id}
                            rdv={rdv}
                            onEdit={() => handleOpenForm(rdv)}
                            onDelete={() => confirmDelete(rdv)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Form Dialog */}
        <RdvForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSubmit={handleSubmit}
          rdv={selectedRdv}
          defaultDate={defaultDate}
          defaultTime={defaultTime}
          conflicts={conflicts}
        />

        {/* Delete Confirmation */}
        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          title="Supprimer le rendez-vous"
          description={`Êtes-vous sûr de vouloir supprimer le rendez-vous "${rdvToDelete?.titre}" ? Cette action est irréversible.`}
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDelete}
          variant="danger"
        />
      </div>
    </Layout>
  );
};

export default RdvPage;
