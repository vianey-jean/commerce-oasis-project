/**
 * =============================================================================
 * NotificationCenter - Centre de notifications global
 * =============================================================================
 * Composant accessible depuis la navbar, affiche les notifications en temps réel
 */

import React, { useState, useEffect, useCallback } from 'react';
import notificationApi, { AppNotification } from '@/services/api/notificationApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Bell, BellRing, Check, CheckCheck, Trash2, Info,
  AlertTriangle, CheckCircle, XCircle, Calendar, Package, CreditCard
} from 'lucide-react';

const TYPE_CONFIG = {
  info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  error: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
  rdv: { icon: Calendar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  stock: { icon: Package, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  paiement: { icon: CreditCard, color: 'text-violet-500', bg: 'bg-violet-500/10' },
};

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await notificationApi.getAll();
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.read).length);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      fetchNotifications();
    } catch { /* silent */ }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      fetchNotifications();
    } catch { /* silent */ }
  };

  const handleDelete = async (id: string) => {
    try {
      await notificationApi.delete(id);
      fetchNotifications();
    } catch { /* silent */ }
  };

  const handleClearAll = async () => {
    try {
      await notificationApi.deleteAll();
      fetchNotifications();
    } catch { /* silent */ }
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'À l\'instant';
    if (mins < 60) return `Il y a ${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-2xl h-10 w-10 hover:bg-gradient-to-r hover:from-amber-500/10 hover:to-orange-500/10 transition-all duration-300"
          >
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5 text-amber-500 animate-pulse" />
            ) : (
              <Bell className="h-5 w-5 text-muted-foreground" />
            )}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold shadow-lg shadow-red-500/40 animate-pulse">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent className="w-80 sm:w-96 p-0 rounded-2xl bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-violet-200/20 dark:border-violet-800/20 shadow-2xl" align="end">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-foreground flex items-center gap-2">
              <Bell className="h-4 w-4 text-violet-500" /> Notifications
              {unreadCount > 0 && <Badge className="bg-red-500 text-white text-[10px]">{unreadCount}</Badge>}
            </h3>
            <div className="flex gap-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="text-xs rounded-xl h-7">
                  <CheckCheck className="h-3 w-3 mr-1" /> Tout lire
                </Button>
              )}
              {notifications.length > 0 && (
                <Button variant="ghost" size="sm" onClick={handleClearAll} className="text-xs rounded-xl h-7 text-red-500">
                  <Trash2 className="h-3 w-3 mr-1" /> Vider
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold">Aucune notification</p>
              <p className="text-xs">Vous êtes à jour !</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.slice(0, 30).map((n, i) => {
                const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                const Icon = config.icon;
                return (
                  <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                    className={cn(
                      'flex items-start gap-3 p-3 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group',
                      !n.read && 'bg-violet-500/5'
                    )}
                    onClick={() => !n.read && handleMarkAsRead(n.id)}
                  >
                    <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0', config.bg)}>
                      <Icon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-xs font-bold text-foreground', !n.read && 'text-primary')}>{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!n.read && (
                        <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(n.id); }}
                          className="p-1 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20">
                          <Check className="h-3 w-3 text-green-500" />
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                        className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20">
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
