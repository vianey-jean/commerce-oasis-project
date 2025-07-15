
import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Crown, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCard {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  color: string;
}

const DashboardStats = () => {
  const stats: StatCard[] = [
    {
      title: "Rendez-vous ce mois",
      value: "24",
      change: "+12%",
      trend: 'up',
      icon: <Calendar className="w-6 h-6" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Temps total planifié",
      value: "32h",
      change: "+8%",
      trend: 'up',
      icon: <Clock className="w-6 h-6" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Rendez-vous complétés",
      value: "18",
      change: "+15%",
      trend: 'up',
      icon: <CheckCircle className="w-6 h-6" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "En attente",
      value: "6",
      change: "-3%",
      trend: 'down',
      icon: <AlertCircle className="w-6 h-6" />,
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="relative overflow-hidden luxury-card premium-hover glow-effect border-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`}></div>
          <div className="absolute top-4 right-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white premium-shadow`}>
              {stat.icon}
            </div>
          </div>
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold luxury-text-gradient mb-1">
                  {stat.value}
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`w-4 h-4 ${stat.trend === 'down' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;
