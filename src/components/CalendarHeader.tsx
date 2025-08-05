
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Crown, Star } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CalendarHeaderProps {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  currentDate?: Date;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  title, 
  onPrevious, 
  onNext,
  currentDate = new Date()
}) => {
  return (
    <div className="premium-gradient text-white p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Calendar className="w-6 h-6 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              {title}
            </h2>
            <p className="text-white/90 text-lg font-medium">
              {format(currentDate, 'MMMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-white font-medium">Live</span>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onPrevious}
              className="text-white hover:bg-white/20 w-10 h-10 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onNext}
              className="text-white hover:bg-white/20 w-10 h-10 p-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
          <Star className="w-5 h-5 text-yellow-300 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
