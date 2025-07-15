
import React, { useState } from 'react';
import { Bell, BellRing, Check, X, Clock, Calendar, Crown, Star, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  id: string;
  type: 'reminder' | 'update' | 'cancellation' | 'new';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionRequired?: boolean;
  appointmentId?: string;
}

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'reminder',
      title: 'Rendez-vous dans 30 minutes',
      message: 'Réunion équipe marketing - Salle de conférence A',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      actionRequired: true,
      appointmentId: 'apt-1'
    },
    {
      id: '2',
      type: 'update',
      title: 'Rendez-vous modifié',
      message: 'Consultation Dr. Martin reportée à 15h00',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      appointmentId: 'apt-2'
    },
    {
      id: '3',
      type: 'new',
      title: 'Nouveau rendez-vous',
      message: 'Formation React - Centre de formation',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      appointmentId: 'apt-3'
    },
    {
      id: '4',
      type: 'cancellation',
      title: 'Rendez-vous annulé',
      message: 'Dîner client reporté à une date ultérieure',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      read: true,
      appointmentId: 'apt-4'
    }
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return <BellRing className="w-4 h-4 text-blue-500" />;
      case 'update':
        return <Clock className="w-4 h-4 text-orange-500" />;
      case 'new':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'cancellation':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'update':
        return 'from-orange-500/20 to-yellow-500/20';
      case 'new':
        return 'from-green-500/20 to-emerald-500/20';
      case 'cancellation':
        return 'from-red-500/20 to-pink-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  const getTypeLabel = (type: Notification['type']) => {
    switch (type) {
      case 'reminder':
        return 'Rappel';
      case 'update':
        return 'Modification';
      case 'new':
        return 'Nouveau';
      case 'cancellation':
        return 'Annulation';
      default:
        return 'Notification';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center relative">
            <Bell className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{unreadCount}</span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold luxury-text-gradient">
              Notifications
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              {unreadCount} nouvelle{unreadCount !== 1 ? 's' : ''} notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 rounded-xl"
              >
                <Check className="w-4 h-4 mr-1" />
                Tout lire
              </Button>
            )}
            <Crown className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              Aucune notification
            </p>
            <p className="text-sm text-muted-foreground">
              Vous êtes à jour !
            </p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`group relative p-4 rounded-2xl luxury-card premium-hover transition-all duration-300 border overflow-hidden ${
                notification.read 
                  ? 'border-primary/10 opacity-75' 
                  : 'border-primary/30 glow-effect'
              }`}
            >
              {/* Background gradient for unread */}
              {!notification.read && (
                <div className={`absolute inset-0 bg-gradient-to-br ${getNotificationColor(notification.type)} opacity-50`}></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 premium-shadow">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className={`font-bold text-sm ${
                        notification.read 
                          ? 'text-muted-foreground' 
                          : 'text-primary group-hover:luxury-text-gradient'
                      } transition-all duration-300`}>
                        {notification.title}
                      </h4>
                      
                      <Badge 
                        variant="outline" 
                        className={`text-xs bg-gradient-to-r ${getNotificationColor(notification.type)} border-0`}
                      >
                        {getTypeLabel(notification.type)}
                      </Badge>
                      
                      {notification.actionRequired && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-red-500 font-bold">Action requise</span>
                        </div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      notification.read 
                        ? 'text-muted-foreground' 
                        : 'text-muted-foreground group-hover:text-primary/80'
                    } transition-colors duration-300`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {format(notification.timestamp, 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-primary hover:bg-primary/10 rounded-lg"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Lu
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => deleteNotification(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Unread indicator */}
              {!notification.read && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              )}
              
              {/* Hover effect */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))
        )}
        
        {notifications.length > 0 && (
          <div className="text-center pt-4">
            <button className="text-sm text-primary hover:luxury-text-gradient font-medium transition-all duration-300 hover:scale-105">
              Voir l'historique des notifications →
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationPanel;
