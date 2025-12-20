/**
 * KPIDashboardPage.tsx
 * Page de tableau de bord KPI avancé
 * Affiche les indicateurs clés de performance de l'entreprise
 */

import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Activity,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Percent,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Données de démonstration pour les KPIs
const salesData = [
  { month: 'Jan', ventes: 45000, objectif: 40000, clients: 120 },
  { month: 'Fév', ventes: 52000, objectif: 45000, clients: 135 },
  { month: 'Mar', ventes: 48000, objectif: 50000, clients: 128 },
  { month: 'Avr', ventes: 61000, objectif: 55000, clients: 156 },
  { month: 'Mai', ventes: 55000, objectif: 55000, clients: 142 },
  { month: 'Juin', ventes: 67000, objectif: 60000, clients: 178 },
];

const categoryData = [
  { name: 'Électronique', value: 35, color: '#8884d8' },
  { name: 'Mode', value: 25, color: '#82ca9d' },
  { name: 'Maison', value: 20, color: '#ffc658' },
  { name: 'Sport', value: 12, color: '#ff7300' },
  { name: 'Autres', value: 8, color: '#00C49F' },
];

const performanceMetrics = [
  { label: 'Taux de conversion', value: 3.2, target: 3.5, unit: '%', trend: 'up' },
  { label: 'Panier moyen', value: 85, target: 90, unit: '€', trend: 'up' },
  { label: 'Taux de rétention', value: 68, target: 75, unit: '%', trend: 'down' },
  { label: 'NPS Score', value: 42, target: 50, unit: '', trend: 'up' },
  { label: 'Temps réponse', value: 2.4, target: 2, unit: 'h', trend: 'down' },
  { label: 'Satisfaction client', value: 4.2, target: 4.5, unit: '/5', trend: 'up' },
];

const KPIDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Calculs des totaux
  const totals = useMemo(() => ({
    totalVentes: salesData.reduce((acc, d) => acc + d.ventes, 0),
    totalObjectif: salesData.reduce((acc, d) => acc + d.objectif, 0),
    totalClients: salesData.reduce((acc, d) => acc + d.clients, 0),
    avgGrowth: 12.5,
  }), []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const getProgressColor = (value: number, target: number) => {
    const ratio = value / target;
    if (ratio >= 1) return 'bg-green-500';
    if (ratio >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-violet-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Tableau de Bord KPI
              </h1>
              <p className="text-muted-foreground mt-1">
                Suivez vos indicateurs clés de performance en temps réel
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualiser
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>

          {/* Période de sélection */}
          <div className="flex gap-2 mb-6">
            {['week', 'month', 'quarter', 'year'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? 'bg-gradient-to-r from-violet-600 to-purple-600' : ''}
              >
                {period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : period === 'quarter' ? 'Trimestre' : 'Année'}
              </Button>
            ))}
          </div>

          {/* KPI Cards principaux */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
                    <p className="text-xl sm:text-2xl font-bold text-violet-600">{formatCurrency(totals.totalVentes)}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+{totals.avgGrowth}%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Clients actifs</p>
                    <p className="text-xl sm:text-2xl font-bold text-emerald-600">{totals.totalClients}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+8.3%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Commandes</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">1,247</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUpRight className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">+15.2%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Objectif atteint</p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600">87%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowDownRight className="h-3 w-3 text-red-500" />
                      <span className="text-xs text-red-600">-2.1%</span>
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs pour les différentes vues */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="sales" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Ventes</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytique</span>
              </TabsTrigger>
            </TabsList>

            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Graphique des ventes */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-violet-600" />
                      Évolution des ventes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData}>
                          <defs>
                            <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: 'rgba(255,255,255,0.9)', 
                              borderRadius: '12px',
                              border: 'none',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ventes" 
                            stroke="#8b5cf6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorVentes)" 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="objectif" 
                            stroke="#f59e0b" 
                            strokeWidth={2}
                            strokeDasharray="5 5"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Répartition par catégorie */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-violet-600" />
                      Répartition par catégorie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Legend />
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Ventes */}
            <TabsContent value="sales" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Comparaison Ventes vs Objectifs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: number) => formatCurrency(value)}
                          contentStyle={{ 
                            backgroundColor: 'rgba(255,255,255,0.9)', 
                            borderRadius: '12px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                        <Legend />
                        <Bar dataKey="ventes" name="Ventes" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="objectif" name="Objectif" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-sm text-muted-foreground">{metric.label}</p>
                        <Badge 
                          className={metric.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                        >
                          {metric.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold">{metric.value}</span>
                        <span className="text-sm text-muted-foreground">{metric.unit}</span>
                      </div>
                      <div className="space-y-1">
                        <Progress 
                          value={(metric.value / metric.target) * 100} 
                          className={`h-2 ${getProgressColor(metric.value, metric.target)}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          Objectif: {metric.target}{metric.unit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytique */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Alertes & Insights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Objectif mensuel dépassé</p>
                        <p className="text-xs text-muted-foreground">Les ventes de juin ont dépassé l'objectif de 11.7%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Stock faible détecté</p>
                        <p className="text-xs text-muted-foreground">3 produits ont un stock inférieur au seuil critique</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Tendance positive</p>
                        <p className="text-xs text-muted-foreground">Le taux de conversion a augmenté de 5% cette semaine</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle>Top Produits</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {['iPhone 15 Pro', 'MacBook Air M3', 'AirPods Pro', 'Apple Watch', 'iPad Pro'].map((product, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                            {i + 1}
                          </div>
                          <span className="text-sm font-medium">{product}</span>
                        </div>
                        <Badge variant="outline">{Math.floor(Math.random() * 200 + 50)} ventes</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default KPIDashboardPage;
