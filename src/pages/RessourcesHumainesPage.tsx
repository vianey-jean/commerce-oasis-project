import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  UserPlus, 
  Calendar, 
  DollarSign,
  Star,
  Search,
  Filter,
  Download,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Briefcase,
  GraduationCap,
  Heart,
  TrendingUp
} from 'lucide-react';

// Données de démonstration
const employes = [
  { 
    id: '1', 
    nom: 'Martin', 
    prenom: 'Sophie', 
    poste: 'Directrice Commerciale', 
    departement: 'Commercial',
    statut: 'Actif',
    dateEmbauche: '2020-03-15',
    email: 'sophie.martin@company.com',
    telephone: '+33 6 12 34 56 78',
    salaire: 4500,
    typeContrat: 'CDI'
  },
  { 
    id: '2', 
    nom: 'Dubois', 
    prenom: 'Pierre', 
    poste: 'Développeur Senior', 
    departement: 'IT',
    statut: 'Actif',
    dateEmbauche: '2019-07-01',
    email: 'pierre.dubois@company.com',
    telephone: '+33 6 23 45 67 89',
    salaire: 3800,
    typeContrat: 'CDI'
  },
  { 
    id: '3', 
    nom: 'Leroy', 
    prenom: 'Marie', 
    poste: 'Comptable', 
    departement: 'Finance',
    statut: 'Congé',
    dateEmbauche: '2021-01-10',
    email: 'marie.leroy@company.com',
    telephone: '+33 6 34 56 78 90',
    salaire: 3200,
    typeContrat: 'CDI'
  },
  { 
    id: '4', 
    nom: 'Bernard', 
    prenom: 'Jean', 
    poste: 'Stagiaire Marketing', 
    departement: 'Marketing',
    statut: 'Actif',
    dateEmbauche: '2024-01-02',
    email: 'jean.bernard@company.com',
    telephone: '+33 6 45 67 89 01',
    salaire: 800,
    typeContrat: 'Stage'
  },
];

const conges = [
  { id: '1', employe: 'Sophie Martin', type: 'Annuel', debut: '2024-02-10', fin: '2024-02-17', jours: 5, statut: 'Approuvé' },
  { id: '2', employe: 'Pierre Dubois', type: 'Maladie', debut: '2024-01-25', fin: '2024-01-26', jours: 2, statut: 'Approuvé' },
  { id: '3', employe: 'Marie Leroy', type: 'Annuel', debut: '2024-01-20', fin: '2024-02-05', jours: 12, statut: 'Approuvé' },
  { id: '4', employe: 'Jean Bernard', type: 'Exceptionnel', debut: '2024-02-01', fin: '2024-02-02', jours: 2, statut: 'En attente' },
];

const evaluations = [
  { id: '1', employe: 'Sophie Martin', evaluateur: 'Direction', date: '2024-01-15', note: 4.5, statut: 'Terminé' },
  { id: '2', employe: 'Pierre Dubois', evaluateur: 'CTO', date: '2024-01-10', note: 4.2, statut: 'Terminé' },
  { id: '3', employe: 'Marie Leroy', evaluateur: 'CFO', date: '2024-02-20', note: 0, statut: 'Planifié' },
];

const RessourcesHumainesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('employes');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => ({
    totalEmployes: employes.length,
    enConge: employes.filter(e => e.statut === 'Congé').length,
    masseSalariale: employes.reduce((acc, e) => acc + e.salaire, 0),
    congesEnAttente: conges.filter(c => c.statut === 'En attente').length,
  }), []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatutBadge = (statut: string) => {
    const config: Record<string, { color: string; icon: React.ReactNode }> = {
      'Actif': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="h-3 w-3" /> },
      'Inactif': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400', icon: <XCircle className="h-3 w-3" /> },
      'Congé': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <Calendar className="h-3 w-3" /> },
      'Maladie': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Heart className="h-3 w-3" /> },
      'Approuvé': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="h-3 w-3" /> },
      'Refusé': { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: <XCircle className="h-3 w-3" /> },
      'En attente': { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="h-3 w-3" /> },
      'Terminé': { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="h-3 w-3" /> },
      'Planifié': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: <Calendar className="h-3 w-3" /> },
    };
    const cfg = config[statut] || { color: 'bg-gray-100', icon: null };
    return (
      <Badge className={`${cfg.color} flex items-center gap-1`}>
        {cfg.icon}
        {statut}
      </Badge>
    );
  };

  const getContratBadge = (type: string) => {
    const colors: Record<string, string> = {
      'CDI': 'bg-green-100 text-green-800',
      'CDD': 'bg-blue-100 text-blue-800',
      'Stage': 'bg-purple-100 text-purple-800',
      'Alternance': 'bg-orange-100 text-orange-800',
      'Freelance': 'bg-pink-100 text-pink-800',
    };
    return <Badge className={colors[type] || 'bg-gray-100'}>{type}</Badge>;
  };

  const renderStars = (note: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${star <= note ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-sm font-medium">{note > 0 ? note.toFixed(1) : '-'}</span>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Ressources Humaines
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos employés, congés et évaluations
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Nouvel employé
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Total employés</p>
                    <p className="text-2xl font-bold text-emerald-600">{stats.totalEmployes}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">En congé</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.enConge}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Masse salariale</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(stats.masseSalariale)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Congés en attente</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.congesEnAttente}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <TabsTrigger value="employes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Employés</span>
              </TabsTrigger>
              <TabsTrigger value="conges" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Congés</span>
              </TabsTrigger>
              <TabsTrigger value="paie" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Paie</span>
              </TabsTrigger>
              <TabsTrigger value="evaluations" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline">Évaluations</span>
              </TabsTrigger>
            </TabsList>

            {/* Employés */}
            <TabsContent value="employes" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Liste des employés</CardTitle>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Rechercher..." 
                          className="pl-9"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    {employes.map((employe) => (
                      <div 
                        key={employe.id} 
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all"
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
                            {employe.prenom[0]}{employe.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{employe.prenom} {employe.nom}</h3>
                            {getContratBadge(employe.typeContrat)}
                            {getStatutBadge(employe.statut)}
                          </div>
                          <p className="text-sm text-muted-foreground">{employe.poste} • {employe.departement}</p>
                          <p className="text-xs text-muted-foreground mt-1">{employe.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(employe.salaire)}</p>
                          <p className="text-xs text-muted-foreground">/ mois</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Congés */}
            <TabsContent value="conges" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>Demandes de congés</CardTitle>
                    <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle demande
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {conges.map((conge) => (
                      <div 
                        key={conge.id} 
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border bg-card gap-3"
                      >
                        <div>
                          <p className="font-semibold">{conge.employe}</p>
                          <p className="text-sm text-muted-foreground">
                            {conge.type} • Du {conge.debut} au {conge.fin}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{conge.jours} jours</Badge>
                          {getStatutBadge(conge.statut)}
                          {conge.statut === 'En attente' && (
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Paie */}
            <TabsContent value="paie" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>Bulletins de paie - Janvier 2024</CardTitle>
                    <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Download className="h-4 w-4 mr-2" />
                      Générer tous les bulletins
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {employes.filter(e => e.typeContrat !== 'Stage').map((employe) => {
                      const cotisations = employe.salaire * 0.22;
                      const net = employe.salaire - cotisations;
                      return (
                        <div 
                          key={employe.id} 
                          className="p-4 rounded-lg border bg-card"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-semibold">{employe.prenom} {employe.nom}</p>
                              <p className="text-sm text-muted-foreground">{employe.poste}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">Validé</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-2 rounded bg-muted/50">
                              <p className="text-xs text-muted-foreground">Brut</p>
                              <p className="font-bold">{formatCurrency(employe.salaire)}</p>
                            </div>
                            <div className="p-2 rounded bg-red-50 dark:bg-red-900/20">
                              <p className="text-xs text-muted-foreground">Cotisations</p>
                              <p className="font-bold text-red-600">-{formatCurrency(cotisations)}</p>
                            </div>
                            <div className="p-2 rounded bg-green-50 dark:bg-green-900/20">
                              <p className="text-xs text-muted-foreground">Net</p>
                              <p className="font-bold text-green-600">{formatCurrency(net)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Évaluations */}
            <TabsContent value="evaluations" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle>Évaluations des performances</CardTitle>
                    <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Planifier une évaluation
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {evaluations.map((evaluation) => (
                      <div 
                        key={evaluation.id} 
                        className="p-4 rounded-lg border bg-card"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <p className="font-semibold">{evaluation.employe}</p>
                            <p className="text-sm text-muted-foreground">
                              Évalué par {evaluation.evaluateur} • {evaluation.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            {renderStars(evaluation.note)}
                            {getStatutBadge(evaluation.statut)}
                          </div>
                        </div>
                        {evaluation.note > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Performance globale</span>
                              <span>{((evaluation.note / 5) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={(evaluation.note / 5) * 100} className="h-2" />
                          </div>
                        )}
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

export default RessourcesHumainesPage;
