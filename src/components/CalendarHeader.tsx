
import { ArrowLeft, ArrowRight, Calendar, Sparkles } from 'lucide-react';

/**
 * Props pour l'en-tête du calendrier
 */
type CalendarHeaderProps = {
  title: string;
  onPrevious: () => void;
  onNext: () => void;
};

/**
 * Composant pour l'en-tête du calendrier avec contrôles de navigation modernes
 */
const CalendarHeader = ({ title, onPrevious, onNext }: CalendarHeaderProps) => {
  return (
    <div className="bg-gradient-to-r from-violet-500 via-purple-600 to-indigo-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent"></div>
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <div className="flex items-center gap-1 mt-1">
              <Sparkles className="w-3 h-3 text-violet-200" />
              <span className="text-sm text-violet-100">Interface premium</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevious}
            className="group flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
          
          <button
            onClick={onNext}
            className="group flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            <span className="hidden sm:inline">Suivant</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
      
      {/* Decoration */}
      <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-transparent rounded-full blur-lg"></div>
    </div>
  );
};

export default CalendarHeader;
