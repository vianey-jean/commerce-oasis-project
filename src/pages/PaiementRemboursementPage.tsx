
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { paiementRemboursementAPI } from '@/services/paiementRemboursementAPI';
import { PaiementRemboursement } from '@/types/paiementRemboursement';
import { 
  CreditCard, 
  Truck, 
  CheckCircle, 
  Clock, 
  Package,
  MapPin,
  Phone,
  Receipt
} from 'lucide-react';
import { io } from 'socket.io-client';

const PaiementRemboursementPage: React.FC = () => {
  const [paiements, setPaiements] = useState<PaiementRemboursement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadPaiements();
    
    // Socket connection for real-time updates
    const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:10000');
    
    socket.on('paiement-remboursement-created', (newPaiement: PaiementRemboursement) => {
      // Only add if it belongs to this user and is accepted
      const currentUserId = localStorage.getItem('userId');
      if (newPaiement.userId === currentUserId && newPaiement.decision === 'accepté') {
        setPaiements(prev => [...prev, newPaiement]);
      }
    });
    
    socket.on('paiement-remboursement-updated', (updatedPaiement: PaiementRemboursement) => {
      setPaiements(prev => prev.map(p => 
        p.id === updatedPaiement.id ? updatedPaiement : p
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const loadPaiements = async () => {
    try {
      const response = await paiementRemboursementAPI.getUserPaiements();
      setPaiements(response.data);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async (id: string) => {
    try {
      await paiementRemboursementAPI.validatePayment(id);
      toast.success('Paiement validé avec succès');
      // Remove from list after validation
      setPaiements(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur validation:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'debut':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Début</Badge>;
      case 'en cours':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">En cours</Badge>;
      case 'payé':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Paiement à la livraison';
      case 'card':
        return 'Carte bancaire';
      case 'paypal':
        return 'PayPal';
      case 'apple_pay':
        return 'Apple Pay';
      default:
        return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash':
        return <Truck className="h-5 w-5 text-orange-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (paiements.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <CardContent>
              <Receipt className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun remboursement en attente</h2>
              <p className="text-gray-500 mb-4">Vous n'avez pas de remboursement accepté en cours.</p>
              <Button onClick={() => navigate('/commandes')}>Voir mes commandes</Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Paiement Remboursement
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivez l'état de vos remboursements acceptés
          </p>
        </div>

        <div className="space-y-6">
          {paiements.map((paiement) => (
            <Card key={paiement.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg">
                      Remboursement #{paiement.id}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Commande: {paiement.orderId}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    {getStatusBadge(paiement.status)}
                    {paiement.status === 'payé' && !paiement.clientValidated && (
                      <Button 
                        onClick={() => handleValidate(paiement.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmer réception
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Status Progress */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progression du remboursement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex-1 h-2 rounded-full ${
                      paiement.status === 'debut' || paiement.status === 'en cours' || paiement.status === 'payé' 
                        ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`flex-1 h-2 rounded-full ${
                      paiement.status === 'en cours' || paiement.status === 'payé' 
                        ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`flex-1 h-2 rounded-full ${
                      paiement.status === 'payé' ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Début</span>
                    <span>En cours</span>
                    <span>Payé</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    {getPaymentMethodIcon(paiement.order.paymentMethod)}
                    Mode de remboursement
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {getPaymentMethodLabel(paiement.order.paymentMethod)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    (Identique au mode de paiement de votre commande)
                  </p>
                </div>

                <Separator className="my-4" />

                {/* Order Details */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-500" />
                    Détails de la commande
                  </h3>
                  
                  <div className="space-y-3">
                    {paiement.order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        {item.image && (
                          <img 
                            src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantité: {item.quantity} × {formatCurrency(item.price)}
                          </p>
                        </div>
                        <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Shipping Address */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Adresse de livraison
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <p>{paiement.order.shippingAddress.prenom} {paiement.order.shippingAddress.nom}</p>
                    <p>{paiement.order.shippingAddress.adresse}</p>
                    <p>{paiement.order.shippingAddress.codePostal} {paiement.order.shippingAddress.ville}</p>
                    <p>{paiement.order.shippingAddress.pays}</p>
                    <p className="flex items-center gap-2 mt-2">
                      <Phone className="h-4 w-4" />
                      {paiement.order.shippingAddress.telephone}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Montant à rembourser</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(paiement.order.totalAmount)}
                    </span>
                  </div>
                  {paiement.order.discount > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      (Remise appliquée: {formatCurrency(paiement.order.discount)})
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium mb-1">Raison du remboursement</h4>
                  <p className="text-gray-600 dark:text-gray-400">{paiement.reason}</p>
                  {paiement.customReason && (
                    <p className="text-gray-500 mt-1 text-sm">{paiement.customReason}</p>
                  )}
                </div>

                {/* Dates */}
                <div className="mt-4 flex flex-col md:flex-row gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Créé le: {formatDate(paiement.createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Mis à jour: {formatDate(paiement.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default PaiementRemboursementPage;
