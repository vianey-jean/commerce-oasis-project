/**
 * @fileoverview Routes de paiement Stripe
 * 
 * Ce module gère les endpoints pour les paiements Stripe :
 * - Création de PaymentIntent
 * - Vérification du statut de paiement
 * - Finalisation de commande
 * 
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const { readData, writeData } = require('../core/database');

// Initialiser Stripe avec la clé secrète
// Note: Remplacer par la vraie clé Stripe en production
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_xxxxxxxxxxxxx', {
  apiVersion: '2023-10-16'
});

/**
 * POST /api/stripe/create-payment-intent
 * Crée un PaymentIntent Stripe
 * 
 * @body {number} amount - Montant en centimes
 * @body {string} currency - Devise (default: 'eur')
 * @body {object} metadata - Métadonnées de la commande
 * @returns {object} - clientSecret et paymentIntentId
 */
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', metadata = {} } = req.body;

    // Validation du montant
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Montant invalide'
      });
    }

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString()
      }
    });

    console.log(`PaymentIntent créé: ${paymentIntent.id} pour ${amount}€`);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Erreur création PaymentIntent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la création du paiement'
    });
  }
});

/**
 * GET /api/stripe/payment-status/:paymentIntentId
 * Vérifie le statut d'un PaymentIntent
 * 
 * @param {string} paymentIntentId - ID du PaymentIntent
 * @returns {object} - Statut et détails du paiement
 */
router.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.json({
      success: true,
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });

  } catch (error) {
    console.error('Erreur récupération PaymentIntent:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la récupération du statut'
    });
  }
});

/**
 * POST /api/stripe/confirm-payment
 * Confirme un paiement et finalise la commande
 * 
 * @body {string} paymentIntentId - ID du PaymentIntent
 * @body {object} orderData - Données de la commande
 * @returns {object} - Confirmation de la commande
 */
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderData } = req.body;

    // Vérifier le statut du PaymentIntent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Le paiement n\'a pas été validé',
        status: paymentIntent.status
      });
    }

    // Lire les commandes existantes
    const orders = await readData('commandes.json') || [];

    // Créer la nouvelle commande
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      paymentIntentId,
      paymentStatus: 'paid',
      paymentMethod: 'card',
      paidAt: new Date().toISOString(),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Sauvegarder la commande
    orders.push(newOrder);
    await writeData('commandes.json', orders);

    console.log(`Commande créée: ${newOrder.id} - PaymentIntent: ${paymentIntentId}`);

    res.json({
      success: true,
      order: newOrder,
      message: 'Paiement confirmé et commande créée'
    });

  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erreur lors de la confirmation du paiement'
    });
  }
});

/**
 * POST /api/stripe/webhook
 * Webhook Stripe pour les événements de paiement
 * 
 * @body {object} event - Événement Stripe
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body;
    }

    // Gérer les différents types d'événements
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded`);
        break;
      
      case 'payment_intent.payment_failed':
        const failedIntent = event.data.object;
        console.log(`PaymentIntent ${failedIntent.id} failed:`, failedIntent.last_payment_error?.message);
        break;

      default:
        console.log(`Événement non géré: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erreur webhook Stripe:', error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
