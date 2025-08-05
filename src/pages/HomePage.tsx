/**
 * ============================================================================
 * PAGE D'ACCUEIL - LANDING PAGE DE L'APPLICATION
 * ============================================================================
 * 
 * Cette page sert de vitrine principale pour l'application Riziky Agendas.
 * Elle présente les fonctionnalités clés et offre un aperçu du calendrier.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Section héro avec présentation de l'application
 * - Statistiques visuelles avec icônes animées
 * - Aperçu du calendrier hebdomadaire interactif
 * - Boutons d'action conditionnels selon l'authentification
 * - Design moderne avec effets de parallaxe et gradients
 * 
 * SECTIONS PRINCIPALES :
 * 1. Hero Section : Titre principal avec slogan et badges premium
 * 2. Features Grid : Cards avec fonctionnalités (Gestion, Collaboration, Rappels)
 * 3. CTA Buttons : Appels à l'action pour inscription/connexion
 * 4. Calendar Preview : Aperçu fonctionnel du calendrier
 * 
 * INTERACTIONS :
 * - Clic sur rendez-vous affiche un toast avec détails
 * - Animations au survol des cards
 * - Redirection vers inscription/connexion
 * - Calendrier en lecture seule (preview mode)
 * 
 * DESIGN SYSTÈME :
 * - Gradients modernes et arrière-plans animés
 * - Cards avec glass-morphism effect
 * - Animations CSS avec delays et transitions smooth
 * - Layout responsive avec grid system
 * - Couleurs cohérentes avec la charte graphique
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WeekCalendar from '@/components/Weekcalendar';
import { AuthService } from '@/services/AuthService';
import { Info, LogIn, Calendar, Users, Clock, Zap } from 'lucide-react';
import { Appointment } from '@/services/AppointmentService';
import { toast } from 'sonner';

/**
 * Composant pour la page d'accueil
 * Présente l'application et affiche un calendrier hebdomadaire
 */
const HomePage = () => {
  // Vérifie si l'utilisateur est actuellement authentifié
  const currentUser = AuthService.getCurrentUser();

  /**
   * Affiche un toast avec les détails du rendez-vous lorsqu'on clique dessus
   */
  const handleAppointmentClick = (appointment: Appointment) => {
    toast.success(`Rendez-vous : ${appointment.titre} à ${appointment.heure} au : ${appointment.location}`, {
      duration: 3000,
      style: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
      },
      action: {
        label: 'OK',
        onClick: () => console.log('OK cliqué'),
      },
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-[80px] lg:mt-[120px]">
      {/* Éléments décoratifs d'arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 lg:py-16 relative">
        <div className=" mx-auto">
          {/* Section héro modernisée */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-sm font-medium text-purple-800 mb-6 shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              La solution moderne de gestion RDV
            </div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 bg-clip-text text-transparent leading-tight">
              Bienvenue sur<br />
              <span className="text-7xl">Riziky-Agendas</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Transformez votre façon de gérer les rendez-vous avec une interface intuitive et des fonctionnalités avancées
            </p>

            {/* Statistiques visuelles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Gestion Simple</h3>
                <p className="text-gray-600 text-sm">Interface intuitive pour tous</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Collaboration</h3>
                <p className="text-gray-600 text-sm">Partagez avec votre équipe</p>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Rappels Auto</h3>
                <p className="text-gray-600 text-sm">Ne ratez plus jamais un RDV</p>
              </div>
            </div>

            {/* Boutons d'action modernisés */}
            {!currentUser && (
              <div className="flex flex-col sm:flex-row justify-center gap-6 mt-8">
                <Link to="/inscription">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
                    <Info className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                    Commencer Gratuitement
                  </Button>
                </Link>
                <Link to="/connexion">
                  <Button variant="outline" size="lg" className="border-2 border-purple-200 hover:border-purple-400 text-purple-700 hover:text-purple-900 px-8 py-4 rounded-2xl bg-white/50 backdrop-blur-sm hover:bg-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                    <LogIn className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Se connecter
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Section Calendrier modernisée */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 hover:shadow-3xl transition-all duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                Aperçu du Calendrier
              </h2>
              <p className="text-center text-gray-600">Visualisez vos rendez-vous en un coup d'œil</p>
            </div>
            <WeekCalendar 
              onAppointmentClick={handleAppointmentClick} 
              enableDragAndDrop={false}
              showActionButtons={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
