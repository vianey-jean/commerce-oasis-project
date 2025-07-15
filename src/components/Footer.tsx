
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white relative overflow-hidden">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Contenu principal du footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Section Riziky-Agendas */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Riziky-Agendas
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Votre solution moderne et élégante pour gérer efficacement vos rendez-vous. 
              Simplifiez votre planning et optimisez votre temps avec notre interface intuitive.
            </p>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 cursor-pointer group">
                <Mail className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="w-12 h-12 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 cursor-pointer group">
                <Phone className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <div className="w-12 h-12 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors duration-200 cursor-pointer group">
                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </div>
            </div>
          </div>
          
          {/* Section Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                  Notre mission
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group">
                  <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                  Support
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Section Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <a href="mailto:vianey.jean@ymail.com" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center">
                    vianey.jean@ymail.com
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </li>
              
              <li className="flex items-start group">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Téléphone</p>
                  <a href="tel:+262692842370" className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center">
                    + (262) 06 92842370
                    <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </li>
              
              <li className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Localisation</p>
                  <p className="text-gray-300">La Réunion, France</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Ligne de séparation */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>
        
        {/* Copyright et mentions légales */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Heart className="w-4 h-4 text-red-400 mr-2" />
            <p className="text-gray-400 text-sm">
              &copy; 2025 Riziky-Agendas. Fait avec passion à La Réunion
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <span className="text-xs text-gray-500">Version 1.0.0</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Service en ligne</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
