
import React from 'react';
import { Calendar, CalendarDays, Grid3X3, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type CalendarView = 'day' | 'week' | 'month';

interface CalendarViewToggleProps {
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const CalendarViewToggle: React.FC<CalendarViewToggleProps> = ({ currentView, onViewChange }) => {
  const views = [
    { id: 'day' as CalendarView, label: 'Jour', icon: Calendar },
    { id: 'week' as CalendarView, label: 'Semaine', icon: CalendarDays },
    { id: 'month' as CalendarView, label: 'Mois', icon: Grid3X3 }
  ];

  return (
    <div className="luxury-card rounded-2xl p-2 premium-shadow border-0 bg-gradient-to-r from-primary/5 to-purple-500/5">
      <div className="flex items-center gap-1">
        <div className="flex items-center gap-2 mr-4 px-3">
          <Crown className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold luxury-text-gradient">Vue</span>
          <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        </div>
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = currentView === view.id;
          
          return (
            <Button
              key={view.id}
              variant={isActive ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange(view.id)}
              className={`
                relative overflow-hidden rounded-xl font-semibold transition-all duration-300
                ${isActive 
                  ? 'btn-premium premium-shadow text-white border-0' 
                  : 'hover:bg-primary/10 text-muted-foreground hover:text-primary border-primary/20'
                }
              `}
            >
              <div className="flex items-center gap-2 relative z-10">
                <Icon className="w-4 h-4" />
                <span>{view.label}</span>
              </div>
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarViewToggle;
