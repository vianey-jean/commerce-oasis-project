import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  Wallet,
  Package,
  Receipt,
  PiggyBank
} from 'lucide-react';
import { ComptabiliteData } from '@/types/comptabilite';

interface ComptaStatsCardsProps {
  data: ComptabiliteData;
  formatEuro: (value: number) => string;
  onCreditClick?: () => void;
  onDebitClick?: () => void;
  onBeneficeVentesClick?: () => void;
  onBeneficeReelClick?: () => void;
}

export const ComptaStatsCards: React.FC<ComptaStatsCardsProps> = ({
  data,
  formatEuro,
  onCreditClick,
  onDebitClick,
  onBeneficeVentesClick,
  onBeneficeReelClick
}) => {
  return (
    <>
      {/* Cartes principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className="bg-gradient-to-br from-green-500/20 to-emerald-600/20 border-green-500/30 shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={onCreditClick}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Total Crédit</p>
                <p className="text-2xl font-bold text-green-500">{formatEuro(data.totalCredit)}</p>
                <p className="text-xs text-green-400/70">Argent entrant</p>
              </div>
              <ArrowUpCircle className="h-10 w-10 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-red-500/20 to-rose-600/20 border-red-500/30 shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={onDebitClick}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Total Débit</p>
                <p className="text-2xl font-bold text-red-500">{formatEuro(data.totalDebit)}</p>
                <p className="text-xs text-red-400/70">Argent sortant</p>
              </div>
              <ArrowDownCircle className="h-10 w-10 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border-blue-500/30 shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300"
          onClick={onBeneficeVentesClick}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Bénéfice Ventes</p>
                <p className="text-2xl font-bold text-blue-500">{formatEuro(data.salesProfit)}</p>
                <p className="text-xs text-blue-400/70">{data.salesCount} ventes</p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className={`bg-gradient-to-br ${data.beneficeReel >= 0 ? 'from-emerald-500/20 to-teal-600/20 border-emerald-500/30' : 'from-red-500/20 to-rose-600/20 border-red-500/30'} shadow-xl cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300`}
          onClick={onBeneficeReelClick}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${data.beneficeReel >= 0 ? 'text-emerald-600' : 'text-red-600'} font-medium`}>Bénéfice Réel</p>
                <p className={`text-2xl font-bold ${data.beneficeReel >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {formatEuro(data.beneficeReel)}
                </p>
                <p className={`text-xs ${data.beneficeReel >= 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>Après dépenses</p>
              </div>
              <Wallet className={`h-10 w-10 ${data.beneficeReel >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Détails des dépenses */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border-indigo-500/30 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-600 font-medium">Achats Produits</p>
                <p className="text-xl font-bold text-indigo-500">{formatEuro(data.achatsTotal)}</p>
              </div>
              <Package className="h-8 w-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/20 to-amber-600/20 border-orange-500/30 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">Autres Dépenses</p>
                <p className="text-xl font-bold text-orange-500">{formatEuro(data.depensesTotal)}</p>
              </div>
              <Receipt className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-cyan-500/30 shadow-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-400 font-medium">Solde Net</p>
                <p className={`text-xl font-bold ${data.soldeNet >= 0 ? 'text-cyan-600' : 'text-red-300'}`}>
                  {formatEuro(data.soldeNet)}
                </p>
              </div>
              <PiggyBank className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ComptaStatsCards;
