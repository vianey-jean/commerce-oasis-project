
const database = require('../core/database');
const crypto = require('crypto');

class SavedCardsService {
  constructor() {
    this.cardsFile = 'saved-cards.json';
    this.encryptionKey = process.env.CARD_ENCRYPTION_KEY || 'your-32-character-secret-key-here';
  }

  // Chiffrement des données sensibles
  encrypt(text) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(algorithm, key);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return {
      encrypted: encrypted,
      iv: iv.toString('hex')
    };
  }

  // Déchiffrement des données
  decrypt(encryptedData) {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(this.encryptionKey.padEnd(32, '0').slice(0, 32));
    const decipher = crypto.createDecipher(algorithm, key);
    
    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  getUserCards(userId) {
    const cards = database.read(this.cardsFile);
    return cards.filter(card => card.userI === userId).map(card => ({
      id: card.id,
      userId: card.userId,
      lastFourDigits: card.lastFourDigits,
      cardType: card.cardType,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cardholderName: card.cardholderName,
      isDefault: card.isDefault,
      createdAt: card.createdAt
    }));
  }

  saveCard(userId, cardData) {
    const cards = database.read(this.cardsFile);
    
    // Chiffrer les données sensibles
    const encryptedCardNumber = this.encrypt(cardData.cardNumber);
    const encryptedCVV = this.encrypt(cardData.cvv);
    
    // Déterminer le type de carte
    const cardType = this.detectCardType(cardData.cardNumber);
    
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: userId,
      encryptedCardNumber: encryptedCardNumber,
      encryptedCVV: encryptedCVV,
      lastFourDigits: cardData.cardNumber.slice(-4),
      cardType: cardType,
      cardholderName: cardData.cardName,
      expiryMonth: cardData.expiryDate.split('/')[0],
      expiryYear: cardData.expiryDate.split('/')[1],
      isDefault: cardData.setAsDefault || false,
      createdAt: new Date().toISOString()
    };

    // Si c'est la carte par défaut, désactiver les autres
    if (cardData.setAsDefault) {
      cards.forEach(card => {
        if (card.userId === userId) {
          card.isDefault = false;
        }
      });
    }

    cards.push(newCard);
    database.write(this.cardsFile, cards);
    
    return {
      id: newCard.id,
      userId: newCard.userId,
      lastFourDigits: newCard.lastFourDigits,
      cardType: newCard.cardType,
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      cardholderName: newCard.cardholderName,
      isDefault: newCard.isDefault,
      createdAt: newCard.createdAt
    };
  }

  deleteCard(userId, cardId) {
    const cards = database.read(this.cardsFile);
    const cardIndex = cards.findIndex(card => card.id === cardId && card.userId === userId);
    
    if (cardIndex === -1) return false;
    
    cards.splice(cardIndex, 1);
    database.write(this.cardsFile, cards);
    
    return true;
  }

  setDefaultCard(userId, cardId) {
    const cards = database.read(this.cardsFile);
    
    // Désactiver toutes les cartes par défaut de l'utilisateur
    cards.forEach(card => {
      if (card.userId === userId) {
        card.isDefault = card.id === cardId;
      }
    });
    
    database.write(this.cardsFile, cards);
    return true;
  }

  processPaymentWithSavedCard(userId, cardId, paymentData) {
    const cards = database.read(this.cardsFile);
    const card = cards.find(c => c.id === cardId && c.userId === userId);
    
    if (!card) {
      throw new Error('Carte non trouvée');
    }

    // Simuler le traitement du paiement
    return this.simulatePaymentProcessing(card, paymentData);
  }

  processPaymentWithNewCard(userId, cardData, paymentData) {
    // Valider la carte
    if (!this.validateCard(cardData)) {
      throw new Error('Données de carte invalides');
    }

    // Sauvegarder si demandé
    let savedCard = null;
    if (cardData.saveCard) {
      savedCard = this.saveCard(userId, cardData);
    }

    // Simuler le traitement du paiement
    return this.simulatePaymentProcessing(cardData, paymentData, savedCard);
  }

  validateCard(cardData) {
    // Validation Luhn
    const cleanNumber = cardData.cardNumber.replace(/\s/g, '');
    if (!this.luhnCheck(cleanNumber)) return false;
    
    // Validation de la date d'expiration
    const [month, year] = cardData.expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
    if (expiry < new Date()) return false;
    
    // Validation CVV
    const cardType = this.detectCardType(cleanNumber);
    const cvvLength = cardType === 'amex' ? 4 : 3;
    if (cardData.cvv.length !== cvvLength) return false;
    
    return true;
  }

  luhnCheck(cardNumber) {
    let sum = 0;
    let alternate = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    return sum % 10 === 0;
  }

  detectCardType(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'amex';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'discover';
    
    return 'unknown';
  }

  simulatePaymentProcessing(cardData, paymentData, savedCard = null) {
    // Simuler différents scénarios de paiement
    const random = Math.random();
    
    // 5% de chance de nécessiter 3DS
    if (random < 0.05) {
      return {
        success: false,
        requires3DS: true,
        paymentIntentId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Authentification 3D Secure requise'
      };
    }
    
    // 3% de chance d'échec
    if (random < 0.08) {
      const errors = [
        'Carte refusée par la banque',
        'Fonds insuffisants',
        'Carte expirée',
        'CVV incorrect'
      ];
      throw new Error(errors[Math.floor(Math.random() * errors.length)]);
    }
    
    // Simulation de succès
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: paymentData.amount,
      currency: paymentData.currency,
      savedCard: savedCard,
      message: 'Paiement traité avec succès'
    };
  }

  validate3DS(paymentIntentId, confirmationData) {
    // Simuler la validation 3DS
    if (confirmationData.confirmed) {
      return {
        success: true,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: 'Paiement confirmé avec 3D Secure'
      };
    } else {
      throw new Error('Authentification 3D Secure échouée');
    }
  }
}

module.exports = new SavedCardsService();
