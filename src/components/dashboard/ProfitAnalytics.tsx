
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { TrendingUp, AlertTriangle, Target, DollarSign } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import useCurrencyFormatter from '@/hooks/use-currency-formatter';

interface ProfitAnalyticsProps {
  className?: string;
}

const ProfitAnalytics: React.FC<ProfitAnalyticsProps> = ({ className }) => {
  const { allSales, products } = useApp();
  const { formatEuro } = useCurrencyFormatter();

  // Analyse des marges par produit
  const productProfitAnalysis = useMemo(() => {
    const productStats = allSales.reduce((acc, sale) => {
      if (!acc[sale.productId]) {
        acc[sale.productId] = {
          productId: sale.productId,
          description: sale.description,
          totalVentes: 0,
          totalCout: 0,
          totalBenefice: 0,
          quantiteVendue: 0,
          count: 0
        };
      }
      
      acc[sale.productId].totalVentes += sale.sellingPrice;
      acc[sale.productId].totalCout += sale.purchasePrice;
      acc[sale.productId].totalBenefice += sale.profit;
      acc[sale.productId].quantiteVendue += sale.quantitySold;
      acc[sale.productId].count += 1;
      
      return acc;
    }, {} as Record<string, any>);

    return Object.values(productStats)
      .map((item: any) => ({
        ...item,
        margeMoyenne: item.totalCout > 0 ? (item.totalBenefice / item.totalCout) * 100 : 0,
        beneficeMoyen: item.count > 0 ? item.totalBenefice / item.count : 0
      }))
      .sort((a, b) => b.margeMoyenne - a.margeMoyenne)
      .slice(0, 10);
  }, [allSales]);

  // Analyse des catégories de marge
  const margeCategories = useMemo(() => {
    const categories = {
      'Très rentable (>30%)': { count: 0, benefice: 0, color: '#10B981' },
      'Rentable (20-30%)': { count: 0, benefice: 0, color: '#F59E0B' },
      'Peu rentable (10-20%)': { count: 0, benefice: 0, color: '#EF4444' },
      'Non rentable (<10%)': { count: 0, benefice: 0, color: '#6B7280' }
    };

    productProfitAnalysis.forEach(product => {
      if (product.margeMoyenne > 30) {
        categories['Très rentable (>30%)'].count++;
        categories['Très rentable (>30%)'].benefice += product.totalBenefice;
      } else if (product.margeMoyenne > 20) {
        categories['Rentable (20-30%)'].count++;
        categories['Rentable (20-30%)'].benefice += product.totalBenefice;
      } else if (product.margeMoyenne > 10) {
        categories['Peu rentable (10-20%)'].count++;
        categories['Peu rentable (10-20%)'].benefice += product.totalBenefice;
      } else {
        categories['Non rentable (<10%)'].count++;
        categories['Non rentable (<10%)'].benefice += product.totalBenefice;
      }
    });

    return Object.entries(categories).map(([name, data]) => ({
      name,
      value: data.count,
      benefice: data.benefice,
      color: data.color
    }));
  }, [productProfitAnalysis]);

  // Produits à optimiser
  const produitsAOptimiser = useMemo(() => {
    return productProfitAnalysis
      .filter(product => product.margeMoyenne < 20)
      .sort((a, b) => b.totalVentes - a.totalVentes)
      .slice(0, 5);
  }, [productProfitAnalysis]);

  // Stats globales
  const statsGlobales = useMemo(() => {
    const totalVentes = allSales.reduce((sum, sale) => sum + sale.sellingPrice, 0);
    const totalCouts = allSales.reduce((sum, sale) => sum + sale.purchasePrice, 0);
    const totalBenefices = allSales.reduce((sum, sale) => sum + sale.profit, 0);
    const margeMoyenne = totalCouts > 0 ? (totalBenefices / totalCouts) * 100 : 0;

    return {
      totalVentes,
      totalCouts,
      totalBenefices,
      margeMoyenne,
      produitsRentables: productProfitAnalysis.filter(p => p.margeMoyenne >= 20).length,
      totalProduits: productProfitAnalysis.length
    };
  }, [allSales, productProfitAnalysis]);

  return (
    <div className={className}>
      {/* Stats globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Marge Moyenne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsGlobales.margeMoyenne.toFixed(1)}%</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Bénéfices Totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(statsGlobales.totalBenefices)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Produits Rentables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsGlobales.produitsRentables}/{statsGlobales.totalProduits}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              À Optimiser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{produitsAOptimiser.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des marges par produit */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 - Marges par Produit</CardTitle>
            <CardDescription>Analyse des marges bénéficiaires par produit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productProfitAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="description" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={10}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Marge']}
                    labelFormatter={(label) => `Produit: ${label}`}
                  />
                  <Bar dataKey="margeMoyenne" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Répartition des catégories de marge */}
        <Card>
          <CardHeader>
            <CardTitle>Répartition des Marges</CardTitle>
            <CardDescription>Distribution des produits par catégorie de rentabilité</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={margeCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {margeCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Produits à optimiser */}
      {produitsAOptimiser.length > 0 && (
        <Card className="mt-6 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertTriangle className="h-5 w-5" />
              Produits à Optimiser (Marge &lt; 20%)
            </CardTitle>
            <CardDescription>
              Ces produits génèrent beaucoup de ventes mais ont une marge faible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {produitsAOptimiser.map((product, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.description}</p>
                    <p className="text-xs text-gray-500">
                      {product.count} ventes • {formatEuro(product.totalVentes)} CA
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-orange-600">
                      {product.margeMoyenne.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatEuro(product.totalBenefice)} bénéfice
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfitAnalytics;
