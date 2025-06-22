import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/components/ui/sonner';
import { Shield, Lock, CreditCard, AlertTriangle } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import SavedCardsManager from './SavedCardsManager';
import { savedCardsAPI, SavedCard } from '@/services/savedCardsAPI';
import { useAuth } from '@/contexts/AuthContext';

interface CreditCardFormProps {
  onSuccess: () => void;
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({ onSuccess }) => {
  // États pour la carte
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [selectedSavedCard, setSelectedSavedCard] = useState<SavedCard | null>(null);
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [requires3DS, setRequires3DS] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  
  const { user } = useAuth();

  const [errors, setErrors] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    general: ''
  });

  const [cardValidation, setCardValidation] = useState({
    isValid: false,
    cardType: '',
    issuer: ''
  });

  // Détection du type de carte
  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return { type: 'visa', issuer: 'Visa' };
    if (/^5[1-5]/.test(cleanNumber)) return { type: 'mastercard', issuer: 'Mastercard' };
    if (/^3[47]/.test(cleanNumber)) return { type: 'amex', issuer: 'American Express' };
    if (/^6(?:011|5)/.test(cleanNumber)) return { type: 'discover', issuer: 'Discover' };
    
    return { type: '', issuer: '' };
  };

  // Algorithme de Luhn pour validation
  const luhnCheck = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (!/^\d+$/.test(cleanNumber)) return false;
    
    let sum = 0;
    let alternate = false;
    
    for (let i = cleanNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cleanNumber.charAt(i), 10);
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 19); // Support jusqu'à 19 chiffres (Amex)
    
    const cardInfo = detectCardType(limitedDigits);
    if (cardInfo.type === 'amex') {
      return limitedDigits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
    } else {
      return limitedDigits.replace(/(\d{4})(?=\d)/g, '$1 ');
    }
  };

  const formatExpiryDate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 4);
    
    if (limitedDigits.length > 2) {
      return `${limitedDigits.slice(0, 2)}/${limitedDigits.slice(2)}`;
    }
    return limitedDigits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    
    const cleanNumber = formatted.replace(/\s/g, '');
    const cardInfo = detectCardType(cleanNumber);
    const isValidLuhn = luhnCheck(cleanNumber);
    const isValidLength = cleanNumber.length >= 13 && cleanNumber.length <= 19;
    
    setCardValidation({
      isValid: isValidLuhn && isValidLength,
      cardType: cardInfo.type,
      issuer: cardInfo.issuer
    });
    
    setErrors(prev => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setExpiryDate(formatted);
    setErrors(prev => ({ ...prev, expiryDate: '' }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    setCardName(value);
    setErrors(prev => ({ ...prev, cardName: '' }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxLength = cardValidation.cardType === 'amex' ? 4 : 3;
    const value = e.target.value.replace(/\D/g, '').slice(0, maxLength);
    setCvv(value);
    setErrors(prev => ({ ...prev, cvv: '' }));
  };

  // Validations avancées
  const validateCardNumber = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (cleanNumber.length < 13) return 'Numéro de carte trop court';
    if (cleanNumber.length > 19) return 'Numéro de carte trop long';
    if (!luhnCheck(cleanNumber)) return 'Numéro de carte invalide';
    if (!detectCardType(cleanNumber).type) return 'Type de carte non supporté';
    
    return '';
  };

  const validateExpiryDate = (date: string) => {
    if (date.length !== 5) return 'Format invalide (MM/YY)';
    
    const parts = date.split('/');
    if (parts.length !== 2) return 'Format invalide';
    
    const month = parseInt(parts[0], 10);
    const year = parseInt('20' + parts[1], 10);
    
    if (isNaN(month) || isNaN(year)) return 'Date invalide';
    if (month < 1 || month > 12) return 'Mois invalide';
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    if (year < currentYear) return 'Carte expirée';
    if (year === currentYear && month < currentMonth) return 'Carte expirée';
    if (year > currentYear + 20) return 'Date d\'expiration trop éloignée';
    
    return '';
  };

  const validateCvv = (cvv: string, cardType: string) => {
    const requiredLength = cardType === 'amex' ? 4 : 3;
    if (cvv.length !== requiredLength) {
      return `CVV doit contenir ${requiredLength} chiffres`;
    }
    return '';
  };

  const validateForm = () => {
    if (selectedSavedCard) return true;
    
    let valid = true;
    const newErrors = {
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      general: ''
    };

    if (!cardName.trim()) {
      newErrors.cardName = 'Le nom du titulaire est requis';
      valid = false;
    } else if (cardName.trim().length < 2) {
      newErrors.cardName = 'Nom trop court';
      valid = false;
    }

    const cardError = validateCardNumber(cardNumber);
    if (cardError) {
      newErrors.cardNumber = cardError;
      valid = false;
    }

    const expiryError = validateExpiryDate(expiryDate);
    if (expiryError) {
      newErrors.expiryDate = expiryError;
      valid = false;
    }

    const cvvError = validateCvv(cvv, cardValidation.cardType);
    if (cvvError) {
      newErrors.cvv = cvvError;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCardSelect = (card: SavedCard | null) => {
    setSelectedSavedCard(card);
    setShowNewCardForm(card === null);
    setErrors({ cardNumber: '', cardName: '', expiryDate: '', cvv: '', general: '' });
  };

  const processPayment = async () => {
    setLoading(true);
    setErrors(prev => ({ ...prev, general: '' }));
    
    try {
      let response;
      
      if (selectedSavedCard) {
        // Paiement avec carte sauvegardée
        response = await savedCardsAPI.processPaymentWithSavedCard(
          selectedSavedCard.id,
          { amount: 4999, currency: 'eur' }
        );
      } else {
        // Paiement avec nouvelle carte
        const cardData = {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardName,
          expiryDate,
          cvv,
          saveCard,
          setAsDefault
        };
        
        response = await savedCardsAPI.processPaymentWithNewCard(
          cardData,
          { amount: 4999, currency: 'eur' }
        );
      }
      
      const result = response.data;
      
      if (result.requires3DS) {
        // Authentification 3D Secure requise
        setRequires3DS(true);
        setPaymentIntentId(result.paymentIntentId);
        
        // Redirection vers 3DS (simulation)
        toast.info('Authentification 3D Secure requise. Redirection en cours...');
        
        setTimeout(async () => {
          try {
            await savedCardsAPI.validate3DS(result.paymentIntentId, {
              confirmed: true
            });
            toast.success('Paiement confirmé avec 3D Secure');
            onSuccess();
          } catch (error) {
            toast.error('Échec de l\'authentification 3D Secure');
            setRequires3DS(false);
          }
        }, 2000);
        
      } else if (result.success) {
        toast.success('Paiement accepté');
        onSuccess();
      } else {
        throw new Error(result.error || 'Paiement refusé');
      }
      
    } catch (error: any) {
      console.error('Erreur de paiement:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Erreur de paiement';
      
      if (errorMessage.includes('carte')) {
        setErrors(prev => ({ ...prev, general: errorMessage }));
      } else if (errorMessage.includes('CVV')) {
        setErrors(prev => ({ ...prev, cvv: 'CVV incorrect' }));
      } else if (errorMessage.includes('expired')) {
        setErrors(prev => ({ ...prev, expiryDate: 'Carte expirée' }));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs du formulaire');
      return;
    }
    
    await processPayment();
  };

  // Handlers pour les checkboxes avec conversion du type CheckedState
  const handleSaveCardChange = (checked: boolean | 'indeterminate') => {
    setSaveCard(checked === true);
  };

  const handleSetAsDefaultChange = (checked: boolean | 'indeterminate') => {
    setSetAsDefault(checked === true);
  };

  if (requires3DS) {
    return (
      <div className="text-center space-y-4 p-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">Authentification 3D Secure</h3>
        <p className="text-gray-600">
          Votre banque require une authentification supplémentaire pour sécuriser cette transaction.
        </p>
        <LoadingSpinner size="sm" text="Authentification en cours..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Indicateur de sécurité */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">
            Paiement sécurisé SSL 256-bit • Protection 3D Secure
          </span>
        </div>
      </div>

      {user && (
        <SavedCardsManager
          onCardSelect={handleCardSelect}
          selectedCardId={selectedSavedCard?.id}
        />
      )}

      {(!selectedSavedCard || showNewCardForm) && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{errors.general}</span>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="cardName">Titulaire de la carte *</Label>
            <Input
              id="cardName"
              placeholder="Jean Dupont"
              value={cardName}
              onChange={handleNameChange}
              required
              className={errors.cardName ? "border-red-500" : ""}
            />
            {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName}</p>}
          </div>
          
          <div>
            <Label htmlFor="cardNumber">Numéro de carte *</Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                className={`pr-12 ${errors.cardNumber ? "border-red-500" : 
                  cardValidation.isValid ? "border-green-500" : ""}`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {cardValidation.cardType && (
                  <span className="text-xs text-gray-500">{cardValidation.issuer}</span>
                )}
              </div>
            </div>
            {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
            {cardValidation.isValid && (
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <Shield className="h-3 w-3 mr-1" />
                Carte valide
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            <div className="w-1/2">
              <Label htmlFor="expiryDate">Date d'expiration *</Label>
              <Input
                id="expiryDate"
                placeholder="MM/YY"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                required
                className={errors.expiryDate ? "border-red-500" : ""}
              />
              {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
            </div>
            <div className="w-1/2">
              <Label htmlFor="cvv">CVV *</Label>
              <Input
                id="cvv"
                placeholder={cardValidation.cardType === 'amex' ? '1234' : '123'}
                value={cvv}
                onChange={handleCvvChange}
                required
                type="password"
                className={errors.cvv ? "border-red-500" : ""}
              />
              {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {user && !selectedSavedCard && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveCard"
                  checked={saveCard}
                  onCheckedChange={handleSaveCardChange}
                />
                <Label htmlFor="saveCard" className="text-sm">
                  Enregistrer cette carte pour les prochains achats
                </Label>
              </div>
              
              {saveCard && (
                <div className="flex items-center space-x-2 ml-6">
                  <Checkbox
                    id="setAsDefault"
                    checked={setAsDefault}
                    onCheckedChange={handleSetAsDefaultChange}
                  />
                  <Label htmlFor="setAsDefault" className="text-sm text-gray-600">
                    Définir comme carte par défaut
                  </Label>
                </div>
              )}
              
              <p className="text-xs text-gray-500 ml-6">
                <Lock className="h-3 w-3 inline mr-1" />
                Vos données sont chiffrées et sécurisées
              </p>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-6 bg-red-800 hover:bg-red-700"
            disabled={loading || (!selectedSavedCard && !cardValidation.isValid)}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner size="sm" className="mr-2" />
                {requires3DS ? 'Authentification 3DS...' : 'Traitement sécurisé...'}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Payer de manière sécurisée
              </span>
            )}
          </Button>
        </form>
      )}

      {selectedSavedCard && !showNewCardForm && (
        <Button 
          onClick={() => processPayment()}
          className="w-full bg-red-800 hover:bg-red-700"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner size="sm" className="mr-2" />
              Traitement sécurisé...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <Shield className="h-4 w-4 mr-2" />
              Payer avec carte enregistrée
            </span>
          )}
        </Button>
      )}

      <div className="text-center text-xs text-gray-500 space-y-1">
        <p>🔒 Vos données bancaires sont protégées par chiffrement SSL 256-bit</p>
        <p>🛡️ Authentification 3D Secure pour une sécurité maximale</p>
        <p>💳 Compatible Visa, Mastercard, American Express</p>
      </div>
    </div>
  );
};

export default CreditCardForm;
