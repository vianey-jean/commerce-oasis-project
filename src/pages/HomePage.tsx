
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WeekCalendar from '@/components/Weekcalendar';
import { AuthService } from '@/services/AuthService';
import { Info, LogIn } from 'lucide-react';
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
      duration: 3000, // 3 secondes
      style: {
        background: 'green',     // Fond vert
        color: 'white',           // Texte blanc pour être lisible
      },
      action: {
        label: 'OK',              // Bouton "OK" à droite
        onClick: () => console.log('OK cliqué'), // Ou une autre action si tu veux
      },
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Conteneur principal */}
      <div className="max-w-4xl mx-auto">
        {/* Section de bienvenue */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">Bienvenue sur Riziky-Agendas</h1>
          <p className="text-xl text-gray-600 mb-8">
            La solution simple et efficace pour gérer vos rendez-vous
          </p>

          {/* Si l'utilisateur n'est pas connecté, afficher les boutons d'inscription/connexion */}
          {!currentUser && (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link to="/inscription">
                <Button size="lg">
                  <Info className="mr-1 h-4 w-4" />
                  S'inscrire
                </Button>
              </Link>
              <Link to="/connexion">
                <Button variant="outline" size="lg">
                  <LogIn className="mr-1 h-4 w-4" />
                  Se connecter
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Section Calendrier */}
        <div className="bg-red rounded-lg shadow-md p-6">
          <WeekCalendar onAppointmentClick={handleAppointmentClick} />
        </div>
      </div>
    </div>
  );
};

// Exportation du composant
export default HomePage;
