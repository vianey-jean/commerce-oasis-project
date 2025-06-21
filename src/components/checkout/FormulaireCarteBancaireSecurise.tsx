
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/sonner';
import { Shield, CreditCard, Lock, Trash2 } from 'lucide-react';
import { cryptageCartes } from '@/services/securite/cryptageCartes';
import { cartesBancairesAPI, CarteBancaireSauvegardee } from '@/services/api/cartesBancaires';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface ProprietesFormulaireCarteBancaire {
  surReussite: () => void;
  montantTotal: number;
  idCommande: string;
}

const FormulaireCarteBancaireSecurise: React.FC<ProprietesFormulaireCarteBancaire> = ({ 
  surReussite, 
  montantTotal,
  idCommande 
}) => {
  const [numeroCarte, setNumeroCarte] = useState('');
  const [nomTitulaire, setNomTitulaire] = useState('');
  const [dateExpiration, setDateExpiration] = useState('');
  const [cvv, setCvv] = useState('');
  const [chargement, setChargement] = useState(false);
  const [sauvegarderCarte, setSauvegarderCarte] = useState(false);
  const [cartesSauvegardees, setCartesSauvegardees] = useState<CarteBancaireSauvegardee[]>([]);
  const [carteSelectionnee, setCarteSelectionnee] = useState<string>('');
  const [utiliserNouvelleCart, setUtiliserNouvelleCart] = useState(true);
  const [validation3DS, setValidation3DS] = useState<{
    actif: boolean;
    idTransaction: string;
    urlValidation: string;
  }>({ actif: false, idTransaction: '', urlValidation: '' });
  
  const [erreurs, setErreurs] = useState({
    numeroCarte: '',
    nomTitulaire: '',
    dateExpiration: '',
    cvv: ''
  });

  useEffect(() => {
    chargerCartesSauvegardees();
  }, []);

  const chargerCartesSauvegardees = async () => {
    try {
      const reponse = await cartesBancairesAPI.obtenirCartesSauvegardees();
      setCartesSauvegardees(reponse.data || []);
      if (reponse.data && reponse.data.length > 0) {
        setUtiliserNouvelleCart(false);
        setCarteSelectionnee(reponse.data.find(c => c.estPrincipale)?.id || reponse.data[0].id);
      }
    } catch (erreur) {
      console.error('Erreur chargement cartes:', erreur);
    }
  };

  const formaterNumeroCarte = (valeur: string) => {
    const chiffres = valeur.replace(/\D/g, '');
    const chiffresLimites = chiffres.slice(0, 16);
    const formate = chiffresLimites.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formate;
  };

  const formaterDateExpiration = (valeur: string) => {
    const chiffres = valeur.replace(/\D/g, '');
    const chiffresLimites = chiffres.slice(0, 4);
    if (chiffresLimites.length > 2) {
      return `${chiffresLimites.slice(0, 2)}/${chiffresLimites.slice(2)}`;
    }
    return chiffresLimites;
  };

  const gererChangementNumeroCarte = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valeurFormatee = formaterNumeroCarte(e.target.value);
    setNumeroCarte(valeurFormatee);
    setErreurs(prev => ({ ...prev, numeroCarte: '' }));
  };

  const gererChangementDateExpiration = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valeurFormatee = formaterDateExpiration(e.target.value);
    setDateExpiration(valeurFormatee);
    setErreurs(prev => ({ ...prev, dateExpiration: '' }));
  };

  const gererChangementNom = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNomTitulaire(e.target.value);
    setErreurs(prev => ({ ...prev, nomTitulaire: '' }));
  };

  const gererChangementCvv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valeur = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvv(valeur);
    setErreurs(prev => ({ ...prev, cvv: '' }));
  };

  const validerFormulaire = () => {
    let valide = true;
    const nouvellesErreurs = {
      numeroCarte: '',
      nomTitulaire: '',
      dateExpiration: '',
      cvv: ''
    };

    if (utiliserNouvelleCart || !carteSelectionnee) {
      if (!nomTitulaire.trim()) {
        nouvellesErreurs.nomTitulaire = 'Le nom du titulaire est requis';
        valide = false;
      }

      if (!cryptageCartes.validerNumeroCarte(numeroCarte)) {
        nouvellesErreurs.numeroCarte = 'Numéro de carte invalide';
        valide = false;
      }

      if (!validerDateExpiration(dateExpiration)) {
        nouvellesErreurs.dateExpiration = 'Date d\'expiration invalide';
        valide = false;
      }

      if (cvv.length < 3) {
        nouvellesErreurs.cvv = 'CVV invalide';
        valide = false;
      }
    } else if (!carteSelectionnee) {
      toast.error('Veuillez sélectionner une carte ou ajouter une nouvelle carte');
      valide = false;
    }

    setErreurs(nouvellesErreurs);
    return valide;
  };

  const validerDateExpiration = (date: string) => {
    if (date.length !== 5) return false;
    
    const parties = date.split('/');
    if (parties.length !== 2) return false;
    
    const mois = parseInt(parties[0], 10);
    const annee = parseInt('20' + parties[1], 10);
    
    if (isNaN(mois) || isNaN(annee)) return false;
    if (mois < 1 || mois > 12) return false;
    
    const dateActuelle = new Date();
    const anneeActuelle = dateActuelle.getFullYear();
    const moisActuel = dateActuelle.getMonth() + 1;
    
    if (annee < anneeActuelle) return false;
    if (annee === anneeActuelle && mois < moisActuel) return false;
    
    return true;
  };

  const determinerTypeCarte = (numeroCarte: string) => {
    const numero = numeroCarte.replace(/\s/g, '');
    if (numero.startsWith('4')) return 'Visa';
    if (numero.startsWith('5') || numero.startsWith('2')) return 'Mastercard';
    if (numero.startsWith('3')) return 'American Express';
    return 'Autre';
  };

  const traiterPaiement = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validerFormulaire()) {
      return;
    }
    
    setChargement(true);
    
    try {
      let donneesValidation;
      
      if (utiliserNouvelleCart || !carteSelectionnee) {
        const donneesCarte = {
          numeroCarte,
          nomTitulaire,
          dateExpiration,
          cvv
        };
        
        donneesValidation = {
          donneesNouvelleCarte: donneesCarte,
          montant: Math.round(montantTotal * 100),
          monnaie: 'EUR',
          idCommande,
          sauvegarderCarte
        };
      } else {
        donneesValidation = {
          idCarte: carteSelectionnee,
          cvv,
          montant: Math.round(montantTotal * 100),
          monnaie: 'EUR',
          idCommande
        };
      }
      
      const reponse = await cartesBancairesAPI.validerPaiement3DS(donneesValidation);
      
      if (reponse.data.necessite3DS) {
        setValidation3DS({
          actif: true,
          idTransaction: reponse.data.idTransaction,
          urlValidation: reponse.data.urlValidation3DS
        });
        
        window.open(reponse.data.urlValidation3DS, '_blank', 'width=400,height=600');
        toast.info('Validation 3DS requise. Une nouvelle fenêtre s\'est ouverte.');
      } else {
        if (sauvegarderCarte && utiliserNouvelleCart) {
          await sauvegarderNouvelleCarte();
        }
        
        toast.success('Paiement accepté avec succès');
        surReussite();
      }
    } catch (erreur) {
      console.error('Erreur paiement:', erreur);
      toast.error('Erreur lors du traitement du paiement');
    } finally {
      setChargement(false);
    }
  };

  const sauvegarderNouvelleCarte = async () => {
    try {
      const donneesChiffrees = cryptageCartes.crypterDonneesCarte({
        numeroCarte,
        nomTitulaire,
        dateExpiration,
        cvv: ''
      });

      await cartesBancairesAPI.sauvegarderCarte({
        donneesChiffrees,
        numeroMasque: cryptageCartes.masquerNumeroCarte(numeroCarte),
        nomTitulaire,
        dateExpiration,
        typeCarte: determinerTypeCarte(numeroCarte),
        estPrincipale: cartesSauvegardees.length === 0
      });

      await chargerCartesSauvegardees();
      toast.success('Carte sauvegardée avec succès');
    } catch (erreur) {
      console.error('Erreur sauvegarde carte:', erreur);
      toast.error('Erreur lors de la sauvegarde de la carte');
    }
  };

  const supprimerCarteSauvegardee = async (idCarte: string) => {
    try {
      await cartesBancairesAPI.supprimerCarte(idCarte);
      await chargerCartesSauvegardees();
      toast.success('Carte supprimée');
      
      if (carteSelectionnee === idCarte) {
        setCarteSelectionnee('');
        setUtiliserNouvelleCart(true);
      }
    } catch (erreur) {
      console.error('Erreur suppression carte:', erreur);
      toast.error('Erreur lors de la suppression');
    }
  };

  if (validation3DS.actif) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Validation 3D Secure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <p>Validation 3D Secure en cours...</p>
            <p className="text-sm text-gray-600">
              Veuillez compléter la validation dans la fenêtre qui s'est ouverte.
            </p>
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={traiterPaiement} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-600" />
            Paiement sécurisé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartesSauvegardees.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="carte-sauvegardee"
                  checked={!utiliserNouvelleCart}
                  onChange={() => setUtiliserNouvelleCart(false)}
                />
                <Label htmlFor="carte-sauvegardee">Utiliser une carte sauvegardée</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="nouvelle-carte"
                  checked={utiliserNouvelleCart}
                  onChange={() => setUtiliserNouvelleCart(true)}
                />
                <Label htmlFor="nouvelle-carte">Utiliser une nouvelle carte</Label>
              </div>
            </div>
          )}

          {!utiliserNouvelleCart && cartesSauvegardees.length > 0 && (
            <div className="space-y-2">
              <Label>Sélectionner une carte</Label>
              {cartesSauvegardees.map((carte) => (
                <div
                  key={carte.id}
                  className={`p-3 border rounded-lg cursor-pointer flex items-center justify-between ${
                    carteSelectionnee === carte.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setCarteSelectionnee(carte.id)}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{carte.numeroMasque}</p>
                      <p className="text-sm text-gray-600">
                        {carte.nomTitulaire} • {carte.dateExpiration}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      supprimerCarteSauvegardee(carte.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {utiliserNouvelleCart && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="nomTitulaire">Nom du titulaire</Label>
                <Input
                  id="nomTitulaire"
                  placeholder="Jean Dupont"
                  value={nomTitulaire}
                  onChange={gererChangementNom}
                  required
                  className={erreurs.nomTitulaire ? "border-red-500" : ""}
                />
                {erreurs.nomTitulaire && (
                  <p className="text-red-500 text-sm mt-1">{erreurs.nomTitulaire}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="numeroCarte">Numéro de carte</Label>
                <Input
                  id="numeroCarte"
                  placeholder="1234 5678 9012 3456"
                  value={numeroCarte}
                  onChange={gererChangementNumeroCarte}
                  required
                  className={erreurs.numeroCarte ? "border-red-500" : ""}
                />
                {erreurs.numeroCarte && (
                  <p className="text-red-500 text-sm mt-1">{erreurs.numeroCarte}</p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <Label htmlFor="dateExpiration">Date d'expiration</Label>
                  <Input
                    id="dateExpiration"
                    placeholder="MM/AA"
                    value={dateExpiration}
                    onChange={gererChangementDateExpiration}
                    required
                    className={erreurs.dateExpiration ? "border-red-500" : ""}
                  />
                  {erreurs.dateExpiration && (
                    <p className="text-red-500 text-sm mt-1">{erreurs.dateExpiration}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={cvv}
                    onChange={gererChangementCvv}
                    required
                    type="password"
                    className={erreurs.cvv ? "border-red-500" : ""}
                  />
                  {erreurs.cvv && (
                    <p className="text-red-500 text-sm mt-1">{erreurs.cvv}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sauvegarderCarte"
                  checked={sauvegarderCarte}
                  onCheckedChange={(checked) => setSauvegarderCarte(checked as boolean)}
                />
                <Label htmlFor="sauvegarderCarte" className="text-sm">
                  Sauvegarder cette carte pour les prochains achats
                </Label>
              </div>
            </div>
          )}

          {!utiliserNouvelleCart && carteSelectionnee && (
            <div>
              <Label htmlFor="cvv-sauvegarde">Code CVV</Label>
              <Input
                id="cvv-sauvegarde"
                placeholder="123"
                value={cvv}
                onChange={gererChangementCvv}
                required
                type="password"
                className="w-32"
              />
              <p className="text-xs text-gray-600 mt-1">
                Pour votre sécurité, saisissez le CVV de votre carte
              </p>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Lock className="h-4 w-4 text-blue-600 mr-2" />
              <p className="text-sm font-medium text-blue-800">Paiement 100% sécurisé</p>
            </div>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Validation 3D Secure obligatoire</li>
              <li>• Chiffrement SSL 256 bits</li>
              <li>• Données cryptées et protégées</li>
              <li>• Conforme aux normes PCI DSS</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={chargement}
      >
        {chargement ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" />
            Traitement sécurisé...
          </span>
        ) : (
          `Payer ${montantTotal.toFixed(2)} €`
        )}
      </Button>
    </form>
  );
};

export default FormulaireCarteBancaireSecurise;
