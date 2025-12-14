/**
 * @fileoverview Formulaire de carte bancaire avec validation
 * 
 * Ce composant gère la saisie et la validation des informations
 * de carte bancaire avec :
 * - Détection automatique du type de carte
 * - Validation Luhn du numéro
 * - Validation de la date d'expiration
 * - Option de sauvegarde de la carte
 * 
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { Shield } from 'lucide-react';
import { cardsAPI } from '@/services/cards';

/**
 * Props du composant CreditCardForm
 */
interface CreditCardFormProps {
  /** Callback appelé après succès */
  onSuccess: () => void;
  /** Callback optionnel pour sauvegarder les données de carte */
  onSaveCard?: (cardData: any) => void;
  /** Montant total à payer (optionnel) */
  totalAmount?: number;
}

/**
 * Détecte le type de carte bancaire à partir du numéro
 * 
 * @param number - Le numéro de carte
 * @returns Le type de carte détecté
 */
const detectCardType = (number: string): string => {
  const cleaned = number.replace(/\s/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  return 'Inconnue';
};

/**
 * Valide un numéro de carte avec l'algorithme de Luhn
 * 
 * @param number - Le numéro de carte à valider
 * @returns true si le numéro est valide
 */
const isValidLuhn = (number: string): boolean => {
  const cleaned = number.replace(/\s/g, '');
  let sum = 0;
  let shouldDouble = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

/**
 * Composant de formulaire de carte bancaire
 * 
 * @param props - Les propriétés du composant
 * @returns Le composant JSX
 */
const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess, onSaveCard, totalAmount }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('Inconnue');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const validateExpiryDate = (date: string) => {
    if (date.length !== 5) return false;
    const [month, year] = date.split('/').map(Number);
    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = Number(String(now.getFullYear()).slice(-2));
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;
    return true;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(detectCardType(formatted));
    
    const isValid = isValidLuhn(formatted) && formatted.replace(/\s/g, '').length === 16;
    setErrors(prev => ({ ...prev, cardNumber: isValid ? '' : 'Numéro de carte invalide' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
    setErrors(prev => ({ ...prev, cardName: e.target.value.trim() ? '' : 'Nom sur la carte requis' }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    const valid = validateExpiryDate(formatted);
    setErrors(prev => ({ ...prev, expiryDate: valid ? '' : 'Date invalide' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
    const valid = (cardType === 'Amex' && value.length === 4) || (cardType !== 'Amex' && value.length === 3);
    setErrors(prev => ({ ...prev, cvv: valid ? '' : 'CVV invalide' }));
  };

  const isFormValid = () => {
    return (
      cardName.trim() &&
      isValidLuhn(cardNumber) &&
      validateExpiryDate(expiryDate) &&
      ((cardType === 'Amex' && cvv.length === 4) || (cardType !== 'Amex' && cvv.length === 3))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error("Veuillez corriger les erreurs avant de soumettre");
      return;
    }
    setLoading(true);

    try {
      if (saveCard) {
        await cardsAPI.addCard({ cardNumber, cardName, expiryDate, cvv });
        toast.success("Carte sauvegardée");
      }
      setTimeout(() => {
        setLoading(false);
        toast.success("Paiement accepté");
        onSuccess();
      }, 1500);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error("Erreur lors du paiement");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardName">Titulaire de la carte</Label>
        <Input
          id="cardName"
          placeholder="John Doe"
          value={cardName}
          onChange={handleNameChange}
          className={errors.cardName ? 'border-red-600' : ''}
        />
        {errors.cardName && <p className="text-red-600 font-bold text-sm mt-1">{errors.cardName}</p>}
      </div>

      <div>
        <Label htmlFor="cardNumber">Numéro de carte ({cardType})</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className={errors.cardNumber ? 'border-red-600' : ''}
        />
        {errors.cardNumber && <p className="text-red-600 font-bold text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="w-1/2">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input
            id="expiryDate"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            className={errors.expiryDate ? 'border-red-600' : ''}
          />
          {errors.expiryDate && <p className="text-red-600 font-bold  text-sm mt-1">{errors.expiryDate}</p>}
        </div>
        <div className="w-1/2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            placeholder={cardType === 'Amex' ? '4 chiffres' : '3 chiffres'}
            value={cvv}
            onChange={handleCvvChange}
            className={errors.cvv ? 'border-red-600' : ''}
            type="password"
          />
          {errors.cvv && <p className="text-red-600 font-bold text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveCard"
          checked={saveCard}
          onCheckedChange={(checked) => setSaveCard(checked === true)}
        />
        <Label htmlFor="saveCard" className="text-sm">
          Enregistrer cette carte pour les prochains paiements
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full mt-4 bg-green-600 hover:bg-green-700"
        disabled={loading || !isFormValid()}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="sm" className="mr-2" /> Traitement...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            {totalAmount ? `Payer ${totalAmount.toFixed(2)} €` : 'Ajouter et payer'}
          </span>
        )}
      </Button>
    </form>
  );
};

export default CreditCardForm;
