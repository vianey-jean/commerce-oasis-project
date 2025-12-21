import React, { useEffect, useState, useCallback } from 'react';
import { RDV } from '@/types/rdv';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  BellRing, 
  Calendar, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  X,
  Phone,
  MapPin
} from 'lucide-react';
import { format, parseISO, isToday, isBefore, addMinutes, differenceInMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface RdvNotificationsProps {
  rdvs: RDV[];
  onRdvClick: (rdv: RDV) => void;
  onMarkAsNotified: (rdvId: string) => void;
}

interface NotificationItem {
  rdv: RDV;
  type: 'upcoming' | 'now' | 'passed';
  message: string;
}

const RdvNotifications: React.FC<RdvNotificationsProps> = ({
  rdvs,
  onRdvClick,
  onMarkAsNotified,
}) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const checkNotifications = useCallback(() => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const currentTime = format(now, 'HH:mm');
    
    const newNotifications: NotificationItem[] = [];

    rdvs.forEach((rdv) => {
      if (rdv.statut === 'annule' || rdv.statut === 'termine') return;

      // RDV d'aujourd'hui
      if (rdv.date === today) {
        const rdvDateTime = parseISO(`${rdv.date}T${rdv.heureDebut}`);
        const minutesUntil = differenceInMinutes(rdvDateTime, now);

        // RDV dans les 30 prochaines minutes
        if (minutesUntil > 0 && minutesUntil <= 30) {
          newNotifications.push({
            rdv,
            type: 'upcoming',
            message: `Dans ${minutesUntil} minutes`,
          });

          // Notifier si pas encore fait
          if (!rdv.rappelEnvoye) {
            toast({
              title: '⏰ Rappel de rendez-vous',
              description: `"${rdv.titre}" avec ${rdv.clientNom} dans ${minutesUntil} min`,
              duration: 10000,
            });
          }
        }
        // RDV en cours (l'heure actuelle est entre début et fin)
        else if (rdv.heureDebut <= currentTime && currentTime < rdv.heureFin) {
          newNotifications.push({
            rdv,
            type: 'now',
            message: 'En cours maintenant',
          });
        }
        // RDV passé aujourd'hui et non marqué comme terminé
        else if (rdv.heureFin < currentTime) {
          newNotifications.push({
            rdv,
            type: 'passed',
            message: 'Terminé - À marquer comme terminé',
          });

          // Notifier si pas encore fait
          if (!rdv.notificationEnvoyee) {
            toast({
              title: '📋 Rendez-vous terminé',
              description: `"${rdv.titre}" est passé. Pensez à le marquer comme terminé.`,
              duration: 8000,
            });
          }
        }
      }
      // RDV passé (date antérieure) et non terminé
      else if (rdv.date < today) {
        newNotifications.push({
          rdv,
          type: 'passed',
          message: `Passé le ${format(parseISO(rdv.date), 'd MMM', { locale: fr })}`,
        });
      }
    });

    setNotifications(newNotifications);
  }, [rdvs, toast]);

  // Vérifier les notifications toutes les minutes
  useEffect(() => {
    checkNotifications();
    const interval = setInterval(checkNotifications, 60000);
    return () => clearInterval(interval);
  }, [checkNotifications]);

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'now':
        return <BellRing className="h-4 w-4 text-green-500 animate-pulse" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'passed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
  };

  const getNotificationStyle = (type: NotificationItem['type']) => {
    switch (type) {
      case 'now':
        return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'upcoming':
        return 'border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      case 'passed':
        return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/20';
    }
  };

  const upcomingCount = notifications.filter(n => n.type === 'upcoming' || n.type === 'now').length;
  const passedCount = notifications.filter(n => n.type === 'passed').length;
  const totalCount = notifications.length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          aria-label={`${totalCount} notifications`}
        >
          {totalCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {totalCount > 0 && (
            <span className={cn(
              "absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs flex items-center justify-center text-white",
              passedCount > 0 ? "bg-red-500" : "bg-orange-500"
            )}>
              {totalCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" />
            Notifications RDV
            {totalCount > 0 && (
              <Badge variant="secondary">{totalCount}</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {notifications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <p className="text-muted-foreground">
                  Aucune notification en attente
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* RDV en cours */}
              {notifications.filter(n => n.type === 'now').length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-green-600 flex items-center gap-2">
                    <BellRing className="h-4 w-4" />
                    En cours maintenant
                  </h3>
                  {notifications
                    .filter(n => n.type === 'now')
                    .map((notification) => (
                      <NotificationCard
                        key={notification.rdv.id}
                        notification={notification}
                        onClick={() => {
                          onRdvClick(notification.rdv);
                          setIsOpen(false);
                        }}
                        onDismiss={() => onMarkAsNotified(notification.rdv.id)}
                        getIcon={getNotificationIcon}
                        getStyle={getNotificationStyle}
                      />
                    ))}
                </div>
              )}

              {/* RDV à venir */}
              {notifications.filter(n => n.type === 'upcoming').length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-orange-600 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    À venir bientôt
                  </h3>
                  {notifications
                    .filter(n => n.type === 'upcoming')
                    .map((notification) => (
                      <NotificationCard
                        key={notification.rdv.id}
                        notification={notification}
                        onClick={() => {
                          onRdvClick(notification.rdv);
                          setIsOpen(false);
                        }}
                        onDismiss={() => onMarkAsNotified(notification.rdv.id)}
                        getIcon={getNotificationIcon}
                        getStyle={getNotificationStyle}
                      />
                    ))}
                </div>
              )}

              {/* RDV passés */}
              {notifications.filter(n => n.type === 'passed').length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Passés (à traiter)
                  </h3>
                  {notifications
                    .filter(n => n.type === 'passed')
                    .map((notification) => (
                      <NotificationCard
                        key={notification.rdv.id}
                        notification={notification}
                        onClick={() => {
                          onRdvClick(notification.rdv);
                          setIsOpen(false);
                        }}
                        onDismiss={() => onMarkAsNotified(notification.rdv.id)}
                        getIcon={getNotificationIcon}
                        getStyle={getNotificationStyle}
                      />
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

interface NotificationCardProps {
  notification: NotificationItem;
  onClick: () => void;
  onDismiss: () => void;
  getIcon: (type: NotificationItem['type']) => React.ReactNode;
  getStyle: (type: NotificationItem['type']) => string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onClick,
  onDismiss,
  getIcon,
  getStyle,
}) => {
  const { rdv, type, message } = notification;

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        getStyle(type)
      )}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {getIcon(type)}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{rdv.titre}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span>{rdv.clientNom}</span>
                <span>•</span>
                <span>{rdv.heureDebut} - {rdv.heureFin}</span>
              </div>
              <Badge variant="outline" className="mt-1 text-xs">
                {message}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        {rdv.clientTelephone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
            <Phone className="h-3 w-3" />
            <span>{rdv.clientTelephone}</span>
          </div>
        )}
        
        {rdv.lieu && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
            <MapPin className="h-3 w-3" />
            <span className="truncate">{rdv.lieu}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RdvNotifications;
