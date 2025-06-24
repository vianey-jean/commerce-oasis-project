import { useState } from 'react';
import WeekCalendar from '@/components/Weekcalendar';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentSelector from '@/components/AppointmentSelector';
import AppointmentDetails from '@/components/AppointmentDetails';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import ActionButtons from '@/components/ActionButtons';
import AppointmentModal from '@/components/AppointmentModal';
import SearchAppointmentForm from '@/components/SearchAppointmentForm';
import { Calendar, Sparkles, Zap, Star } from 'lucide-react';

/**
 * Page du tableau de bord
 * Centre de gestion des rendez-vous avec calendrier et actions CRUD
 */
const DashboardPage = () => {
  // États pour gérer les rendez-vous et les différentes modales
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fonction pour rafraîchir les données du calendrier
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Gestionnaires d'événements pour les différentes actions utilisateur
  const handleOpenAdd = () => {
    setActiveAppointment(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (appointment?: Appointment) => {
    if (appointment) {
      setActiveAppointment(appointment);
      setIsEditModalOpen(false);
      setShowAppointmentDetails(false);
      setIsAddModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleOpenDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleOpenSearch = () => {
    setIsSearchModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    setActiveAppointment(appointment);
    setShowAppointmentDetails(true);
    setIsSearchModalOpen(false);
  };

  // Fonction appelée après une action réussie sur un rendez-vous
  const handleFormSuccess = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    refreshData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-violet-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-pink-400/10 to-rose-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* En-tête du tableau de bord moderne */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl shadow-2xl mb-6 relative">
            <Calendar className="w-10 h-10 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Tableau de bord
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Gérez vos rendez-vous avec style et efficacité
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <span className="text-sm text-gray-500">Interface premium</span>
          </div>
        </div>

        {/* Boutons d'action modernisés */}
        <div className="mb-8">
          <ActionButtons 
            onAdd={handleOpenAdd}
            onEdit={() => handleOpenEdit()}
            onDelete={handleOpenDelete}
            onSearch={handleOpenSearch}
          />
        </div>

        {/* Calendrier hebdomadaire avec effet premium */}
        <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/30 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent"></div>
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 font-medium">En direct</span>
          </div>
          <div className="relative z-10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Calendrier Intelligent
              </h2>
            </div>
            <WeekCalendar 
              key={`calendar-${refreshTrigger}`} 
              onAppointmentClick={handleViewAppointment} 
            />
          </div>
        </div>

        {/* Modal pour ajouter/modifier un rendez-vous */}
        <AppointmentModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={activeAppointment ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}
          mode={activeAppointment ? "edit" : "add"}
          appointment={activeAppointment || undefined}
          onSuccess={handleFormSuccess}
        >
          <AppointmentForm 
            appointment={activeAppointment || undefined}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsAddModalOpen(false)}
          />
        </AppointmentModal>

        {/* Modal pour sélectionner un rendez-vous à modifier */}
        <AppointmentModal 
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title="Sélectionner un rendez-vous à modifier"
          mode="select"
          onSuccess={handleFormSuccess}
          onSelect={(appointment) => handleOpenEdit(appointment)}
        >
          <AppointmentSelector 
            onSelect={(appointment) => handleOpenEdit(appointment)}
            onCancel={() => setIsEditModalOpen(false)}
            mode="edit"
          />
        </AppointmentModal>

        {/* Modal pour sélectionner un rendez-vous à supprimer */}
        <AppointmentModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Sélectionner un rendez-vous à supprimer"
          mode="delete"
          onSuccess={handleFormSuccess}
        >
          <AppointmentSelector 
            onSelect={handleViewAppointment}
            onCancel={() => setIsDeleteModalOpen(false)}
            mode="delete"
          />
        </AppointmentModal>

        {/* Modal pour rechercher un rendez-vous */}
        <AppointmentModal 
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          title="Rechercher un rendez-vous"
          mode="search"
          onSuccess={handleFormSuccess}
        >
          <SearchAppointmentForm onSelect={handleViewAppointment} />
        </AppointmentModal>

        {/* Affichage des détails d'un rendez-vous */}
        {activeAppointment && (
          <AppointmentDetails
            appointment={activeAppointment}
            open={showAppointmentDetails}
            onOpenChange={setShowAppointmentDetails}
            onEdit={() => handleOpenEdit(activeAppointment)}
            onDelete={handleFormSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
