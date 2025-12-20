import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  User,
  Phone,
  Video,
  Briefcase,
  MoreHorizontal,
  GripVertical
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday, parseISO, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { RendezVous, RendezVousFormData } from '@/types/gestion';

// Données de démonstration
const initialRendezVous: RendezVous[] = [
  {
    id: '1',
    titre: 'Réunion client ABC',
    description: 'Présentation du nouveau produit',
    clientNom: 'Entreprise ABC',
    dateDebut: '2024-01-15T10:00:00',
    dateFin: '2024-01-15T11:30:00',
    lieu: 'Salle de conférence A',
    type: 'Réunion',
    statut: 'Planifié',
    priorite: 'Haute',
    couleur: '#3b82f6',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '2',
    titre: 'Appel prospect DEF',
    description: 'Premier contact commercial',
    clientNom: 'Société DEF',
    dateDebut: '2024-01-16T14:00:00',
    dateFin: '2024-01-16T14:30:00',
    type: 'Appel',
    statut: 'Planifié',
    priorite: 'Normale',
    couleur: '#10b981',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '3',
    titre: 'Visite site client GHI',
    description: 'Installation et formation',
    clientNom: 'Client GHI',
    dateDebut: '2024-01-18T09:00:00',
    dateFin: '2024-01-18T17:00:00',
    lieu: '123 Rue du Commerce, Paris',
    type: 'Visite',
    statut: 'Planifié',
    priorite: 'Urgente',
    couleur: '#f59e0b',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
  {
    id: '4',
    titre: 'Démonstration produit',
    description: 'Démo du nouveau logiciel',
    clientNom: 'Partenaire JKL',
    dateDebut: '2024-01-20T11:00:00',
    dateFin: '2024-01-20T12:00:00',
    type: 'Démonstration',
    statut: 'Planifié',
    priorite: 'Normale',
    couleur: '#8b5cf6',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-10'
  },
];

const RendezVousPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rendezVous, setRendezVous] = useState<RendezVous[]>(initialRendezVous);
  const [selectedRdv, setSelectedRdv] = useState<RendezVous | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draggedRdv, setDraggedRdv] = useState<RendezVous | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  
  const [formData, setFormData] = useState<RendezVousFormData>({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    lieu: '',
    type: 'Réunion',
    priorite: 'Normale',
    couleur: '#3b82f6'
  });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calculer le premier jour de la semaine (lundi = 1)
  const startDay = monthStart.getDay();
  const prefixDays = startDay === 0 ? 6 : startDay - 1;

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getRdvForDate = useCallback((date: Date) => {
    return rendezVous.filter(rdv => {
      const rdvDate = parseISO(rdv.dateDebut);
      return isSameDay(rdvDate, date);
    });
  }, [rendezVous]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      'Réunion': <Briefcase className="h-3 w-3" />,
      'Appel': <Phone className="h-3 w-3" />,
      'Visite': <MapPin className="h-3 w-3" />,
      'Démonstration': <Video className="h-3 w-3" />,
      'Autre': <Clock className="h-3 w-3" />,
    };
    return icons[type] || icons['Autre'];
  };

  const getPrioriteBadge = (priorite: string) => {
    const colors: Record<string, string> = {
      'Basse': 'bg-gray-100 text-gray-600',
      'Normale': 'bg-blue-100 text-blue-600',
      'Haute': 'bg-orange-100 text-orange-600',
      'Urgente': 'bg-red-100 text-red-600',
    };
    return colors[priorite] || colors['Normale'];
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, rdv: RendezVous) => {
    setDraggedRdv(rdv);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverDate(date);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    if (!draggedRdv) return;

    const oldDate = parseISO(draggedRdv.dateDebut);
    const timeDiff = targetDate.getTime() - oldDate.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    const newDateDebut = addDays(parseISO(draggedRdv.dateDebut), daysDiff);
    const newDateFin = addDays(parseISO(draggedRdv.dateFin), daysDiff);

    setRendezVous(prev => prev.map(rdv => {
      if (rdv.id === draggedRdv.id) {
        return {
          ...rdv,
          dateDebut: newDateDebut.toISOString(),
          dateFin: newDateFin.toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
      return rdv;
    }));

    setDraggedRdv(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRdv: RendezVous = {
      id: Date.now().toString(),
      ...formData,
      clientNom: '',
      statut: 'Planifié',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setRendezVous(prev => [...prev, newRdv]);
    setIsFormOpen(false);
    setFormData({
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      lieu: '',
      type: 'Réunion',
      priorite: 'Normale',
      couleur: '#3b82f6'
    });
  };

  const stats = useMemo(() => {
    const thisMonth = rendezVous.filter(rdv => {
      const rdvDate = parseISO(rdv.dateDebut);
      return isSameMonth(rdvDate, currentDate);
    });
    return {
      total: thisMonth.length,
      planifies: thisMonth.filter(r => r.statut === 'Planifié').length,
      termines: thisMonth.filter(r => r.statut === 'Terminé').length,
      urgents: thisMonth.filter(r => r.priorite === 'Urgente').length,
    };
  }, [rendezVous, currentDate]);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-gray-900 dark:via-slate-900 dark:to-amber-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Calendrier des Rendez-vous
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos rendez-vous avec glisser-déposer
              </p>
            </div>
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau RDV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Nouveau rendez-vous</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titre">Titre</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateDebut">Date/Heure début</Label>
                      <Input
                        id="dateDebut"
                        type="datetime-local"
                        value={formData.dateDebut}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateDebut: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFin">Date/Heure fin</Label>
                      <Input
                        id="dateFin"
                        type="datetime-local"
                        value={formData.dateFin}
                        onChange={(e) => setFormData(prev => ({ ...prev, dateFin: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Réunion">Réunion</SelectItem>
                          <SelectItem value="Appel">Appel</SelectItem>
                          <SelectItem value="Visite">Visite</SelectItem>
                          <SelectItem value="Démonstration">Démonstration</SelectItem>
                          <SelectItem value="Autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priorite">Priorité</Label>
                      <Select
                        value={formData.priorite}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, priorite: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Basse">Basse</SelectItem>
                          <SelectItem value="Normale">Normale</SelectItem>
                          <SelectItem value="Haute">Haute</SelectItem>
                          <SelectItem value="Urgente">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lieu">Lieu</Label>
                    <Input
                      id="lieu"
                      value={formData.lieu || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="couleur">Couleur</Label>
                    <div className="flex gap-2">
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-8 h-8 rounded-full border-2 transition-all ${formData.couleur === color ? 'border-gray-900 scale-110' : 'border-transparent'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, couleur: color }))}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-orange-600 to-amber-600">
                      Créer le RDV
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Ce mois</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
                  </div>
                  <CalendarIcon className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Planifiés</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.planifies}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Terminés</p>
                    <p className="text-2xl font-bold text-green-600">{stats.termines}</p>
                  </div>
                  <Briefcase className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Urgents</p>
                    <p className="text-2xl font-bold text-red-600">{stats.urgents}</p>
                  </div>
                  <Phone className="h-8 w-8 text-red-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={previousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h2 className="text-lg font-semibold min-w-[200px] text-center">
                    {format(currentDate, 'MMMM yyyy', { locale: fr })}
                  </h2>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" onClick={goToToday}>
                  Aujourd'hui
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grille du calendrier */}
              <div className="grid grid-cols-7 gap-1">
                {/* Jours vides avant le début du mois */}
                {Array.from({ length: prefixDays }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="min-h-[100px] bg-muted/20 rounded-lg" />
                ))}

                {/* Jours du mois */}
                {daysInMonth.map((day) => {
                  const dayRdvs = getRdvForDate(day);
                  const isDropTarget = dragOverDate && isSameDay(day, dragOverDate);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-[100px] p-1 rounded-lg border transition-all ${
                        isToday(day) 
                          ? 'bg-orange-50 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700' 
                          : 'bg-card hover:bg-muted/50 border-transparent'
                      } ${isDropTarget ? 'ring-2 ring-orange-500 bg-orange-100 dark:bg-orange-900/30' : ''}`}
                      onDragOver={(e) => handleDragOver(e, day)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, day)}
                    >
                      <div className={`text-right text-sm mb-1 ${
                        isToday(day) ? 'text-orange-600 font-bold' : 'text-muted-foreground'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {dayRdvs.slice(0, 3).map((rdv) => (
                          <div
                            key={rdv.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, rdv)}
                            onClick={() => setSelectedRdv(rdv)}
                            className="group flex items-center gap-1 p-1 rounded text-xs cursor-grab active:cursor-grabbing hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: `${rdv.couleur}20`, borderLeft: `3px solid ${rdv.couleur}` }}
                          >
                            <GripVertical className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            <span className="truncate">{rdv.titre}</span>
                          </div>
                        ))}
                        {dayRdvs.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{dayRdvs.length - 3} autres
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instructions drag & drop */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                💡 Glissez et déposez les rendez-vous pour les déplacer vers une autre date
              </div>
            </CardContent>
          </Card>

          {/* Modal détail RDV */}
          <Dialog open={!!selectedRdv} onOpenChange={() => setSelectedRdv(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedRdv && getTypeIcon(selectedRdv.type)}
                  {selectedRdv?.titre}
                </DialogTitle>
              </DialogHeader>
              {selectedRdv && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge className={getPrioriteBadge(selectedRdv.priorite)}>
                      {selectedRdv.priorite}
                    </Badge>
                    <Badge variant="outline">{selectedRdv.type}</Badge>
                    <Badge variant="outline">{selectedRdv.statut}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(parseISO(selectedRdv.dateDebut), 'PPP à HH:mm', { locale: fr })} - 
                        {format(parseISO(selectedRdv.dateFin), ' HH:mm', { locale: fr })}
                      </span>
                    </div>
                    
                    {selectedRdv.lieu && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedRdv.lieu}</span>
                      </div>
                    )}
                    
                    {selectedRdv.clientNom && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedRdv.clientNom}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedRdv.description && (
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm">{selectedRdv.description}</p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setSelectedRdv(null)}>
                      Fermer
                    </Button>
                    <Button className="bg-gradient-to-r from-orange-600 to-amber-600">
                      Modifier
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default RendezVousPage;
