
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Search, Sparkles, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="mt-[80px] min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="text-center relative z-10 max-w-md">
        {/* Icon moderne */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl shadow-2xl mb-8 relative">
          <AlertTriangle className="w-12 h-12 text-white" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Titre principal avec gradient */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent mb-4 animate-pulse">
          404
        </h1>
        
        {/* Sous-titre moderne */}
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          Page non trouvée
        </h2>
        
        {/* Description stylée */}
        <div className="backdrop-blur-xl bg-white/80 rounded-2xl p-6 shadow-xl border border-white/30 mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Search className="w-5 h-5 text-red-500" />
            <span className="font-medium text-gray-700">Oops !</span>
          </div>
          <p className="text-gray-600 leading-relaxed">
            La page que vous recherchez semble avoir disparu dans l'espace numérique. 
            Elle n'existe pas ou a été déplacée vers un autre univers !
          </p>
        </div>
        
        {/* Bouton de retour moderne */}
        <Link to="/">
          <Button className="h-14 px-8 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-medium rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 group">
            <Home className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-lg">Retour à l'accueil</span>
            <Sparkles className="ml-3 h-4 w-4 group-hover:animate-spin" />
          </Button>
        </Link>

        {/* Message d'encouragement */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Pas de panique, nous sommes là pour vous aider !</span>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
