
import { useState } from 'react';
import WeekCalendar from '@/components/Weekcalendar';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentSelector from '@/components/AppointmentSelector';
import AppointmentDetails from '@/components/AppointmentDetails';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import ActionButtons from '@/components/ActionButtons';
import AppointmentModal from '@/components/AppointmentModal';
import SearchAppointmentForm from '@/components/SearchAppointmentForm';

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
    <div className="container mx-auto px-4 py-8">
      {/* En-tête du tableau de bord */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
      </div>

      {/* Boutons d'action pour gérer les rendez-vous */}
      <ActionButtons 
        onAdd={handleOpenAdd}
        onEdit={() => handleOpenEdit()}
        onDelete={handleOpenDelete}
        onSearch={handleOpenSearch}
      />

      {/* Calendrier hebdomadaire */}
      <div className="bg-white rounded-lg shadow-md p-6 card-3d">
        <WeekCalendar 
          key={`calendar-${refreshTrigger}`} 
          onAppointmentClick={handleViewAppointment} 
        />
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
  );
};

export default DashboardPage;
