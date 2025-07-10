
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, AlertCircle, DollarSign, Percent, Save, Search } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import useCurrencyFormatter from '@/hooks/use-currency-formatter';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import ProductSearchInput from '@/components/dashboard/ProductSearchInput';
import { Product } from '@/types';
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

  // Gérer la sélection d'un produit
  const handleProductSelect = (product: Product) => {
    console.log('🎯 Produit sélectionné pour calcul bénéfice:', product);
    setSelectedProduct(product);
    setProductDescription(product.description);
    updateValue('prixAchat', product.purchasePrice);
    
    // Charger les données de bénéfice existantes pour ce produit
    loadExistingBeneficeData(product.id);
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

  const isRentable = values.tauxMarge >= 20; // Seuil de rentabilité à 20%

  if (compact) {
    return (
      <Card className={cn("bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-emerald-600" />
            Calcul Rapide de Bénéfices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductSearchInput
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
          
          {selectedProduct && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Prix d'achat</Label>
                  <Input
                    type="number"
                    value={values.prixAchat}
                    onChange={(e) => updateValue('prixAchat', Number(e.target.value))}
                    className="mt-1"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Marge désirée (%)</Label>
                  <Input
                    type="number"
                    value={values.margeDesire}
                    onChange={(e) => updateValue('margeDesire', Number(e.target.value))}
                    className="mt-1"
                    placeholder="30"
                  />
                </div>
              </div>
              
              <div className="bg-white/70 rounded-lg p-4 border">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Prix de vente recommandé:</span>
                  <span className="text-lg font-bold text-emerald-600">
                    {formatEuro(values.prixVenteRecommande)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Bénéfice net:</span>
                  <span className={cn("text-lg font-bold", isRentable ? "text-emerald-600" : "text-red-600")}>
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
    <Card className={cn("bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-6 w-6 text-emerald-600" />
          Calculateur de Bénéfices Avancé
        </CardTitle>
        <CardDescription>
          Calculez vos bénéfices en tenant compte de tous les frais (douanes, TVA, etc.)
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Recherche de produit */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Search className="h-5 w-5" />
            Sélection du produit
          </h3>
          
          <ProductSearchInput
            onProductSelect={handleProductSelect}
            selectedProduct={selectedProduct}
          />
          
          {selectedProduct && (
            <div>
              <Label htmlFor="productDescription">Description du produit</Label>
              <Input
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Description du produit"
                className="mt-1"
              />
            </div>
          )}
        </div>

        {selectedProduct && (
          <>
            {/* Saisie des coûts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Coûts d'acquisition
                </h3>
                
                <div>
                  <Label htmlFor="prixAchat">Prix d'achat (€)</Label>
                  <Input
                    id="prixAchat"
                    type="number"
                    value={values.prixAchat}
                    onChange={(e) => updateValue('prixAchat', Number(e.target.value))}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="taxeDouane">Taxes douanières (€)</Label>
                  <Input
                    id="taxeDouane"
                    type="number"
                    value={values.taxeDouane}
                    onChange={(e) => updateValue('taxeDouane', Number(e.target.value))}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tva">TVA (%)</Label>
                  <Input
                    id="tva"
                    type="number"
                    value={values.tva}
                    onChange={(e) => updateValue('tva', Number(e.target.value))}
                    placeholder="20"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="autresFrais">Autres frais (€)</Label>
                  <Input
                    id="autresFrais"
                    type="number"
                    value={values.autresFrais}
                    onChange={(e) => updateValue('autresFrais', Number(e.target.value))}
                    placeholder="0.00"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Transport, stockage, manutention, etc.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Percent className="h-5 w-5" />
                  Calcul de marge
                </h3>
                
                <div>
                  <Label htmlFor="margeDesire">Marge désirée (%)</Label>
                  <Input
                    id="margeDesire"
                    type="number"
                    value={values.margeDesire}
                    onChange={(e) => updateValue('margeDesire', Number(e.target.value))}
                    placeholder="30"
                    className="mt-1"
                  />
                </div>
                
                <div className="bg-white/70 dark:bg-gray-800/70 rounded-lg p-4 border">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Coût total (TTC):</span>
                      <span className="font-semibold">{formatEuro(values.coutTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Prix de vente recommandé:</span>
                      <span className="font-bold text-emerald-600 text-lg">
                        {formatEuro(values.prixVenteRecommande)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Bénéfice net:</span>
                      <span className={cn("font-bold text-lg", isRentable ? "text-emerald-600" : "text-red-600")}>
                        {formatEuro(values.beneficeNet)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Taux de marge:</span>
                      <span className={cn("font-bold", isRentable ? "text-emerald-600" : "text-red-600")}>
                        {values.tauxMarge.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Bouton de sauvegarde */}
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !selectedProduct}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sauvegarde...' : 'Valider et Sauvegarder'}
                </Button>
              </div>
            </div>

            {/* Prix de vente personnalisé */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tester un prix de vente personnalisé</h3>
                <Button
                  variant="outline"
                  onClick={() => setShowCustomPrice(!showCustomPrice)}
                  size="sm"
                >
                  {showCustomPrice ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
              
              {showCustomPrice && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="prixVenteCustom">Prix de vente personnalisé (€)</Label>
                    <Input
                      id="prixVenteCustom"
                      type="number"
                      value={prixVenteCustom}
                      onChange={(e) => setPrixVenteCustom(Number(e.target.value))}
                      placeholder="0.00"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={calculateWithCustomPrice} className="w-full">
                      Calculer
                    </Button>
                  </div>
                  <div className="flex items-center">
                    {prixVenteCustom > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Marge: </span>
                        <span className={cn("font-bold", isRentable ? "text-emerald-600" : "text-red-600")}>
                          {values.tauxMarge.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Alertes */}
            {!isRentable && values.prixAchat > 0 && (
              <Alert>
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
                  <strong>Excellent!</strong> Votre produit est rentable avec une marge de {values.tauxMarge.toFixed(1)}%.
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
