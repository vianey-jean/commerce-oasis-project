/**
 * CRMPage.tsx
 * Page de gestion de la relation client (CRM)
 * Pipeline de ventes, contacts, opportunités et activités
 */

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
  Building2,
  Phone,
  Mail,
  DollarSign,
  TrendingUp,
  Filter,
  Search,
  MoreHorizontal,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  Target,
  PieChart,
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Données de démonstration
const contacts = [
  {
    id: '1',
    nom: 'Martin',
    prenom: 'Sophie',
    entreprise: 'TechCorp SARL',
    email: 'sophie.martin@techcorp.fr',
    telephone: '+33 6 12 34 56 78',
    statut: 'Client',
    valeur: 45000,
    dernierContact: '2024-01-18',
    score: 85,
  },
  {
    id: '2',
    nom: 'Dubois',
    prenom: 'Pierre',
    entreprise: 'InnovaStart',
    email: 'p.dubois@innovastart.com',
    telephone: '+33 6 23 45 67 89',
    statut: 'Prospect',
    valeur: 25000,
    dernierContact: '2024-01-15',
    score: 65,
  },
  {
    id: '3',
    nom: 'Leroy',
    prenom: 'Marie',
    entreprise: 'Global Services',
    email: 'marie.leroy@globalservices.fr',
    telephone: '+33 6 34 56 78 90',
    statut: 'Lead',
    valeur: 15000,
    dernierContact: '2024-01-20',
    score: 45,
  },
  {
    id: '4',
    nom: 'Bernard',
    prenom: 'Jean',
    entreprise: 'DataFlow Inc',
    email: 'jbernard@dataflow.io',
    telephone: '+33 6 45 67 89 01',
    statut: 'Client',
    valeur: 78000,
    dernierContact: '2024-01-19',
    score: 92,
  },
];

const opportunites = [
  { id: '1', nom: 'Contrat annuel TechCorp', contact: 'Sophie Martin', valeur: 45000, probabilite: 80, etape: 'Négociation', dateCloturePrevu: '2024-02-28' },
  { id: '2', nom: 'Projet pilote InnovaStart', contact: 'Pierre Dubois', valeur: 12000, probabilite: 50, etape: 'Proposition', dateCloturePrevu: '2024-03-15' },
  { id: '3', nom: 'Extension DataFlow', contact: 'Jean Bernard', valeur: 35000, probabilite: 90, etape: 'Closing', dateCloturePrevu: '2024-02-10' },
  { id: '4', nom: 'Audit Global Services', contact: 'Marie Leroy', valeur: 8000, probabilite: 30, etape: 'Qualification', dateCloturePrevu: '2024-04-01' },
];

const pipeline = {
  'Lead': { count: 24, value: 120000, color: 'bg-gray-500' },
  'Qualification': { count: 18, value: 95000, color: 'bg-blue-500' },
  'Proposition': { count: 12, value: 180000, color: 'bg-yellow-500' },
  'Négociation': { count: 8, value: 240000, color: 'bg-orange-500' },
  'Closing': { count: 5, value: 175000, color: 'bg-green-500' },
};

const activites = [
  { id: '1', type: 'Appel', contact: 'Sophie Martin', date: '2024-01-20 14:30', description: 'Suivi contrat annuel', statut: 'Planifié' },
  { id: '2', type: 'Email', contact: 'Pierre Dubois', date: '2024-01-19 10:00', description: 'Envoi proposition commerciale', statut: 'Terminé' },
  { id: '3', type: 'Réunion', contact: 'Jean Bernard', date: '2024-01-22 09:00', description: 'Présentation nouveaux services', statut: 'Planifié' },
  { id: '4', type: 'Appel', contact: 'Marie Leroy', date: '2024-01-18 16:00', description: 'Premier contact', statut: 'Terminé' },
];

const CRMPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => ({
    totalContacts: contacts.length,
    totalOpportunites: opportunites.length,
    pipelineValue: Object.values(pipeline).reduce((acc, p) => acc + p.value, 0),
    tauxConversion: 23,
  }), []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getStatutBadge = (statut: string) => {
    const config: Record<string, string> = {
      'Client': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Prospect': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Lead': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
      'Inactif': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return <Badge className={config[statut] || ''}>{statut}</Badge>;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Appel': return <Phone className="h-4 w-4 text-blue-600" />;
      case 'Email': return <Mail className="h-4 w-4 text-purple-600" />;
      case 'Réunion': return <Calendar className="h-4 w-4 text-green-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50 to-pink-50 dark:from-gray-900 dark:via-slate-900 dark:to-rose-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                CRM - Relation Client
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos contacts, opportunités et activités commerciales
              </p>
            </div>
            <Button size="sm" className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Nouveau contact
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalContacts}</p>
                    <p className="text-xs text-muted-foreground">Contacts</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalOpportunites}</p>
                    <p className="text-xs text-muted-foreground">Opportunités</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{formatCurrency(stats.pipelineValue)}</p>
                    <p className="text-xs text-muted-foreground">Pipeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.tauxConversion}%</p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pipeline visuel */}
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-rose-600" />
                Pipeline de ventes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(pipeline).map(([etape, data], index) => (
                  <div key={etape} className="text-center">
                    <div className={`h-2 rounded-full ${data.color} mb-2`} />
                    <p className="text-sm font-medium">{etape}</p>
                    <p className="text-xl font-bold">{data.count}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(data.value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <TabsList className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <TabsTrigger value="contacts" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Contacts
                </TabsTrigger>
                <TabsTrigger value="opportunites" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Opportunités
                </TabsTrigger>
                <TabsTrigger value="activites" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Activités
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

            {/* Contacts */}
            <TabsContent value="contacts" className="space-y-4">
              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-all">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-br from-rose-500 to-pink-500 text-white">
                            {contact.prenom[0]}{contact.nom[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{contact.prenom} {contact.nom}</h3>
                            {getStatutBadge(contact.statut)}
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs font-medium">{contact.score}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <Building2 className="h-3 w-3" />
                            <span>{contact.entreprise}</span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {contact.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {contact.telephone}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-rose-600">{formatCurrency(contact.valeur)}</p>
                            <p className="text-xs text-muted-foreground">Valeur client</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Voir profil</DropdownMenuItem>
                              <DropdownMenuItem>Ajouter note</DropdownMenuItem>
                              <DropdownMenuItem>Planifier activité</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Opportunités */}
            <TabsContent value="opportunites" className="space-y-4">
              <div className="grid gap-4">
                {opportunites.map((opp) => (
                  <Card key={opp.id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-lg">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{opp.nom}</h3>
                          <p className="text-sm text-muted-foreground">{opp.contact}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">{opp.etape}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Clôture prévue: {opp.dateCloturePrevu}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xl font-bold text-rose-600">{formatCurrency(opp.valeur)}</p>
                            <p className="text-xs text-muted-foreground">Valeur</p>
                          </div>
                          <div className="w-24">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Probabilité</span>
                              <span>{opp.probabilite}%</span>
                            </div>
                            <Progress value={opp.probabilite} className="h-2" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Activités */}
            <TabsContent value="activites" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Activités récentes</CardTitle>
                    <Button size="sm" className="bg-gradient-to-r from-rose-600 to-pink-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Planifier
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {activites.map((activite) => (
                    <div key={activite.id} className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        {getActivityIcon(activite.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{activite.type}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{activite.contact}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{activite.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{activite.date}</p>
                        <Badge 
                          className={activite.statut === 'Terminé' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                          }
                        >
                          {activite.statut === 'Terminé' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                          {activite.statut}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default CRMPage;
