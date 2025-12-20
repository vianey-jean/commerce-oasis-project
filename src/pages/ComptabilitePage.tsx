import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calculator,
  Download,
  Filter,
  Search,
  Plus,
  PieChart,
  BarChart3,
  Receipt,
  FileSpreadsheet,
  Wallet,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Données de démonstration
const bilanData = {
  actifs: {
    immobilisations: 150000,
    stocks: 45000,
    creances: 32000,
    tresorerie: 28000,
  },
  passifs: {
    capitauxPropres: 180000,
    emprunts: 50000,
    dettesFournisseurs: 20000,
    autresDettes: 5000,
  }
};

const journalEntries = [
  { id: '1', date: '2024-01-15', compte: '411', libelle: 'Vente client ABC', debit: 0, credit: 5000 },
  { id: '2', date: '2024-01-15', compte: '512', libelle: 'Encaissement client ABC', debit: 5000, credit: 0 },
  { id: '3', date: '2024-01-16', compte: '607', libelle: 'Achat marchandises', debit: 2500, credit: 0 },
  { id: '4', date: '2024-01-16', compte: '401', libelle: 'Fournisseur XYZ', debit: 0, credit: 2500 },
  { id: '5', date: '2024-01-18', compte: '512', libelle: 'Règlement fournisseur', debit: 0, credit: 2500 },
  { id: '6', date: '2024-01-18', compte: '401', libelle: 'Paiement fournisseur XYZ', debit: 2500, credit: 0 },
];

const factures = [
  { id: '1', numero: 'FAC-2024-001', client: 'Entreprise ABC', montant: 5000, statut: 'Payée', date: '2024-01-15' },
  { id: '2', numero: 'FAC-2024-002', client: 'Société DEF', montant: 3200, statut: 'Envoyée', date: '2024-01-18' },
  { id: '3', numero: 'FAC-2024-003', client: 'Client GHI', montant: 1800, statut: 'En retard', date: '2024-01-10' },
  { id: '4', numero: 'FAC-2024-004', client: 'Partenaire JKL', montant: 7500, statut: 'Brouillon', date: '2024-01-20' },
];

const rapportsFiscaux = {
  tvaCollectee: 8500,
  tvaDeductible: 3200,
  tvaNette: 5300,
  chiffreAffaires: 42500,
  charges: 28000,
  resultat: 14500,
};

const ComptabilitePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('bilan');
  const [searchTerm, setSearchTerm] = useState('');

  const totalActifs = useMemo(() => 
    Object.values(bilanData.actifs).reduce((a, b) => a + b, 0), []
  );

  const totalPassifs = useMemo(() => 
    Object.values(bilanData.passifs).reduce((a, b) => a + b, 0), []
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount);
  };

  const getStatutBadge = (statut: string) => {
    const colors: Record<string, string> = {
      'Payée': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      'Envoyée': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'En retard': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Brouillon': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return <Badge className={colors[statut] || ''}>{statut}</Badge>;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Comptabilité
              </h1>
              <p className="text-muted-foreground mt-1">
                Gérez vos finances et suivez votre comptabilité
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle écriture
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
                    <p className="text-xl font-bold text-green-600">{formatCurrency(rapportsFiscaux.chiffreAffaires)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Charges</p>
                    <p className="text-xl font-bold text-red-600">{formatCurrency(rapportsFiscaux.charges)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Résultat Net</p>
                    <p className="text-xl font-bold text-blue-600">{formatCurrency(rapportsFiscaux.resultat)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">TVA à payer</p>
                    <p className="text-xl font-bold text-purple-600">{formatCurrency(rapportsFiscaux.tvaNette)}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Calculator className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
              <TabsTrigger value="bilan" className="flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Bilan</span>
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Journal</span>
              </TabsTrigger>
              <TabsTrigger value="factures" className="flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                <span className="hidden sm:inline">Factures</span>
              </TabsTrigger>
              <TabsTrigger value="fiscal" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                <span className="hidden sm:inline">Fiscal</span>
              </TabsTrigger>
            </TabsList>

            {/* Bilan Financier */}
            <TabsContent value="bilan" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Actifs */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader className="border-b bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <ArrowUpRight className="h-5 w-5" />
                      Actifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {Object.entries(bilanData.actifs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-semibold text-green-600">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t-2">
                      <span className="font-bold">Total Actifs</span>
                      <span className="font-bold text-lg text-green-700">{formatCurrency(totalActifs)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Passifs */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader className="border-b bg-gradient-to-r from-red-500/10 to-rose-500/10">
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                      <ArrowDownRight className="h-5 w-5" />
                      Passifs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    {Object.entries(bilanData.passifs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-dashed last:border-0">
                        <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="font-semibold text-red-600">{formatCurrency(value)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3 border-t-2">
                      <span className="font-bold">Total Passifs</span>
                      <span className="font-bold text-lg text-red-700">{formatCurrency(totalPassifs)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Équilibre */}
              <Card className={`border-0 shadow-xl ${totalActifs === totalPassifs ? 'bg-green-50 dark:bg-green-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium">Équilibre du bilan</span>
                  <Badge className={totalActifs === totalPassifs ? 'bg-green-500' : 'bg-yellow-500'}>
                    {totalActifs === totalPassifs ? 'Équilibré ✓' : 'Déséquilibre'}
                  </Badge>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Journal Comptable */}
            <TabsContent value="journal" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Journal des écritures</CardTitle>
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
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Compte</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Libellé</th>
                          <th className="px-4 py-3 text-right text-xs font-medium">Débit</th>
                          <th className="px-4 py-3 text-right text-xs font-medium">Crédit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {journalEntries.map((entry) => (
                          <tr key={entry.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 text-sm">{entry.date}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline">{entry.compte}</Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">{entry.libelle}</td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-green-600">
                              {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-medium text-red-600">
                              {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Factures */}
            <TabsContent value="factures" className="space-y-4">
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                <CardHeader className="border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <CardTitle>Gestion des factures</CardTitle>
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600">
                      <Plus className="h-4 w-4 mr-2" />
                      Nouvelle facture
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-4">
                    {factures.map((facture) => (
                      <div 
                        key={facture.id} 
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border bg-card hover:shadow-md transition-all gap-3"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Receipt className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{facture.numero}</p>
                            <p className="text-sm text-muted-foreground">{facture.client}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(facture.montant)}</p>
                            <p className="text-xs text-muted-foreground">{facture.date}</p>
                          </div>
                          {getStatutBadge(facture.statut)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rapports Fiscaux */}
            <TabsContent value="fiscal" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                {/* TVA */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-purple-600" />
                      Déclaration TVA
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span>TVA Collectée</span>
                      <span className="font-semibold text-red-600">{formatCurrency(rapportsFiscaux.tvaCollectee)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>TVA Déductible</span>
                      <span className="font-semibold text-green-600">{formatCurrency(rapportsFiscaux.tvaDeductible)}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg px-3">
                      <span className="font-bold">TVA Nette</span>
                      <span className="font-bold text-purple-600">{formatCurrency(rapportsFiscaux.tvaNette)}</span>
                    </div>
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger la déclaration
                    </Button>
                  </CardContent>
                </Card>

                {/* Résumé fiscal */}
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Résumé fiscal annuel
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex justify-between py-2 border-b">
                      <span>Chiffre d'affaires</span>
                      <span className="font-semibold">{formatCurrency(rapportsFiscaux.chiffreAffaires)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Total des charges</span>
                      <span className="font-semibold text-red-600">{formatCurrency(rapportsFiscaux.charges)}</span>
                    </div>
                    <div className="flex justify-between py-2 bg-green-50 dark:bg-green-900/20 rounded-lg px-3">
                      <span className="font-bold">Résultat imposable</span>
                      <span className="font-bold text-green-600">{formatCurrency(rapportsFiscaux.resultat)}</span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Générer le rapport complet
                    </Button>
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

export default ComptabilitePage;
