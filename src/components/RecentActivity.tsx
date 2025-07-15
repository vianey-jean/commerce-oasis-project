
import React from 'react';
import { Clock, Calendar, Edit, Trash, Plus, Crown, Star, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Activity {
  id: string;
  type: 'created' | 'updated' | 'deleted' | 'completed';
  title: string;
  description: string;
  timestamp: Date;
  appointmentTitle?: string;
}

const RecentActivity = () => {
  const activities: Activity[] = [
    {
      id: '1',
      type: 'created',
      title: 'Nouveau rendez-vous créé',
      description: 'Consultation avec Dr. Martin',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      appointmentTitle: 'Consultation médicale'
    },
    {
      id: '2',
      type: 'updated',
      title: 'Rendez-vous modifié',
      description: 'Heure changée pour la réunion équipe',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      appointmentTitle: 'Réunion équipe'
    },
    {
      id: '3',
      type: 'completed',
      title: 'Rendez-vous terminé',
      description: 'Entretien client finalisé',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      appointmentTitle: 'Entretien client'
    },
    {
      id: '4',
      type: 'deleted',
      title: 'Rendez-vous annulé',
      description: 'Formation JavaScript reportée',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
      appointmentTitle: 'Formation'
    }
  ];

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'updated':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'deleted':
        return <Trash className="w-4 h-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'from-green-500/20 to-emerald-500/20';
      case 'updated':
        return 'from-blue-500/20 to-cyan-500/20';
      case 'deleted':
        return 'from-red-500/20 to-pink-500/20';
      case 'completed':
        return 'from-emerald-500/20 to-green-500/20';
      default:
        return 'from-gray-500/20 to-slate-500/20';
    }
  };

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold luxury-text-gradient">
              Activité Récente
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Dernières actions sur vos rendez-vous
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="group relative p-4 rounded-2xl luxury-card premium-hover transition-all duration-300 border border-primary/10 hover:border-primary/30 glow-effect"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${getActivityColor(activity.type)} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 premium-shadow">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="font-bold text-sm text-primary group-hover:luxury-text-gradient transition-all duration-300">
                    {activity.title}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {format(activity.timestamp, 'HH:mm', { locale: fr })}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors duration-300 mb-2">
                  {activity.description}
                </p>
                
                {activity.appointmentTitle && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                    <Calendar className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">
                      {activity.appointmentTitle}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground font-medium">
                {format(activity.timestamp, 'dd/MM', { locale: fr })}
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <button className="text-sm text-primary hover:luxury-text-gradient font-medium transition-all duration-300 hover:scale-105">
            Voir toute l'activité →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
