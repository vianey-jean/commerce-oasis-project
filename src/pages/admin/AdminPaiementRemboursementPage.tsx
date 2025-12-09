
import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { paiementRemboursementAPI } from '@/services/paiementRemboursementAPI';
import { PaiementRemboursement } from '@/types/paiementRemboursement';
import { 
  CreditCard, 
  Truck, 
  Package,
  MapPin,
  Phone,
  User,
  Mail,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminPaiementRemboursementPage: React.FC = () => {
  const [paiements, setPaiements] = useState<PaiementRemboursement[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadPaiements();
  }, []);

  const loadPaiements = async () => {
    try {
      const response = await paiementRemboursementAPI.getAll();
      setPaiements(response.data);
    } catch (error) {
      console.error('Erreur chargement paiements:', error);
      toast.error('Erreur lors du chargement des paiements');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    try {
      const response = await paiementRemboursementAPI.updateStatus(id, newStatus);
      setPaiements(prev => prev.map(p => 
        p.id === id ? response.data : p
      ));
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      console.error('Erreur update status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
    } finally {
      setUpdatingId(null);
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Paiement Remboursement
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gérez les remboursements acceptés
          </p>
        </div>

        {paiements.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <AlertCircle className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Aucun remboursement accepté</h2>
              <p className="text-gray-500">Il n'y a pas de remboursement accepté pour le moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {paiements.map((paiement) => (
              <Card key={paiement.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Remboursement #{paiement.id}
                        {paiement.clientValidated && (
                          <Badge className="bg-green-500">Validé par client</Badge>
                        )}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Commande: {paiement.orderId}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(paiement.status)}
                      <Select
                        value={paiement.status}
                        onValueChange={(value) => handleStatusChange(paiement.id, value)}
                        disabled={updatingId === paiement.id || paiement.clientValidated}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Changer le statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debut">Début</SelectItem>
                          <SelectItem value="en cours">En cours</SelectItem>
                          <SelectItem value="payé">Payé</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {/* Client Info */}
                  <div className="mb-6 grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <User className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-500">Client</p>
                        <p className="font-medium">{paiement.userName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{paiement.userEmail}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      {getPaymentMethodIcon(paiement.order.paymentMethod)}
                      Mode de remboursement
                    </h3>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="font-medium text-blue-800 dark:text-blue-200">
                        {getPaymentMethodLabel(paiement.order.paymentMethod)}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Le remboursement doit être effectué via le même mode de paiement que la commande
                      </p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Order Details */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-5 w-5 text-purple-500" />
                      Produits de la commande
                    </h3>
                    
                    <div className="space-y-2">
                      {paiement.order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          {item.image && (
                            <img 
                              src={`${import.meta.env.VITE_API_BASE_URL}${item.image}`}
                              alt={item.name}
                              className="w-14 h-14 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{item.name}</p>
                            <p className="text-sm text-gray-500">
                              {item.quantity} × {formatCurrency(item.price)}
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
                      Adresse du client
                    </h3>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-sm">
                      <p className="font-medium">{paiement.order.shippingAddress.prenom} {paiement.order.shippingAddress.nom}</p>
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
                      <span className="text-lg font-semibold">Montant total à rembourser</span>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(paiement.order.totalAmount)}
                      </span>
                    </div>
                    {paiement.order.discount > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Montant original: {formatCurrency(paiement.order.originalAmount)} - Remise: {formatCurrency(paiement.order.discount)}
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

                  {/* Client Validation Status */}
                  <div className="mt-4">
                    {paiement.clientValidated ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <CheckCircle className="h-5 w-5" />
                        <span>Le client a confirmé la réception du remboursement</span>
                      </div>
                    ) : paiement.status === 'payé' ? (
                      <div className="flex items-center gap-2 text-orange-600 bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                        <Clock className="h-5 w-5" />
                        <span>En attente de confirmation du client</span>
                      </div>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPaiementRemboursementPage;
