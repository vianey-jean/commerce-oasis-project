import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign, 
  Package, 
  AlertTriangle,
  Clock,
  Target,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { useRealtimeSync } from '@/hooks/use-realtime-sync';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

const TendancesPage = () => {
  const { sales, products, allSales } = useApp();
  const { forceSync } = useRealtimeSync();
  const [selectedTab, setSelectedTab] = useState('daily');

  // Date actuelle
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Filtrer les ventes pour le mois en cours
  const currentMonthSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
    });
  }, [sales, currentMonth, currentYear]);

  // Calcul du revenu total du mois
  const totalRevenue = useMemo(() => {
    return currentMonthSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
  }, [currentMonthSales]);

  // Calcul du profit total du mois
  const totalProfit = useMemo(() => {
    return currentMonthSales.reduce((sum, sale) => sum + sale.profit, 0);
  }, [currentMonthSales]);

  // Calcul des nouvelles ventes
  const newSalesCount = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return currentMonthSales.filter(sale => new Date(sale.date) >= today).length;
  }, [currentMonthSales]);

  // Stock critique
  const criticalStockProducts = useMemo(() => {
    return products.filter(product => product.quantity <= 5);
  }, [products]);

  // AI Recommandations - Top 12 produits les plus profitables
  const buyingRecommendations = useMemo(() => {
    if (!allSales.length || !products.length) return [];

    // Grouper les ventes par produit
    const productSales = allSales.reduce((acc, sale) => {
      const key = sale.productId;
      if (!acc[key]) {
        acc[key] = {
          productId: sale.productId,
          description: sale.description,
          sales: [],
          totalProfit: 0,
          totalRevenue: 0,
          totalCost: 0,
          count: 0
        };
      }
      
      acc[key].sales.push(sale);
      acc[key].totalProfit += sale.profit;
      acc[key].totalRevenue += sale.sellingPrice;
      acc[key].totalCost += sale.purchasePrice * (sale.quantitySold || 1);
      acc[key].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    // Calculer le ROI et créer les recommandations
    const recommendations = Object.values(productSales)
      .map((item: any) => {
        const avgProfit = item.totalProfit / item.count;
        const avgCost = item.totalCost / item.count;
        const roi = avgCost > 0 ? Math.round((avgProfit / avgCost) * 100) : 0;
        
        // Catégoriser les produits
        let category = 'Autre';
        const desc = item.description.toLowerCase();
        if (desc.includes('perruque')) category = 'Perruques';
        else if (desc.includes('tissage')) category = 'Tissages';
        else if (desc.includes('avance')) category = 'Avances';
        else if (desc.includes('colle') || desc.includes('disolvant')) category = 'Accessoires';

        return {
          name: item.description.length > 45 ? 
                item.description.substring(0, 45) + '...' : 
                item.description,
          fullName: item.description,
          roi: roi,
          benefice: item.totalProfit,
          avgProfit: avgProfit.toFixed(2),
          prixAchat: item.totalCost,
          count: item.count,
          category: category,
          totalRevenue: item.totalRevenue
        };
      })
      .filter(item => item.roi > 0 && item.count >= 1) // Minimum 1 vente et ROI positif
      .sort((a, b) => {
        // Trier par ROI d'abord, puis par bénéfice total
        if (b.roi !== a.roi) return b.roi - a.roi;
        return b.benefice - a.benefice;
      })
      .slice(0, 12); // Top 12

    return recommendations;
  }, [allSales, products]);

  // Performance globale (chiffre d'affaires et profit)
  const performanceData = useMemo(() => {
    const initialDate = new Date(Math.min(...sales.map(sale => new Date(sale.date).getTime())));
    const months = [];
    let currentDate = new Date(initialDate);

    while (currentDate <= now) {
      months.push({
        month: currentDate.getMonth(),
        year: currentDate.getFullYear()
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return months.map(({ month, year }) => {
      const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
      const monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate.getMonth() === month && saleDate.getFullYear() === year;
      });

      const monthlyRevenue = monthSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
      const monthlyProfit = monthSales.reduce((sum, sale) => sum + sale.profit, 0);

      return {
        name: `${monthName} ${year}`,
        revenue: monthlyRevenue,
        profit: monthlyProfit
      };
    });
  }, [sales]);

  // Meilleurs créneaux de vente
  const topSellingTimes = useMemo(() => {
    const hourlySales = Array(24).fill(0);
    currentMonthSales.forEach(sale => {
      const saleDate = new Date(sale.date);
      const hour = saleDate.getHours();
      hourlySales[hour] += sale.sellingPrice;
    });

    return hourlySales.map((revenue, hour) => ({
      hour: `${hour}:00`,
      revenue: revenue
    }));
  }, [currentMonthSales]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tendances & Analyses</h1>
          <p className="text-muted-foreground">
            Analyse détaillée de vos performances commerciales
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="daily">Analyse Quotidienne</TabsTrigger>
          <TabsTrigger value="stock">Stock Critique</TabsTrigger>
          <TabsTrigger value="recommendations">IA Recommandations</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="time">Créneaux</TabsTrigger>
        </TabsList>

        {/* Analyse Quotidienne */}
        <TabsContent value="daily" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Revenu Total</CardTitle>
                <CardDescription>Revenu du mois actuel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} €</div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>+{totalRevenue}% depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Profit Total</CardTitle>
                <CardDescription>Profit du mois actuel</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalProfit.toFixed(2)} €</div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>+{totalProfit}% depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Nouvelles Ventes</CardTitle>
                <CardDescription>Ventes aujourd'hui</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{newSalesCount}</div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span>+{newSalesCount} depuis hier</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Taux de conversion</CardTitle>
                <CardDescription>Pourcentage de visiteurs convertis en clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.5%</div>
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span>-2% depuis le mois dernier</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Ventes du mois</CardTitle>
              <CardDescription>Répartition des ventes par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={currentMonthSales.map(sale => ({
                  name: new Date(sale.date).toLocaleDateString(),
                  revenue: sale.sellingPrice,
                  profit: sale.profit
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#8884d8" name="Revenu" />
                  <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Critique */}
        <TabsContent value="stock" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Stock Critique
              </CardTitle>
              <CardDescription>Produits avec un stock faible</CardDescription>
            </CardHeader>
            <CardContent>
              {criticalStockProducts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Produit
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Quantité
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Prix d'achat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {criticalStockProducts.map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {product.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {product.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {product.purchasePrice} €
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            <Button size="sm">Réapprovisionner</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucun produit en stock critique pour le moment.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* IA Recommandations - Top 12 produits */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card className="bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border-emerald-200 dark:border-emerald-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
                Recommandations d'Achat Intelligentes (Top 12)
              </CardTitle>
              <CardDescription>Produits à privilégier pour maximiser vos bénéfices (basé sur le ROI historique)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {buyingRecommendations.map((product, index) => (
                  <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          index === 0 ? "bg-yellow-400" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-orange-400" : "bg-emerald-400"
                        )}></div>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white">#{index + 1}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-600">+{product.roi}%</div>
                        <div className="text-xs text-gray-500">ROI</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2" title={product.fullName}>
                      {product.name}
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bénéfice total:</span>
                        <span className="font-semibold text-emerald-600">{product.benefice.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Bénéfice moyen:</span>
                        <span className="font-semibold text-emerald-500">{product.avgProfit} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Prix d'achat:</span>
                        <span className="font-semibold">{(product.prixAchat / product.count).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Vendus:</span>
                        <span className="font-semibold text-blue-600">{product.count}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Catégorie:</span>
                        <span className="font-semibold text-purple-600">{product.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {buyingRecommendations.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Pas encore assez de données pour générer des recommandations.
                    <br />
                    Continuez à enregistrer vos ventes !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Performance Globale</CardTitle>
              <CardDescription>Chiffre d'affaires et profit par mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenu" />
                  <Line type="monotone" dataKey="profit" stroke="#82ca9d" name="Profit" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meilleurs créneaux de vente */}
        <TabsContent value="time" className="space-y-6">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-gray-200 dark:border-gray-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Meilleurs Créneaux de Vente</CardTitle>
              <CardDescription>Heures avec le plus de ventes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={topSellingTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#f39c12" name="Revenu" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TendancesPage;
