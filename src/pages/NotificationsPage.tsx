/**
 * NotificationsPage.tsx
 * Centre de notifications de l'application
 * Affiche toutes les alertes, rappels et messages système
 */

import React, { useState, useMemo } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Bell, 
  BellRing, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle,
  Settings,
  Trash2,
  CheckCheck,
  Filter,
  Clock,
  Package,
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  ShieldAlert,
  TrendingUp,
  Archive
} from 'lucide-react';

// Types pour les notifications
type NotificationType = 'info' | 'success' | 'warning' | 'error';
type NotificationCategory = 'system' | 'ventes' | 'stock' | 'clients' | 'finance' | 'rdv';

interface Notification {
  id: string;
  titre: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  date: string;
  lue: boolean;
  action?: string;
}

// Données de démonstration
const notificationsData: Notification[] = [
  {
    id: '1',
    titre: 'Nouvelle commande reçue',
    message: 'Commande #2847 de TechCorp SARL pour un montant de 4 500€',
    type: 'success',
    category: 'ventes',
    date: '2024-01-20 14:30',
    lue: false,
    action: 'Voir la commande'
  },
  {
    id: '2',
    titre: 'Stock critique',
    message: 'Le produit "iPhone 15 Pro" a atteint le seuil minimal de stock (5 unités restantes)',
    type: 'warning',
    category: 'stock',
    date: '2024-01-20 12:15',
    lue: false,
    action: 'Réapprovisionner'
  },
  {
    id: '3',
    titre: 'Paiement reçu',
    message: 'Paiement de 12 000€ reçu de InnovaStart pour la facture FAC-2024-042',
    type: 'success',
    category: 'finance',
    date: '2024-01-20 10:45',
    lue: true,
  },
  {
    id: '4',
    titre: 'Rendez-vous dans 1 heure',
    message: 'Réunion avec Jean Bernard (DataFlow Inc) prévue à 15h00',
    type: 'info',
    category: 'rdv',
    date: '2024-01-20 14:00',
    lue: false,
    action: 'Voir détails'
  },
  {
    id: '5',
    titre: 'Échec de synchronisation',
    message: 'La synchronisation avec le système externe a échoué. Veuillez vérifier la connexion.',
    type: 'error',
    category: 'system',
    date: '2024-01-20 09:30',
    lue: true,
  },
  {
    id: '6',
    titre: 'Nouveau client inscrit',
    message: 'Global Services vient de créer un compte sur votre plateforme',
    type: 'info',
    category: 'clients',
    date: '2024-01-19 16:20',
    lue: true,
  },
  {
    id: '7',
    titre: 'Objectif de ventes atteint !',
    message: 'Félicitations ! Vous avez atteint 110% de votre objectif mensuel',
    type: 'success',
    category: 'ventes',
    date: '2024-01-19 18:00',
    lue: true,
  },
  {
    id: '8',
    titre: 'Facture en retard',
    message: 'La facture FAC-2024-038 de Société DEF est en retard de 15 jours',
    type: 'warning',
    category: 'finance',
    date: '2024-01-19 09:00',
    lue: false,
    action: 'Envoyer relance'
  },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData);
  const [activeTab, setActiveTab] = useState('toutes');
  const [showSettings, setShowSettings] = useState(false);

  // Paramètres de notification
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    ventes: true,
    stock: true,
    clients: true,
    finance: true,
    rdv: true,
    system: true,
  });

  const stats = useMemo(() => ({
    total: notifications.length,
    nonLues: notifications.filter(n => !n.lue).length,
    alertes: notifications.filter(n => n.type === 'warning' || n.type === 'error').length,
  }), [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeTab === 'toutes') return notifications;
    if (activeTab === 'non-lues') return notifications.filter(n => !n.lue);
    if (activeTab === 'alertes') return notifications.filter(n => n.type === 'warning' || n.type === 'error');
    return notifications.filter(n => n.category === activeTab);
  }, [notifications, activeTab]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, lue: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, lue: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getTypeBg = (type: NotificationType) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'ventes': return <TrendingUp className="h-4 w-4" />;
      case 'stock': return <Package className="h-4 w-4" />;
      case 'clients': return <Users className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      case 'rdv': return <Calendar className="h-4 w-4" />;
      default: return <ShieldAlert className="h-4 w-4" />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 dark:from-gray-900 dark:via-slate-900 dark:to-amber-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <BellRing className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  {stats.nonLues} non lue{stats.nonLues > 1 ? 's' : ''} sur {stats.total}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCheck className="h-4 w-4 mr-2" />
                Tout marquer lu
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <Bell className="h-6 w-6 mx-auto text-amber-600 mb-2" />
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <BellRing className="h-6 w-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{stats.nonLues}</p>
                <p className="text-xs text-muted-foreground">Non lues</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur border-0 shadow-lg">
              <CardContent className="p-4 text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-yellow-600 mb-2" />
                <p className="text-2xl font-bold">{stats.alertes}</p>
                <p className="text-xs text-muted-foreground">Alertes</p>
              </CardContent>
            </Card>
          </div>

          {/* Paramètres (conditionnels) */}
          {showSettings && (
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Paramètres de notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notifications par email</span>
                    </div>
                    <Switch 
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notifications push</span>
                    </div>
                    <Switch 
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Catégories actives</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { key: 'ventes', label: 'Ventes', icon: TrendingUp },
                      { key: 'stock', label: 'Stock', icon: Package },
                      { key: 'clients', label: 'Clients', icon: Users },
                      { key: 'finance', label: 'Finance', icon: DollarSign },
                      { key: 'rdv', label: 'Rendez-vous', icon: Calendar },
                      { key: 'system', label: 'Système', icon: ShieldAlert },
                    ].map(({ key, label, icon: Icon }) => (
                      <div key={key} className="flex items-center justify-between p-2 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs">{label}</span>
                        </div>
                        <Switch 
                          checked={settings[key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => setSettings({...settings, [key]: checked})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabs de filtrage */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="w-full justify-start bg-white/80 dark:bg-gray-800/80 backdrop-blur overflow-x-auto">
              <TabsTrigger value="toutes">Toutes</TabsTrigger>
              <TabsTrigger value="non-lues" className="relative">
                Non lues
                {stats.nonLues > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {stats.nonLues}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="alertes">Alertes</TabsTrigger>
              <TabsTrigger value="ventes">Ventes</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-3">
              {filteredNotifications.length === 0 ? (
                <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur border-0 shadow-xl">
                  <CardContent className="p-8 text-center">
                    <Archive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium">Aucune notification</p>
                    <p className="text-sm text-muted-foreground">
                      Vous n'avez aucune notification dans cette catégorie
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`border shadow-lg transition-all hover:shadow-xl ${getTypeBg(notification.type)} ${!notification.lue ? 'ring-2 ring-amber-500/30' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0">
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className={`font-semibold ${!notification.lue ? 'text-foreground' : 'text-muted-foreground'}`}>
                                  {notification.titre}
                                </h3>
                                {!notification.lue && (
                                  <Badge className="bg-amber-500 text-white text-xs">Nouveau</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {notification.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  {getCategoryIcon(notification.category)}
                                  {notification.category}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center gap-2 mt-3">
                            {notification.action && (
                              <Button size="sm" variant="outline" className="h-8">
                                {notification.action}
                              </Button>
                            )}
                            {!notification.lue && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8"
                                onClick={() => markAsRead(notification.id)}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Marquer lu
                              </Button>
                            )}
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default NotificationsPage;
