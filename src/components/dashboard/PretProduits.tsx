import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableFooter, TableHeader, TableRow } from "@/components/ui/table"
import { Package, FileText, PlusCircle, Edit, ShoppingCart, Loader2, AlertTriangle, UserPlus, UserMinus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Pret, Product } from '@/types';
import ModernContainer from '@/components/dashboard/forms/ModernContainer';
import ModernActionButton from '@/components/dashboard/forms/ModernActionButton';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "@radix-ui/react-icons"
import { DateRange } from "react-day-picker"
import { addDays } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import PretRetardNotification from './PretRetardNotification';
import ProfitCalculator from './ProfitCalculator';

const PretProduits: React.FC = () => {
  const { prets, products, isLoading, fetchPrets, fetchProducts } = useApp();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [addPretDialogOpen, setAddPretDialogOpen] = React.useState(false);
  const [editPretDialogOpen, setEditPretDialogOpen] = React.useState(false);
  const [selectedPret, setSelectedPret] = React.useState<Pret | undefined>(undefined);
  const [date, setDate] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 7),
  })

  useEffect(() => {
    if (!isAuthenticated || authLoading) {
      console.log('User not authenticated, not loading data');
      return;
    }

    const loadData = async () => {
      try {
        await Promise.all([
          fetchProducts(),
          fetchPrets(),
        ]);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    };

    loadData();
  }, [fetchProducts, fetchPrets, toast, isAuthenticated, authLoading]);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <p className="text-lg text-gray-600 dark:text-gray-300">Veuillez vous connecter pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const handleRowClick = (pret: Pret) => {
    setSelectedPret(pret);
    setAddPretDialogOpen(true);
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <PretRetardNotification />
      
      {/* Composant Calculateur de Bénéfices */}
      <ProfitCalculator compact={true} />
      
      {/* Statistiques modernisées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernContainer gradient="green" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg">
              <UserPlus className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Total des prêts</p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{prets.length}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="blue" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <UserMinus className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Produits prêtés</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{prets.reduce((sum, pret) => sum + pret.quantity, 0)}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="purple" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Produits disponibles</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{products.filter(p => p.quantity > 0).length}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="orange" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Produits en retard</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{prets.filter(pret => new Date(pret.returnDate) < new Date()).length}</p>
            </div>
          </div>
        </ModernContainer>
      </div>
      
      {/* Conteneur principal */}
      <ModernContainer 
        title="Prêts de Produits" 
        icon={Package}
        gradient="neutral"
        headerActions={
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total des prêts</p>
              <p className="text-lg font-bold text-app-red">{prets.length}</p>
            </div>
            <ModernActionButton
              icon={FileText}
              onClick={() => {}}
              variant="outline"
              gradient="indigo"
              buttonSize="md"
            >
              Rapport
            </ModernActionButton>
          </div>
        }
      >
        {/* Boutons d'action */}
        <div className="flex flex-wrap gap-4 mb-8">
          <ModernActionButton
            icon={PlusCircle}
            onClick={() => setAddPretDialogOpen(true)}
            gradient="red"
            buttonSize="md"
          >
            Ajouter un prêt
          </ModernActionButton>
          
          <ModernActionButton
            icon={Edit}
            onClick={() => setEditPretDialogOpen(true)}
            gradient="blue"
            buttonSize="md"
          >
            Modifier un prêt
          </ModernActionButton>
          
          <Popover>
            <PopoverTrigger asChild>
              <ModernActionButton
                icon={Calendar}
                gradient="green"
                buttonSize="md"
              >
                Choisir une date
              </ModernActionButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <DateRangePicker date={date} onDateChange={setDate} />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Contenu principal */}
        {(isLoading || authLoading) && (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-lg text-gray-600 dark:text-gray-300">Chargement des prêts...</p>
            </div>
          </div>
        )}
        
        {!isLoading && !authLoading && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date de prêt</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Quantité</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date de retour</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prets.map((pret) => (
                  <TableRow key={pret.id} onClick={() => handleRowClick(pret)}>
                    <TableCell className="font-medium">{format(new Date(pret.loanDate), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{pret.productDescription}</TableCell>
                    <TableCell>{pret.quantity}</TableCell>
                    <TableCell>{pret.clientName}</TableCell>
                    <TableCell>{format(new Date(pret.returnDate), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ModernContainer>
      
      {/* Dialogues */}
      <Dialog open={addPretDialogOpen} onOpenChange={setAddPretDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un prêt</DialogTitle>
          </DialogHeader>
          <div>
            <p>Formulaire d'ajout de prêt</p>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={editPretDialogOpen} onOpenChange={setEditPretDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier un prêt</DialogTitle>
          </DialogHeader>
          <div>
            <p>Formulaire de modification de prêt</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PretProduits;
