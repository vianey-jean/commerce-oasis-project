import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Fuel, DollarSign, Calculator, Plus } from 'lucide-react';
import { DepenseFormData } from '@/types/comptabilite';

interface DepenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: DepenseFormData) => Promise<void>;
  formatEuro: (value: number) => string;
}

export const DepenseFormDialog: React.FC<DepenseFormDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  formatEuro
}) => {
  const [depenseForm, setDepenseForm] = useState<DepenseFormData>({
    description: '',
    montant: 0,
    type: 'autre_depense',
    categorie: 'divers'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormChange = (field: keyof DepenseFormData, value: string | number) => {
    setDepenseForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!depenseForm.description || depenseForm.montant <= 0) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(depenseForm);
      // Reset form
      setDepenseForm({
        description: '',
        montant: 0,
        type: 'autre_depense',
        categorie: 'divers'
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDepenseForm({
      description: '',
      montant: 0,
      type: 'autre_depense',
      categorie: 'divers'
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-br from-white via-orange-50/30 to-red-50/50 dark:from-gray-900 dark:via-orange-900/20 dark:to-red-900/20 backdrop-blur-xl border-0 shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 shadow-lg">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            Nouvelle Dépense
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-300">
            Enregistrez une nouvelle dépense (taxes, carburant, autres)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Type de dépense</Label>
            <Select
              value={depenseForm.type}
              onValueChange={(v) => handleFormChange('type', v)}
            >
              <SelectTrigger className="bg-white/80 dark:bg-gray-800/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taxes">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-red-500" />
                    Taxes / Impôts
                  </div>
                </SelectItem>
                <SelectItem value="carburant">
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-orange-500" />
                    Carburant
                  </div>
                </SelectItem>
                <SelectItem value="autre_depense">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-500" />
                    Autre dépense
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Description *</Label>
            <Input
              value={depenseForm.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder="Description de la dépense"
              className="bg-white/80 dark:bg-gray-800/80"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Montant (€) *</Label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={depenseForm.montant || ''}
              onChange={(e) => handleFormChange('montant', parseFloat(e.target.value) || 0)}
              placeholder="0.00"
              className="bg-white/80 dark:bg-gray-800/80 text-lg font-bold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Catégorie</Label>
            <Select
              value={depenseForm.categorie || 'divers'}
              onValueChange={(v) => handleFormChange('categorie', v)}
            >
              <SelectTrigger className="bg-white/80 dark:bg-gray-800/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transport">Transport</SelectItem>
                <SelectItem value="fournitures">Fournitures</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="administratif">Administratif</SelectItem>
                <SelectItem value="divers">Divers</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Résumé */}
          {depenseForm.montant > 0 && (
            <Card className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-pink-500/10 border-orange-500/30 shadow-lg">
              <CardContent className="pt-5 pb-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-orange-600" />
                    <span className="font-bold text-gray-800 dark:text-gray-100">Montant de la dépense:</span>
                  </div>
                  <span className="text-2xl font-black text-orange-800 dark:text-orange-400">
                    {formatEuro(depenseForm.montant)}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-12 px-6 rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!depenseForm.description || depenseForm.montant <= 0 || isSubmitting}
            className="h-12 px-8 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 hover:from-orange-700 hover:via-red-700 hover:to-pink-700 text-white shadow-xl rounded-xl font-bold text-base disabled:opacity-50"
          >
            <Plus className="h-5 w-5 mr-2" />
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer la dépense'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepenseFormDialog;
