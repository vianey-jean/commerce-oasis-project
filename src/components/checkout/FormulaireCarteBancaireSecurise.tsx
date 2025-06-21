import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import { crypterDonneesCarte, decrypterDonneesCarte } from '@/services/securite/cryptageCartes';
import { cartesBancairesAPI } from '@/services/api/cartesBancaires';
import { useAuth } from '@/contexts/AuthContext';

interface CarteBancaireEnregistree {
  id: string;
  dernierChiffres: string;
  typeCarte: string;
  nomTitulaire: string;
  dateExpiration: string;
}

interface ProprietesFormulaireCarteBancaire {
  surSucces: () => void;
  montantTotal: number;
  idCommande: string;
}

// Alias pour compatibilité avec les props utilisées
interface ProprietesFormulaireCarteBancaireSecurise extends ProprietesFormulaireCarteBancaire {
  onSuccess?: () => void;
}

const FormulaireCarteBancaireSecurise: React.FC<ProprietesFormulaireCarteBancaireSecurise> = ({
  surSucces,
  onSuccess,
  montantTotal,
  idCommande
}) => {
  const [numeroCarte, setNumeroCarte] = useState('');
  const [nomTitulaire, setNomTitulaire] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [codeSecurite, setCodeSecurite] = useState('');
  const [enregistrerCarte, setEnregistrerCarte] = useState(false);
  const [carteSelectionnee, setCarteSelectionnee] = useState<string>('nouvelle');
  const [cartesEnregistrees, setCartesEnregistrees] = useState<CarteBancaireEnregistree[]>([]);
  const [chargement, setChargement] = useState(false);
  const [validationEnCours, setValidationEnCours] = useState(false);
  
  const { user: utilisateur } = useAuth();

  useEffect(() => {
    if (utilisateur) {
      chargerCartesEnregistrees();
    }
  }, [utilisateur]);

  const chargerCartesEnregistrees = async () => {
    if (!utilisateur) return;
    
    try {
      const reponse = await cartesBancairesAPI.obtenirCartesSauvegardees();
      setCartesEnregistrees(reponse.data || []);
    } catch (erreur) {
      console.error('Erreur lors du chargement des cartes:', erreur);
    }
  };

  const validerNumeroCarte = (numero: string) => {
    // Validation Luhn algorithm
    const nettoye = numero.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(nettoye)) return false;
    
    let somme = 0;
    let paire = false;
    
    for (let i = nettoye.length - 1; i >= 0; i--) {
      let digit = parseInt(nettoye.charAt(i));
      
      if (paire) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      somme += digit;
      paire = !paire;
    }
    
    return somme % 10 === 0;
  };

  const formaterNumeroCarte = (numero: string) => {
    const nettoye = numero.replace(/\s/g, '');
    const groupes = nettoye.match(/.{1,4}/g) || [];
    return groupes.join(' ').substr(0, 19);
  };

  const obtenirTypeCarte = (numero: string) => {
    const nettoye = numero.replace(/\s/g, '');
    if (/^4/.test(nettoye)) return 'visa';
    if (/^5[1-5]/.test(nettoye)) return 'mastercard';
    if (/^3[47]/.test(nettoye)) return 'amex';
    return 'unknown';
  };

  const validerDateExpiration = (date: string) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(date)) return false;
    
    const [mois, annee] = date.split('/');
    const maintenant = new Date();
    const dateExp = new Date(2000 + parseInt(annee), parseInt(mois) - 1);
    
    return dateExp > maintenant;
  };

  const processerPaiement3DS = async (donneesCarte: any) => {
    return new Promise((resolve) => {
      // Simulation 3DS - en production, intégrer avec Stripe ou un autre processeur
      setValidationEnCours(true);
      
      setTimeout(() => {
        const succes = Math.random() > 0.1; // 90% de succès pour la démo
        setValidationEnCours(false);
        
        if (succes) {
          toast.success('Paiement validé avec succès');
          resolve(true);
        } else {
          toast.error('Échec de la validation 3DS');
          resolve(false);
        }
      }, 3000);
    });
  };

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);

    try {
      let donneesCarteAUtiliser;
      
      if (carteSelectionnee === 'nouvelle') {
        // Validation des nouvelles données
        if (!validerNumeroCarte(numeroCarte)) {
          toast.error('Numéro de carte invalide');
          setChargement(false);
          return;
        }
        
        if (!validerDateExpiration(dateExpiration)) {
          toast.error('Date d\'expiration invalide');
          setChargement(false);
          return;
        }
        
        if (codeSecurite.length < 3) {
          toast.error('Code de sécurité invalide');
          setChargement(false);
          return;
        }
        
        donneesCarteAUtiliser = {
          numero: numeroCarte.replace(/\s/g, ''),
          nom: nomTitulaire,
          expiration: dateExpiration,
          cvv: codeSecurite
        };
        
        // Enregistrer la carte si demandé
        if (enregistrerCarte && utilisateur) {
          try {
            const donneesChiffrees = crypterDonneesCarte(donneesCarteAUtiliser);
            await cartesBancairesAPI.sauvegarderCarte({
              donneesChiffrees,
              dernierChiffres: numeroCarte.slice(-4),
              typeCarte: obtenirTypeCarte(numeroCarte),
              nomTitulaire,
              dateExpiration,
              estPrincipale: false
            });
            toast.success('Carte enregistrée avec succès');
          } catch (erreur) {
            console.error('Erreur lors de l\'enregistrement:', erreur);
            toast.error('Erreur lors de l\'enregistrement de la carte');
          }
        }
      } else {
        // Utiliser une carte enregistrée
        const carteEnregistree = cartesEnregistrees.find(c => c.id === carteSelectionnee);
        if (!carteEnregistree) {
          toast.error('Carte sélectionnée introuvable');
          setChargement(false);
          return;
        }
        
        if (!codeSecurite) {
          toast.error('Code de sécurité requis');
          setChargement(false);
          return;
        }
        
        // Récupérer les données déchiffrées (simulation)
        donneesCarteAUtiliser = {
          numero: '****',
          nom: carteEnregistree.nomTitulaire,
          expiration: carteEnregistree.dateExpiration,
          cvv: codeSecurite
        };
      }
      
      // Processus de validation 3DS
      const validationReussie = await processerPaiement3DS(donneesCarteAUtiliser);
      
      if (validationReussie) {
        // Processus de paiement réussi
        toast.success('Paiement effectué avec succès');
        // Utiliser onSuccess ou surSucces selon ce qui est fourni
        if (onSuccess) {
          onSuccess();
        } else {
          surSucces();
        }
      }
      
    } catch (erreur) {
      console.error('Erreur lors du paiement:', erreur);
      toast.error('Erreur lors du traitement du paiement');
    } finally {
      setChargement(false);
    }
  };

  if (validationEnCours) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600 animate-pulse" />
          <CardTitle>Validation 3D Secure</CardTitle>
          <p className="text-sm text-gray-600">
            Veuillez patienter pendant la validation de votre paiement...
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-sm">Vérification en cours avec votre banque</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          Paiement sécurisé
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={gererSoumission} className="space-y-4">
          {cartesEnregistrees.length > 0 && (
            <div className="space-y-2">
              <Label>Méthode de paiement</Label>
              <Select value={carteSelectionnee} onValueChange={setCarteSelectionnee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nouvelle">Nouvelle carte</SelectItem>
                  {cartesEnregistrees.map(carte => (
                    <SelectItem key={carte.id} value={carte.id}>
                      {carte.typeCarte.toUpperCase()} •••• {carte.dernierChiffres}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {carteSelectionnee === 'nouvelle' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="numeroCarte">Numéro de carte</Label>
                <Input
                  id="numeroCarte"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={numeroCarte}
                  onChange={(e) => setNumeroCarte(formaterNumeroCarte(e.target.value))}
                  maxLength={19}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nomTitulaire">Nom du titulaire</Label>
                <Input
                  id="nomTitulaire"
                  type="text"
                  placeholder="Jean Dupont"
                  value={nomTitulaire}
                  onChange={(e) => setNomTitulaire(e.target.value.toUpperCase())}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateExpiration">MM/AA</Label>
                  <Input
                    id="dateExpiration"
                    type="text"
                    placeholder="12/25"
                    value={dateExpiration}
                    onChange={(e) => {
                      let valeur = e.target.value.replace(/\D/g, '');
                      if (valeur.length >= 2) {
                        valeur = valeur.substring(0, 2) + '/' + valeur.substring(2, 4);
                      }
                      setDateExpiration(valeur);
                    }}
                    maxLength={5}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="codeSecurite">CVV</Label>
                  <Input
                    id="codeSecurite"
                    type="password"
                    placeholder="123"
                    value={codeSecurite}
                    onChange={(e) => setCodeSecurite(e.target.value.replace(/\D/g, ''))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enregistrerCarte"
                  checked={enregistrerCarte}
                  onCheckedChange={(checked) => setEnregistrerCarte(checked as boolean)}
                />
                <Label htmlFor="enregistrerCarte" className="text-sm">
                  Enregistrer cette carte pour les prochains achats
                </Label>
              </div>
            </>
          )}
          
          {carteSelectionnee !== 'nouvelle' && (
            <div className="space-y-2">
              <Label htmlFor="codeSecurite">Code de sécurité (CVV)</Label>
              <Input
                id="codeSecurite"
                type="password"
                placeholder="123"
                value={codeSecurite}
                onChange={(e) => setCodeSecurite(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                required
              />
              <p className="text-xs text-gray-500">
                Saisissez le code de sécurité de votre carte pour confirmer le paiement
              </p>
            </div>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Total à payer</span>
              <span className="text-xl font-bold">{montantTotal.toFixed(2)} €</span>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={chargement}
            >
              {chargement ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Payer {montantTotal.toFixed(2)} €
                </>
              )}
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 text-center">
            <div className="flex items-center justify-center gap-2">
              <Lock className="h-3 w-3" />
              Paiement sécurisé par cryptage SSL 256-bit
            </div>
            <div className="mt-1">
              Validation 3D Secure obligatoire
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormulaireCarteBancaireSecurise;
