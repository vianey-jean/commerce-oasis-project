
import React from 'react';
import { Calendar, Crown, Star, Sparkles, Zap } from 'lucide-react';

interface RizikyLoadingSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  overlay?: boolean;
  className?: string;
}

const RizikyLoadingSpinner: React.FC<RizikyLoadingSpinnerProps> = ({ 
  text = "Chargement...", 
  size = 'md',
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28'
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const SpinnerContent = () => (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Spinner principal avec design Riziky */}
      <div className="relative mb-6 floating-animation">
        <div className={`${sizeClasses[size]} border-4 border-primary/30 border-t-primary rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-purple-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        <div className={`absolute inset-4 ${size === 'sm' ? 'inset-2' : size === 'lg' ? 'inset-6' : 'inset-4'} bg-primary/10 rounded-full blur-sm`}></div>
        
        {/* Icône centrale */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="premium-gradient rounded-full p-2">
            <Calendar className={`${iconSizes[size]} text-white`} />
          </div>
        </div>
        
        {/* Éléments décoratifs */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
          <Crown className="w-3 h-3 text-white" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center animate-pulse delay-300">
          <Star className="w-2 h-2 text-white" />
        </div>
        <div className="absolute top-1/2 -left-3 w-4 h-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center animate-pulse delay-500">
          <Zap className="w-2 h-2 text-white" />
        </div>
      </div>

      {/* Texte avec style premium */}
      <div className="text-center">
        <div className={`flex items-center justify-center gap-3 ${textSizes[size]} font-bold luxury-text-gradient mb-2`}>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span>Riziky Agendas Premium</span>
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-medium">{text}</p>
      </div>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 premium-shadow-xl border-0 max-w-md mx-4">
          <SpinnerContent />
        </div>
      </div>
    );
  }

  return <SpinnerContent />;
};

export default RizikyLoadingSpinner;
