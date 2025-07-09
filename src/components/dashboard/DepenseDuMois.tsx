
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, TrendingDown, Calculator, AlertTriangle, Target } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import useCurrencyFormatter from '@/hooks/use-currency-formatter';
import ProfitCalculator from './ProfitCalculator';
import { format } from 'date-fns';

const DepenseDuMois: React.FC = () => {
  const { formatEuro } = useCurrencyFormatter();
  const [depenses, setDepenses] = useState([]);
  const [totalDepenses, setTotalDepenses] = useState(0);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Simulation des données de dépenses
  useEffect(() => {
    const simulatedExpenses = [
      { id: 1, description: 'Loyer boutique', montant: 800, date: new Date(), type: 'Fixe' },
      { id: 2, description: 'Électricité', montant: 120, date: new Date(), type: 'Fixe' },
      { id: 3, description: 'Transport marchandises', montant: 250, date: new Date(), type: 'Variable' },
      { id: 4, description: 'Publicité Facebook', montant: 150, date: new Date(), type: 'Marketing' },
      { id: 5, description: 'Assurance', montant: 85, date: new Date(), type: 'Fixe' }
    ];
    
    setDepenses(simulatedExpenses);
    setTotalDepenses(simulatedExpenses.reduce((sum, exp) => sum + exp.montant, 0));
  }, []);

  const depensesParType = depenses.reduce((acc, depense) => {
    acc[depense.type] = (acc[depense.type] || 0) + depense.montant;
    return acc;
  }, {});

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Fixe': return 'bg-blue-500';
      case 'Variable': return 'bg-orange-500';
      case 'Marketing': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Calculateur de Bénéfices avec prise en compte des dépenses */}
      <ProfitCalculator 
        compact={true} 
        initialValues={selectedExpense ? { autresFrais: selectedExpense.montant } : {}}
      />
      
      {/* Statistiques des dépenses */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4" />
              Total Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(totalDepenses)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Dépenses Fixes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(depensesParType['Fixe'] || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Dépenses Variables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(depensesParType['Variable'] || 0)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Marketing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatEuro(depensesParType['Marketing'] || 0)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des dépenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Dépenses du Mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {depenses.map((depense) => (
              <div 
                key={depense.id} 
                className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => setSelectedExpense(depense)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{depense.description}</p>
                      <p className="text-sm text-gray-500">{format(depense.date, 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${getTypeColor(depense.type)} text-white`}>
                    {depense.type}
                  </Badge>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatEuro(depense.montant)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse d'impact sur les bénéfices */}
      <Card className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Calculator className="h-5 w-5" />
            Impact sur les Bénéfices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600">Dépenses totales</p>
              <p className="text-2xl font-bold text-red-600">{formatEuro(totalDepenses)}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600">CA minimum nécessaire</p>
              <p className="text-2xl font-bold text-blue-600">{formatEuro(totalDepenses * 1.5)}</p>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-600">Objectif recommandé</p>
              <p className="text-2xl font-bold text-green-600">{formatEuro(totalDepenses * 2)}</p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              💡 <strong>Conseil:</strong> Pour couvrir vos dépenses de {formatEuro(totalDepenses)} 
              et avoir une marge confortable, visez un chiffre d'affaires d'au moins {formatEuro(totalDepenses * 2)}.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepenseDuMois;
