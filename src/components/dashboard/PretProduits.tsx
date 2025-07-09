
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableFooter, TableHeader, TableRow } from "@/components/ui/table"
import { Package, FileText, PlusCircle, Edit, ShoppingCart, Loader2, AlertTriangle, UserPlus, UserMinus, Calendar as CalendarIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Pret, Product, PretProduit } from '@/types';
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
import { DateRange } from "react-day-picker"
import { addDays } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import PretRetardNotification from './PretRetardNotification';
import ProfitCalculator from './ProfitCalculator';

const PretProduits: React.FC = () => {
  const { prets, pretProduits, products, isLoading, fetchPrets, fetchProducts, fetchPretProduits } = useApp();
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
          fetchPretProduits(),
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
  }, [fetchProducts, fetchPrets, fetchPretProduits, toast, isAuthenticated, authLoading]);

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

  // Fonction pour déterminer le style de la date de paiement
  const getPaymentDateStyle = (pretProduit: PretProduit) => {
    if (!pretProduit.datePaiement) return "text-gray-500";
    
    const datePaiement = new Date(pretProduit.datePaiement);
    const aujourdhui = new Date();
    aujourdhui.setHours(0, 0, 0, 0);
    datePaiement.setHours(0, 0, 0, 0);
    
    if (pretProduit.estPaye) {
      // Si payé, toujours vert
      return "text-green-600 font-medium";
    } else if (datePaiement < aujourdhui) {
      // Si en cours et en retard, rouge et clignotant
      return "text-red-600 font-bold animate-pulse";
    } else {
      // Si en cours et à temps, vert
      return "text-green-600 font-medium";
    }
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <PretRetardNotification prets={pretProduits} />
      
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
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">{pretProduits.length}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="blue" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <UserMinus className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Prêts en cours</p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{pretProduits.filter(p => !p.estPaye).length}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="purple" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <Package className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Prêts payés</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{pretProduits.filter(p => p.estPaye).length}</p>
            </div>
          </div>
        </ModernContainer>
        
        <ModernContainer gradient="orange" className="transform hover:scale-105 transition-all duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Prêts en retard</p>
              <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">
                {pretProduits.filter(pret => {
                  if (pret.estPaye || !pret.datePaiement) return false;
                  const datePaiement = new Date(pret.datePaiement);
                  const aujourdhui = new Date();
                  aujourdhui.setHours(0, 0, 0, 0);
                  datePaiement.setHours(0, 0, 0, 0);
                  return datePaiement < aujourdhui;
                }).length}
              </p>
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
              <p className="text-lg font-bold text-app-red">{pretProduits.length}</p>
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
                icon={CalendarIcon}
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
                  <TableHead>Client</TableHead>
                  <TableHead>Prix de vente</TableHead>
                  <TableHead>Avance reçue</TableHead>
                  <TableHead>Reste</TableHead>
                  <TableHead>Date de paiement</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pretProduits.map((pretProduit) => (
                  <TableRow key={pretProduit.id}>
                    <TableCell className="font-medium">{format(new Date(pretProduit.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{pretProduit.description}</TableCell>
                    <TableCell>{pretProduit.nom || 'Client inconnu'}</TableCell>
                    <TableCell>{pretProduit.prixVente}€</TableCell>
                    <TableCell>{pretProduit.avanceRecue}€</TableCell>
                    <TableCell>{pretProduit.reste}€</TableCell>
                    <TableCell className={getPaymentDateStyle(pretProduit)}>
                      {pretProduit.datePaiement ? format(new Date(pretProduit.datePaiement), 'dd/MM/yyyy', { locale: fr }) : 'Non définie'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={pretProduit.estPaye ? "default" : "destructive"}>
                        {pretProduit.estPaye ? "Payé" : "En cours"}
                      </Badge>
                    </TableCell>
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
