
import React, { useState } from 'react';
import { Grid3X3, LayoutDashboard, Settings, Crown, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardStats from './DashboardStats';
import CalendarViewToggle from './CalendarViewToggle';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import UpcomingEvents from './UpcomingEvents';
import WeatherWidget from './WeatherWidget';
import TaskList from './TaskList';
import CalendarSettings from './CalendarSettings';
import NotificationPanel from './NotificationPanel';
import WeekCalendar from './Weekcalendar';
import { Appointment } from '@/services/AppointmentService';

type CalendarView = 'day' | 'week' | 'month';
type DashboardTab = 'calendar' | 'overview' | 'settings';

interface CompleteDashboardProps {
  onAppointmentClick: (appointment: Appointment) => void;
  onAppointmentDrop?: (appointment: Appointment, newDate: Date, originalAppointment: Appointment) => void;
  refreshTrigger: number;
}

const CompleteDashboard: React.FC<CompleteDashboardProps> = ({ 
  onAppointmentClick, 
  onAppointmentDrop,
  refreshTrigger 
}) => {
  const [currentView, setCurrentView] = useState<CalendarView>('week');
  const [activeTab, setActiveTab] = useState<DashboardTab>('calendar');

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action:', actionId);
    // Ici on pourrait déclencher les actions correspondantes
  };

  const tabs = [
    { id: 'calendar' as DashboardTab, label: 'Calendrier', icon: LayoutDashboard },
    { id: 'overview' as DashboardTab, label: 'Vue d\'ensemble', icon: Grid3X3 },
    { id: 'settings' as DashboardTab, label: 'Paramètres', icon: Settings }
  ];

  return (
    <div className="space-y-8">
      {/* Navigation des onglets premium */}
      <div className="luxury-card rounded-3xl p-2 premium-shadow border-0 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative overflow-hidden rounded-2xl font-semibold transition-all duration-300 px-6 py-3
                    ${isActive 
                      ? 'btn-premium premium-shadow text-white border-0' 
                      : 'hover:bg-primary/10 text-muted-foreground hover:text-primary border-primary/20'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
                  )}
                </Button>
              );
            })}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-bold">Dashboard Premium</span>
            </div>
            <Crown className="w-6 h-6 text-primary floating-animation" />
          </div>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'calendar' && (
        <div className="space-y-8">
          {/* Statistiques dashboard */}
          <DashboardStats />
          
          {/* Toggle de vue calendrier */}
          <div className="flex items-center justify-between">
            <CalendarViewToggle 
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
          
          {/* Calendrier principal */}
          <div className="calendar-luxury rounded-3xl premium-shadow-xl border-0 overflow-hidden relative glow-effect">
            <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary/5 to-purple-500/10"></div>
            <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-primary font-bold">En direct</span>
              </div>
              <Crown className="w-6 h-6 text-primary floating-animation" />
            </div>
            <div className="relative z-10 p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold luxury-text-gradient">
                    Calendrier Intelligent Premium
                  </h2>
                  <p className="text-muted-foreground font-medium">Excellence dans la gestion du temps</p>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
              </div>
              <WeekCalendar 
                key={`calendar-${refreshTrigger}`} 
                onAppointmentClick={onAppointmentClick}
                onAppointmentDrop={onAppointmentDrop}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Statistiques dashboard */}
          <DashboardStats />
          
          {/* Actions rapides */}
          <QuickActions onAction={handleQuickAction} />
          
          {/* Grille de widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Colonne 1 */}
            <div className="space-y-8">
              <UpcomingEvents />
              <WeatherWidget />
            </div>
            
            {/* Colonne 2 */}
            <div className="space-y-8">
              <RecentActivity />
              <TaskList />
            </div>
            
            {/* Colonne 3 */}
            <div className="space-y-8">
              <NotificationPanel />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-8">
          <div className="max-w-4xl mx-auto">
            <CalendarSettings />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteDashboard;
