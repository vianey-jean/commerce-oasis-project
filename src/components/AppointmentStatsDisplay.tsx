
import React, { useState, useEffect } from 'react';
import { AppointmentService } from '@/services/AppointmentService';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO } from 'date-fns';
import { Calendar, Clock, TrendingUp, Star } from 'lucide-react';

interface StatsDisplayProps {
  refreshTrigger?: number;
}

const AppointmentStatsDisplay: React.FC<StatsDisplayProps> = ({ refreshTrigger = 0 }) => {
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const appointments = await AppointmentService.getAllWithStatus();
      
      const now = new Date();
      const today = format(now, 'yyyy-MM-dd');
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);

      // Filtrer seulement les rendez-vous validés
      const validAppointments = appointments.filter(apt => apt.statut === 'validé');

      const newStats = {
        today: validAppointments.filter(apt => apt.date === today).length,
        thisWeek: validAppointments.filter(apt => {
          const aptDate = parseISO(apt.date);
          return isWithinInterval(aptDate, { start: weekStart, end: weekEnd });
        }).length,
        thisMonth: validAppointments.filter(apt => {
          const aptDate = parseISO(apt.date);
          return isWithinInterval(aptDate, { start: monthStart, end: monthEnd });
        }).length,
        thisYear: validAppointments.filter(apt => {
          const aptDate = parseISO(apt.date);
          return isWithinInterval(aptDate, { start: yearStart, end: yearEnd });
        }).length
      };

      setStats(newStats);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="luxury-card p-4 rounded-xl animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: "Aujourd'hui",
      value: stats.today,
      icon: Calendar,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      textColor: "text-white"
    },
    {
      label: "Cette semaine",
      value: stats.thisWeek,
      icon: Clock,
      bgColor: "bg-gradient-to-r from-green-500 to-green-600",
      textColor: "text-white"
    },
    {
      label: "Ce mois",
      value: stats.thisMonth,
      icon: TrendingUp,
      bgColor: "bg-gradient-to-r from-purple-500 to-purple-600",
      textColor: "text-white"
    },
    {
      label: "Cette année",
      value: stats.thisYear,
      icon: Star,
      bgColor: "bg-gradient-to-r from-amber-500 to-amber-600",
      textColor: "text-white"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
      {statItems.map((item, index) => (
        <div 
          key={index}
          className={`${item.bgColor} ${item.textColor} p-4 rounded-xl premium-shadow-lg relative overflow-hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-xs lg:text-sm font-medium opacity-90 mb-1">
                {item.label}
              </p>
              <p className="text-xl lg:text-2xl font-bold">
                {item.value}
              </p>
            </div>
            <item.icon className="w-6 h-6 lg:w-8 lg:h-8 opacity-80" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentStatsDisplay;
