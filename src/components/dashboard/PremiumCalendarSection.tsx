
import React from 'react';
import { Zap, Star, Diamond, Sparkles, Crown } from 'lucide-react';
import WeekCalendar from '@/components/Weekcalendar';
import { Appointment } from '@/services/AppointmentService';

interface PremiumCalendarSectionProps {
  refreshTrigger: number;
  onAppointmentClick: (appointment: Appointment) => void;
  onAddAppointment: (date: Date) => void;
  onEditAppointment: (appointment: Appointment) => void;
}

const PremiumCalendarSection: React.FC<PremiumCalendarSectionProps> = ({
  refreshTrigger,
  onAppointmentClick,
  onAddAppointment,
  onEditAppointment
}) => {
  return (
    <div className="calendar-luxury rounded-2xl lg:rounded-3xl premium-shadow-xl border-0 overflow-hidden relative glow-effect">
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary/5 to-purple-500/10"></div>
      <div className="absolute top-4 lg:top-6 right-4 lg:right-6 flex items-center gap-2 lg:gap-3 z-10">
        <div className="flex items-center gap-1 lg:gap-2 bg-white/20 backdrop-blur-sm rounded-full px-2 sm:px-3 lg:px-4 py-1 lg:py-2 border border-white/30">
          <div className="w-2 lg:w-3 h-2 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs lg:text-sm text-primary font-bold">En direct</span>
        </div>
        <Crown className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-primary floating-animation" />
      </div>
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
          <div className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 premium-gradient rounded-xl lg:rounded-2xl flex items-center justify-center">
            <Zap className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold luxury-text-gradient">
              Calendrier Intelligent Premium
            </h2>
            <p className="text-sm lg:text-base text-muted-foreground font-medium">Excellence dans la gestion du temps</p>
          </div>
          <div className="flex items-center gap-1 lg:gap-2 flex-shrink-0">
            <Star className="w-4 lg:w-5 h-4 lg:h-5 text-yellow-400" />
            <Diamond className="w-3 lg:w-4 h-3 lg:h-4 text-primary" />
            <Sparkles className="w-4 lg:w-5 h-4 lg:h-5 text-primary animate-pulse" />
          </div>
        </div>
        <WeekCalendar 
          key={`calendar-${refreshTrigger}`} 
          onAppointmentClick={onAppointmentClick}
          onAddAppointment={onAddAppointment}
          onEditAppointment={onEditAppointment}
        />
      </div>
    </div>
  );
};

export default PremiumCalendarSection;
