/**
 * ProjetsPage.tsx
 * Page de gestion de projets
 * Kanban, timeline, gestion des tâches et collaboration
 */

import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FolderKanban, 
  Plus, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  Circle,
  AlertCircle,
  MoreHorizontal,
  Filter,
  Search,
  LayoutGrid,
  List,
  GanttChart,
  Target,
  Flag,
  MessageSquare,
  Paperclip
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Données de démonstration
const projets = [
  {
    id: '1',
    nom: 'Refonte Site Web',
    description: 'Modernisation complète du site corporate',
    statut: 'En cours',
    priorite: 'Haute',
    progression: 65,
    dateDebut: '2024-01-15',
    dateFin: '2024-03-30',
    equipe: ['SM', 'PD', 'ML'],
    taches: { total: 24, completees: 16 },
    budget: 25000,
    depense: 16250,
  },
  {
    id: '2',
    nom: 'Application Mobile',
    description: 'Développement de l\'app iOS et Android',
    statut: 'En cours',
    priorite: 'Haute',
    progression: 40,
    dateDebut: '2024-02-01',
    dateFin: '2024-06-30',
    equipe: ['JB', 'ML', 'PD'],
    taches: { total: 48, completees: 19 },
    budget: 50000,
    depense: 20000,
  },
  {
    id: '3',
    nom: 'Intégration CRM',
    description: 'Connexion avec le système CRM existant',
    statut: 'Planifié',
    priorite: 'Moyenne',
    progression: 0,
    dateDebut: '2024-04-01',
    dateFin: '2024-05-15',
    equipe: ['PD'],
    taches: { total: 12, completees: 0 },
    budget: 8000,
    depense: 0,
  },
  {
    id: '4',
    nom: 'Campagne Marketing Q1',
    description: 'Campagne digitale premier trimestre',
    statut: 'Terminé',
    priorite: 'Basse',
    progression: 100,
    dateDebut: '2024-01-01',
    dateFin: '2024-03-31',
    equipe: ['SM', 'JB'],
    taches: { total: 18, completees: 18 },
    budget: 15000,
    depense: 14200,
  },
];

const tachesKanban = {
  'À faire': [
    { id: '1', titre: 'Design des maquettes', projet: 'Site Web', priorite: 'Haute', assignee: 'SM' },
    { id: '2', titre: 'Rédaction contenu', projet: 'Site Web', priorite: 'Moyenne', assignee: 'ML' },
  ],
  'En cours': [
    { id: '3', titre: 'Développement frontend', projet: 'Site Web', priorite: 'Haute', assignee: 'PD' },
    { id: '4', titre: 'API REST', projet: 'App Mobile', priorite: 'Haute', assignee: 'JB' },
    { id: '5', titre: 'Tests unitaires', projet: 'App Mobile', priorite: 'Moyenne', assignee: 'PD' },
  ],
  'En revue': [
    { id: '6', titre: 'Page d\'accueil', projet: 'Site Web', priorite: 'Haute', assignee: 'SM' },
  ],
  'Terminé': [
    { id: '7', titre: 'Wireframes', projet: 'Site Web', priorite: 'Moyenne', assignee: 'SM' },
    { id: '8', titre: 'Setup projet', projet: 'App Mobile', priorite: 'Basse', assignee: 'PD' },
  ],
};

const ProjetsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('projets');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getStatutBadge = (statut: string) => {
    const config: Record<string, string> = {
      'En cours': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Planifié': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      'Terminé': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'En pause': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    };
    return <Badge className={config[statut] || ''}>{statut}</Badge>;
  };

  const getPrioriteBadge = (priorite: string) => {
    const config: Record<string, string> = {
      'Haute': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Moyenne': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Basse': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    };
    return <Badge className={config[priorite] || ''}>{priorite}</Badge>;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-cyan-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyan-600 to-teal-600 bg-clip-text text-transparent">
                Gestion de Projets
              </h1>
              <p className="text-muted-foreground mt-1">
                Suivez et gérez tous vos projets en un seul endroit
              </p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau projet
            </Button>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{projets.length}</p>
                    <p className="text-xs text-muted-foreground">Projets actifs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">53</p>
                    <p className="text-xs text-muted-foreground">Tâches terminées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Échéances proches</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Membres équipe</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <TabsTrigger value="projets" className="flex items-center gap-2">
                  <FolderKanban className="h-4 w-4" />
                  Projets
                </TabsTrigger>
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <GanttChart className="h-4 w-4" />
                  Timeline
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Rechercher..." 
                    className="pl-9 w-48"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Liste des projets */}
            <TabsContent value="projets" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {projets.map((projet) => (
                  <Card key={projet.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{projet.nom}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">{projet.description}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                            <DropdownMenuItem>Modifier</DropdownMenuItem>
                            <DropdownMenuItem>Archiver</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getStatutBadge(projet.statut)}
                        {getPrioriteBadge(projet.priorite)}
                      </div>

                      {/* Progression */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Progression</span>
                          <span className="font-medium">{projet.progression}%</span>
                        </div>
                        <Progress value={projet.progression} className="h-2" />
                      </div>

                      {/* Infos */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{projet.dateFin}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground" />
                          <span>{projet.taches.completees}/{projet.taches.total} tâches</span>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Budget: </span>
                          <span className="font-medium">{formatCurrency(projet.depense)} / {formatCurrency(projet.budget)}</span>
                        </div>
                        <div className="flex -space-x-2">
                          {projet.equipe.map((membre, i) => (
                            <Avatar key={i} className="h-7 w-7 border-2 border-white">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                                {membre}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Vue Kanban */}
            <TabsContent value="kanban" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(tachesKanban).map(([colonne, taches]) => (
                  <div key={colonne} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm flex items-center gap-2">
                        {colonne === 'À faire' && <Circle className="h-3 w-3 text-gray-400" />}
                        {colonne === 'En cours' && <Clock className="h-3 w-3 text-blue-500" />}
                        {colonne === 'En revue' && <AlertCircle className="h-3 w-3 text-yellow-500" />}
                        {colonne === 'Terminé' && <CheckCircle className="h-3 w-3 text-green-500" />}
                        {colonne}
                      </h3>
                      <Badge variant="outline">{taches.length}</Badge>
                    </div>
                    <div className="space-y-2">
                      {taches.map((tache) => (
                        <Card key={tache.id} className="bg-white dark:bg-gray-800 border shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-3 space-y-2">
                            <p className="text-sm font-medium">{tache.titre}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">{tache.projet}</Badge>
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-gradient-to-br from-cyan-500 to-teal-500 text-white">
                                  {tache.assignee}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="flex items-center gap-2">
                              {getPrioriteBadge(tache.priorite)}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <Button variant="ghost" className="w-full text-muted-foreground text-sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Timeline */}
            <TabsContent value="timeline" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Timeline des projets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projets.map((projet, index) => (
                      <div key={projet.id} className="relative pl-8 pb-8 last:pb-0">
                        {/* Ligne de connexion */}
                        {index < projets.length - 1 && (
                          <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-teal-500" />
                        )}
                        {/* Point */}
                        <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                        {/* Contenu */}
                        <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 rounded-lg p-4">
                          <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <div>
                              <h4 className="font-semibold">{projet.nom}</h4>
                              <p className="text-sm text-muted-foreground">{projet.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatutBadge(projet.statut)}
                              <span className="text-sm text-muted-foreground">
                                {projet.dateDebut} → {projet.dateFin}
                              </span>
                            </div>
                          </div>
                          <div className="mt-3">
                            <Progress value={projet.progression} className="h-2" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ProjetsPage;
