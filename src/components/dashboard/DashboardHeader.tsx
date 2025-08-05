
import React from 'react';
import { Calendar, Crown, Star, Diamond, Sparkles } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="mb-8 lg:mb-12 text-center">
      <div className="inline-flex items-center justify-center w-20 sm:w-24 lg:w-28 h-20 sm:h-24 lg:h-28 premium-gradient rounded-2xl lg:rounded-3xl premium-shadow-xl mb-6 lg:mb-8 relative overflow-hidden floating-animation">
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl lg:rounded-3xl"></div>
        <Calendar className="w-8 sm:w-10 lg:w-14 h-8 sm:h-10 lg:h-14 text-white relative z-10" />
        <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
          <Crown className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-white" />
        </div>
        <div className="absolute -bottom-1 -left-1 lg:-bottom-2 lg:-left-2 w-5 sm:w-6 lg:w-8 h-5 sm:h-6 lg:h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
          <Star className="w-3 sm:w-4 lg:w-4 h-3 sm:h-4 lg:h-4 text-white" />
        </div>
      </div>
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold luxury-text-gradient mb-3 lg:mb-4">
        Tableau de bord Premium
      </h1>
      <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-xl lg:max-w-2xl mx-auto px-4">
        <Diamond className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
        <p className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium text-center">
          Gérez vos rendez-vous avec élégance et sophistication
        </p>
        <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-primary animate-pulse flex-shrink-0" />
      </div>
    </div>
  );
};

export default DashboardHeader;
