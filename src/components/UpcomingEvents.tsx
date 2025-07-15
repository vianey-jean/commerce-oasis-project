
import React from 'react';
import { Calendar, Clock, MapPin, Users, Crown, Star, Sparkles, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, addDays, addHours } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
  location: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  attendees?: number;
}

const UpcomingEvents = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Réunion équipe marketing',
      description: 'Planification campagne Q4',
      date: addHours(new Date(), 2),
      duration: 60,
      location: 'Salle de conférence A',
      priority: 'high',
      category: 'Travail',
      attendees: 5
    },
    {
      id: '2',
      title: 'Consultation médicale',
      description: 'Contrôle annuel avec Dr. Martin',
      date: addDays(new Date(), 1),
      duration: 45,
      location: 'Cabinet médical',
      priority: 'medium',
      category: 'Santé'
    },
    {
      id: '3',
      title: 'Formation React',
      description: 'Session avancée sur les hooks',
      date: addDays(new Date(), 2),
      duration: 120,
      location: 'Centre de formation',
      priority: 'low',
      category: 'Formation',
      attendees: 12
    },
    {
      id: '4',
      title: 'Dîner avec clients',
      description: 'Présentation nouveau produit',
      date: addDays(new Date(), 3),
      duration: 90,
      location: 'Restaurant Le Gourmet',
      priority: 'high',
      category: 'Business'
    }
  ];

  const getPriorityColor = (priority: Event['priority']) => {
    switch (priority) {
      case 'high':
        return 'from-red-500 to-pink-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getPriorityLabel = (priority: Event['priority']) => {
    switch (priority) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Important';
      case 'low':
        return 'Normal';
      default:
        return 'Normal';
    }
  };

  const isUpcoming = (date: Date) => {
    const diffInHours = (date.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    return diffInHours <= 24;
  };

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-xl font-bold luxury-text-gradient">
              Événements à Venir
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium">
              Vos prochains rendez-vous importants
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary animate-pulse" />
            <Crown className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="group relative p-4 rounded-2xl luxury-card premium-hover transition-all duration-300 border border-primary/10 hover:border-primary/30 glow-effect overflow-hidden"
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Priority indicator */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getPriorityColor(event.priority)} rounded-l-2xl`}></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-primary group-hover:luxury-text-gradient transition-all duration-300">
                      {event.title}
                    </h4>
                    {isUpcoming(event.date) && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                        <span className="text-xs text-red-500 font-bold">Bientôt</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors duration-300">
                    {event.description}
                  </p>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={`bg-gradient-to-r ${getPriorityColor(event.priority)} text-white border-0 premium-shadow`}
                >
                  {getPriorityLabel(event.priority)}
                </Badge>
              </div>
              
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-blue-500" />
                  </div>
                  <span className="text-muted-foreground">
                    {format(event.date, 'EEEE d MMMM', { locale: fr })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Clock className="w-3 h-3 text-purple-500" />
                  </div>
                  <span className="text-muted-foreground">
                    {format(event.date, 'HH:mm')} ({event.duration}min)
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-green-500" />
                  </div>
                  <span className="text-muted-foreground truncate">
                    {event.location}
                  </span>
                </div>
                
                {event.attendees && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Users className="w-3 h-3 text-orange-500" />
                    </div>
                    <span className="text-muted-foreground">
                      {event.attendees} participant{event.attendees > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Category */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                  <Star className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium text-primary">
                    {event.category}
                  </span>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                </div>
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        ))}
        
        <div className="text-center pt-4">
          <button className="text-sm text-primary hover:luxury-text-gradient font-medium transition-all duration-300 hover:scale-105">
            Voir tous les événements →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEvents;
