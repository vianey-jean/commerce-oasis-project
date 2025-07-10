
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, AlertCircle, DollarSign, Percent, Save, Search, Eye, Trash2, Edit3, Sparkles, Crown, Diamond } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import useCurrencyFormatter from '@/hooks/use-currency-formatter';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import ProductSearchInput from '@/components/dashboard/ProductSearchInput';
import { Product } from '@/types';
import { ModernTable, ModernTableHeader, ModernTableRow, ModernTableHead, ModernTableCell, TableBody } from '@/components/dashboard/forms/ModernTable';
import axios from 'axios';

interface ProfitCalculation {
  prixAchat: number;
  taxeDouane: number;
  tva: number;
  autresFrais: number;
  coutTotal: number;
  margeDesire: number;
  prixVenteRecommande: number;
  beneficeNet: number;
  tauxMarge: number;
}

interface BeneficeData extends ProfitCalculation {
  id?: string;
  productId: string;
  productDescription: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfitCalculatorProps {
  className?: string;
  onCalculationChange?: (calculation: ProfitCalculation) => void;
  initialValues?: Partial<ProfitCalculation>;
  compact?: boolean;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  className,
  onCalculationChange,
  initialValues = {},
  compact = false
}) => {
  const { formatEuro } = useCurrencyFormatter();
  const { toast } = useToast();
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productDescription, setProductDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [beneficesList, setBeneficesList] = useState<BeneficeData[]>([]);
  const [showTable, setShowTable] = useState(true);
  
  const [values, setValues] = useState<ProfitCalculation>({
    prixAchat: initialValues.prixAchat || 0,
    taxeDouane: initialValues.taxeDouane || 0,
    tva: initialValues.tva || 20, // TVA par défaut 20%
    autresFrais: initialValues.autresFrais || 0,
    coutTotal: 0,
    margeDesire: initialValues.margeDesire || 30, // Marge par défaut 30%
    prixVenteRecommande: 0,
    beneficeNet: 0,
    tauxMarge: 0
  });

  const [prixVenteCustom, setPrixVenteCustom] = useState<number>(0);
  const [showCustomPrice, setShowCustomPrice] = useState(false);

  // Charger les données de bénéfices au montage
  useEffect(() => {
    loadBeneficesData();
  }, []);

  // Gérer la sélection d'un produit
  const handleProductSelect = (product: Product) => {
    console.log('🎯 Produit sélectionné pour calcul bénéfice:', product);
    setSelectedProduct(product);
    setProductDescription(product.description);
    updateValue('prixAchat', product.purchasePrice);
    
    // Charger les données de bénéfice existantes pour ce produit
    loadExistingBeneficeData(product.id);
  };

  // Charger toutes les données de bénéfices
  const loadBeneficesData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/benefices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBeneficesList(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des bénéfices:', error);
    }
  };

  // Charger les données de bénéfice existantes
  const loadExistingBeneficeData = async (productId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/benefices/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data) {
        const beneficeData = response.data;
        setValues({
          prixAchat: beneficeData.prixAchat,
          taxeDouane: beneficeData.taxeDouane,
          tva: beneficeData.tva,
          autresFrais: beneficeData.autresFrais,
          coutTotal: beneficeData.coutTotal,
          margeDesire: beneficeData.margeDesire,
          prixVenteRecommande: beneficeData.prixVenteRecommande,
          beneficeNet: beneficeData.beneficeNet,
          tauxMarge: beneficeData.tauxMarge
        });
        
        toast({
          title: "Données chargées",
          description: `Calculs existants chargés pour ${beneficeData.productDescription}`,
        });
      }
    } catch (error) {
      // Pas de données existantes, c'est normal
      console.log('Aucune donnée de bénéfice existante pour ce produit');
    }
  };

  // Calcul automatique
  useEffect(() => {
    if (values.prixAchat > 0) {
      const coutTotal = values.prixAchat + values.taxeDouane + values.autresFrais;
      const coutAvecTva = coutTotal * (1 + values.tva / 100);
      const prixVenteRecommande = coutAvecTva * (1 + values.margeDesire / 100);
      
      const beneficeNet = prixVenteRecommande - coutAvecTva;
      const tauxMarge = coutAvecTva > 0 ? (beneficeNet / coutAvecTva) * 100 : 0;

      const newCalculation = {
        ...values,
        coutTotal: coutAvecTva,
        prixVenteRecommande,
        beneficeNet,
        tauxMarge
      };

      setValues(newCalculation);
      onCalculationChange?.(newCalculation);
    }
  }, [values.prixAchat, values.taxeDouane, values.tva, values.autresFrais, values.margeDesire]);

  // Calcul avec prix de vente personnalisé
  const calculateWithCustomPrice = () => {
    if (prixVenteCustom > 0) {
      const beneficeNet = prixVenteCustom - values.coutTotal;
      const tauxMarge = values.coutTotal > 0 ? (beneficeNet / values.coutTotal) * 100 : 0;
      
      const customCalculation = {
        ...values,
        prixVenteRecommande: prixVenteCustom,
        beneficeNet,
        tauxMarge
      };
      
      setValues(customCalculation);
      onCalculationChange?.(customCalculation);
    }
  };

  const updateValue = (field: keyof ProfitCalculation, value: number) => {
    setValues(prev => ({ ...prev, [field]: value }));
  };

  // Sauvegarder les calculs
  const handleSave = async () => {
    if (!selectedProduct) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un produit avant de sauvegarder.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const beneficeData: BeneficeData = {
        productId: selectedProduct.id,
        productDescription: productDescription || selectedProduct.description,
        ...values
      };

      const token = localStorage.getItem('token');
      const response = await axios.post('/api/benefices', beneficeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Succès",
        description: "Calcul de bénéfice sauvegardé avec succès!",
      });

      // Recharger la liste
      await loadBeneficesData();

      console.log('✅ Calcul de bénéfice sauvegardé:', response.data);
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le calcul de bénéfice.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un calcul de bénéfice
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/benefices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast({
        title: "Succès",
        description: "Calcul de bénéfice supprimé avec succès!",
      });

      await loadBeneficesData();
    } catch (error) {
      console.error('❌ Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le calcul de bénéfice.",
        variant: "destructive"
      });
    }
  };

  const isRentable = (values.tauxMarge || 0) >= 20; // Seuil de rentabilité à 20%

  if (compact) {
    return (
      <Card className={cn("bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-2xl", className)}>
        <CardHeader className="pb-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Diamond className="h-6 w-6" />
            </div>
            Calcul Premium de Bénéfices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <ProductSearchInput
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
          
          {selectedProduct && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    Prix d'achat
                  </Label>
                  <Input
                    type="number"
                    value={values.prixAchat}
                    onChange={(e) => updateValue('prixAchat', Number(e.target.value))}
                    className="mt-1 border-emerald-200 focus:border-emerald-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4 text-blue-600" />
                    Marge désirée (%)
                  </Label>
                  <Input
                    type="number"
                    value={values.margeDesire}
                    onChange={(e) => updateValue('margeDesire', Number(e.target.value))}
                    className="mt-1 border-blue-200 focus:border-blue-500"
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-500" />
                    Prix de vente recommandé:
                  </span>
                  <span className="text-xl font-bold text-emerald-600">
                    {formatEuro(values.prixVenteRecommande)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Bénéfice net:
                  </span>
                  <span className={cn("text-xl font-bold", isRentable ? "text-emerald-600" : "text-red-600")}>
                    {formatEuro(values.beneficeNet)}
                  </span>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Calculateur Premium */}
      <Card className={cn("bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 border-0 shadow-2xl", className)}>
        <CardHeader className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Diamond className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Calculateur Premium de Bénéfices</h1>
              <p className="text-emerald-100 text-sm mt-1">Optimisez vos marges avec précision</p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          {/* Recherche de produit */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg text-white">
                <Search className="h-5 w-5" />
              </div>
              Sélection du produit
            </h3>
            
            <ProductSearchInput
              onProductSelect={handleProductSelect}
              selectedProduct={selectedProduct}
            />
            
            {selectedProduct && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200">
                <Label htmlFor="productDescription" className="font-semibold text-blue-800 dark:text-blue-300">Description du produit</Label>
                <Input
                  id="productDescription"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  placeholder="Description du produit"
                  className="mt-2 border-blue-300 focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {selectedProduct && (
            <>
              {/* Saisie des coûts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg text-white">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    Coûts d'acquisition
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-emerald-200 shadow-sm">
                      <Label htmlFor="prixAchat" className="font-semibold text-emerald-700 dark:text-emerald-300">Prix d'achat (€)</Label>
                      <Input
                        id="prixAchat"
                        type="number"
                        value={values.prixAchat}
                        onChange={(e) => updateValue('prixAchat', Number(e.target.value))}
                        placeholder="0.00"
                        className="mt-2 border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-200 shadow-sm">
                      <Label htmlFor="taxeDouane" className="font-semibold text-blue-700 dark:text-blue-300">Taxes douanières (€)</Label>
                      <Input
                        id="taxeDouane"
                        type="number"
                        value={values.taxeDouane}
                        onChange={(e) => updateValue('taxeDouane', Number(e.target.value))}
                        placeholder="0.00"
                        className="mt-2 border-blue-300 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-200 shadow-sm">
                      <Label htmlFor="tva" className="font-semibold text-purple-700 dark:text-purple-300">TVA (%)</Label>
                      <Input
                        id="tva"
                        type="number"
                        value={values.tva}
                        onChange={(e) => updateValue('tva', Number(e.target.value))}
                        placeholder="20"
                        className="mt-2 border-purple-300 focus:border-purple-500"
                      />
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-orange-200 shadow-sm">
                      <Label htmlFor="autresFrais" className="font-semibold text-orange-700 dark:text-orange-300">Autres frais (€)</Label>
                      <Input
                        id="autresFrais"
                        type="number"
                        value={values.autresFrais}
                        onChange={(e) => updateValue('autresFrais', Number(e.target.value))}
                        placeholder="0.00"
                        className="mt-2 border-orange-300 focus:border-orange-500"
                      />
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                        Transport, stockage, manutention, etc.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white">
                      <Percent className="h-5 w-5" />
                    </div>
                    Calcul de marge
                  </h3>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-purple-200 shadow-sm">
                    <Label htmlFor="margeDesire" className="font-semibold text-purple-700 dark:text-purple-300">Marge désirée (%)</Label>
                    <Input
                      id="margeDesire"
                      type="number"
                      value={values.margeDesire}
                      onChange={(e) => updateValue('margeDesire', Number(e.target.value))}
                      placeholder="30"
                      className="mt-2 border-purple-300 focus:border-purple-500"
                    />
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-emerald-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-gradient-to-r border-emerald-300 shadow-lg">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-blue-600" />
                          Coût total (TTC):
                        </span>
                        <span className="font-bold text-lg text-blue-600">{formatEuro(values.coutTotal)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Crown className="h-4 w-4 text-emerald-600" />
                          Prix de vente recommandé:
                        </span>
                        <span className="font-bold text-emerald-600 text-2xl">
                          {formatEuro(values.prixVenteRecommande)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-purple-600" />
                          Bénéfice net:
                        </span>
                        <span className={cn("font-bold text-2xl", isRentable ? "text-emerald-600" : "text-red-600")}>
                          {formatEuro(values.beneficeNet)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-indigo-600" />
                          Taux de marge:
                        </span>
                        <span className={cn("font-bold text-xl", isRentable ? "text-emerald-600" : "text-red-600")}>
                          {(values.tauxMarge || 0).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bouton de sauvegarde */}
                  <Button
                    onClick={handleSave}
                    disabled={isLoading || !selectedProduct}
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                    size="lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    {isLoading ? 'Sauvegarde...' : 'Valider et Sauvegarder'}
                  </Button>
                </div>
              </div>

              {/* Prix de vente personnalisé */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg text-white">
                      <Edit3 className="h-5 w-5" />
                    </div>
                    Tester un prix de vente personnalisé
                  </h3>
                  <Button
                    variant="outline"
                    onClick={() => setShowCustomPrice(!showCustomPrice)}
                    className="border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                  >
                    {showCustomPrice ? 'Masquer' : 'Afficher'}
                  </Button>
                </div>
                
                {showCustomPrice && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200">
                    <div>
                      <Label htmlFor="prixVenteCustom" className="font-semibold text-indigo-700 dark:text-indigo-300">Prix de vente personnalisé (€)</Label>
                      <Input
                        id="prixVenteCustom"
                        type="number"
                        value={prixVenteCustom}
                        onChange={(e) => setPrixVenteCustom(Number(e.target.value))}
                        placeholder="0.00"
                        className="mt-2 border-indigo-300 focus:border-indigo-500"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button 
                        onClick={calculateWithCustomPrice} 
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        Calculer
                      </Button>
                    </div>
                    <div className="flex items-center">
                      {prixVenteCustom > 0 && (
                        <div className="text-sm font-semibold">
                          <span className="text-gray-600">Marge: </span>
                          <span className={cn("font-bold text-lg", isRentable ? "text-emerald-600" : "text-red-600")}>
                            {(values.tauxMarge || 0).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Alertes */}
              {!isRentable && values.prixAchat > 0 && (
                <Alert className="border-red-200 bg-red-50 text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Attention:</strong> Votre marge est inférieure à 20%. 
                    Considérez augmenter votre prix de vente ou réduire vos coûts.
                  </AlertDescription>
                </Alert>
              )}
              
              {isRentable && values.prixAchat > 0 && (
                <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Excellent!</strong> Votre produit est rentable avec une marge de {(values.tauxMarge || 0).toFixed(1)}%.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Table des calculs de bénéfices */}
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Calculs de Bénéfice avec Marge</h2>
                <p className="text-purple-100 text-sm mt-1">Historique de vos calculs premium</p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowTable(!showTable)}
              className="text-white hover:bg-white/20"
            >
              {showTable ? 'Masquer' : 'Afficher'}
            </Button>
          </CardTitle>
        </CardHeader>
        
        {showTable && (
          <CardContent className="p-0">
            {beneficesList.length > 0 ? (
              <ModernTable>
                <ModernTableHeader>
                  <ModernTableRow>
                    <ModernTableHead className="font-bold text-purple-700">Produit</ModernTableHead>
                    <ModernTableHead className="font-bold text-emerald-700">Prix d'achat</ModernTableHead>
                    <ModernTableHead className="font-bold text-blue-700">Coût total</ModernTableHead>
                    <ModernTableHead className="font-bold text-indigo-700">Prix de vente</ModernTableHead>
                    <ModernTableHead className="font-bold text-green-700">Bénéfice</ModernTableHead>
                    <ModernTableHead className="font-bold text-orange-700">Marge %</ModernTableHead>
                    <ModernTableHead className="font-bold text-gray-700">Actions</ModernTableHead>
                  </ModernTableRow>
                </ModernTableHeader>
                <TableBody>
                  {beneficesList.map((benefice) => (
                    <ModernTableRow key={benefice.id}>
                      <ModernTableCell className="font-semibold text-purple-800 dark:text-purple-300">
                        {benefice.productDescription}
                      </ModernTableCell>
                      <ModernTableCell className="font-semibold text-emerald-700">
                        {formatEuro(benefice.prixAchat)}
                      </ModernTableCell>
                      <ModernTableCell className="font-semibold text-blue-700">
                        {formatEuro(benefice.coutTotal)}
                      </ModernTableCell>
                      <ModernTableCell className="font-semibold text-indigo-700">
                        {formatEuro(benefice.prixVenteRecommande)}
                      </ModernTableCell>
                      <ModernTableCell className={cn("font-bold", 
                        benefice.beneficeNet > 0 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {formatEuro(benefice.beneficeNet)}
                      </ModernTableCell>
                      <ModernTableCell className={cn("font-bold",
                        (benefice.tauxMarge || 0) >= 20 ? "text-emerald-600" : "text-red-600"
                      )}>
                        {(benefice.tauxMarge || 0).toFixed(1)}%
                      </ModernTableCell>
                      <ModernTableCell>
                        <Button
                          variant="ghost"
                          onClick={() => benefice.id && handleDelete(benefice.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </ModernTableCell>
                    </ModernTableRow>
                  ))}
                </TableBody>
              </ModernTable>
            ) : (
              <div className="text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <Calculator className="h-8 w-8 text-gray-500" />
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-400">Aucun calcul de bénéfice enregistré</p>
                  <p className="text-sm text-gray-500">Commencez par calculer et sauvegarder vos bénéfices</p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ProfitCalculator;
