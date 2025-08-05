
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { Calendar, Clock, TrendingUp, Users, CheckCircle, XCircle, AlertTriangle, Star } from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Stats {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  confirmed: number;
  cancelled: number;
  pending: number;
  avgDuration: number;
}

const AppointmentStats: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    total: 0,
    confirmed: 0,
    cancelled: 0,
    pending: 0,
    avgDuration: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AppointmentService.getAllWithStatus();
        setAppointments(data);
        calculateStats(data);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (appointments: Appointment[]) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const stats: Stats = {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: appointments.length,
      confirmed: 0,
      cancelled: 0,
      pending: 0,
      avgDuration: 0
    };

    let totalDuration = 0;
    let validAppointments = 0;

    appointments.forEach(appointment => {
      const appointmentDate = parseISO(appointment.date);
      
      // Comptages par période
      if (appointment.date === today) {
        stats.today++;
      }
      
      if (isWithinInterval(appointmentDate, { start: weekStart, end: weekEnd })) {
        stats.thisWeek++;
      }
      
      if (isWithinInterval(appointmentDate, { start: monthStart, end: monthEnd })) {
        stats.thisMonth++;
      }

      // Comptages par statut
      switch (appointment.statut) {
        case 'validé':
          stats.confirmed++;
          break;
        case 'annulé':
          stats.cancelled++;
          break;
        default:
          stats.pending++;
      }

      // Calcul durée moyenne
      if (appointment.duree && appointment.duree > 0) {
        totalDuration += appointment.duree;
        validAppointments++;
      }
    });

    if (validAppointments > 0) {
      stats.avgDuration = Math.round(totalDuration / validAppointments);
    }

    setStats(stats);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Aujourd'hui",
      value: stats.today,
      icon: Calendar,
      description: "Rendez-vous du jour",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Cette semaine",
      value: stats.thisWeek,
      icon: TrendingUp,
      description: "Rendez-vous de la semaine",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Ce mois",
      value: stats.thisMonth,
      icon: Users,
      description: "Rendez-vous du mois",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Total",
      value: stats.total,
      icon: Star,
      description: "Tous les rendez-vous",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Confirmés",
      value: stats.confirmed,
      icon: CheckCircle,
      description: "Rendez-vous validés",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Annulés",
      value: stats.cancelled,
      icon: XCircle,
      description: "Rendez-vous annulés",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "En attente",
      value: stats.pending,
      icon: AlertTriangle,
      description: "À confirmer",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Durée moyenne",
      value: `${stats.avgDuration}min`,
      icon: Clock,
      description: "Temps moyen par RDV",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Statistiques</h2>
          <p className="text-muted-foreground">Vue d'ensemble de vos rendez-vous</p>
        </div>
        <Badge variant="outline" className="font-medium">
          Mis à jour maintenant
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="premium-hover glow-effect transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary mb-1">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppointmentStats;
