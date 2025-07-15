
import { useState } from 'react';
import WeekCalendar from '@/components/Weekcalendar';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentSelector from '@/components/AppointmentSelector';
import AppointmentDetails from '@/components/AppointmentDetails';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import ActionButtons from '@/components/ActionButtons';
import AppointmentModal from '@/components/AppointmentModal';
import SearchAppointmentForm from '@/components/SearchAppointmentForm';
import { Calendar, Sparkles, Zap, Star, Crown, Diamond } from 'lucide-react';

/**
 * Page du tableau de bord
 * Centre de gestion des rendez-vous avec calendrier et actions CRUD
 */
const DashboardPage = () => {
  // États pour gérer les rendez-vous et les différentes modales
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [originalAppointment, setOriginalAppointment] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleOpenAdd = () => {
    console.log('Opening add modal');
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setShowAppointmentDetails(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (appointment?: Appointment) => {
    console.log('Opening edit modal', appointment);
    if (appointment) {
      setActiveAppointment(appointment);
      setOriginalAppointment(null);
      setIsEditModalOpen(false);
      setShowAppointmentDetails(false);
      setIsAddModalOpen(true);
    } else {
      setIsEditModalOpen(true);
    }
  };

  const handleOpenDelete = () => {
    console.log('Opening delete modal');
    setIsDeleteModalOpen(true);
  };

  const handleOpenSearch = () => {
    console.log('Opening search modal');
    setIsSearchModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    console.log('Viewing appointment', appointment);
    setActiveAppointment(appointment);
    setOriginalAppointment(null);
    setShowAppointmentDetails(true);
    setIsSearchModalOpen(false);
  };

  const handleAppointmentDrop = (appointment: Appointment, newDate: Date, originalAppointment: Appointment) => {
    console.log('Dashboard - handleAppointmentDrop called:', {
      appointmentId: appointment.id,
      appointmentTitle: appointment.titre,
      newDate,
      originalAppointment
    });
    
    setActiveAppointment(appointment);
    setOriginalAppointment(originalAppointment);
    
    setShowAppointmentDetails(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSearchModalOpen(false);
    
    setIsAddModalOpen(true);
    
    console.log('Modal should open for editing appointment with new date');
  };

  const handleFormSuccess = () => {
    console.log('Form success, closing modals');
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    refreshData();
  };

  const handleCloseModals = () => {
    console.log('Closing all modals');
    
    if (originalAppointment && activeAppointment) {
      console.log('Restoring original appointment after cancel');
      refreshData();
    }
    
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    setOriginalAppointment(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced luxury background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/30 to-purple-400/30 rounded-full blur-3xl animate-pulse floating-animation"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/30 to-blue-400/30 rounded-full blur-3xl animate-pulse delay-1000 floating-animation"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl floating-animation delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-full blur-xl floating-animation delay-700"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* En-tête premium du tableau de bord */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-28 h-28 premium-gradient rounded-3xl premium-shadow-xl mb-8 relative overflow-hidden floating-animation">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-3xl"></div>
            <Calendar className="w-14 h-14 text-white relative z-10" />
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center premium-shadow">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold luxury-text-gradient mb-4">
            Tableau de bord Premium
          </h1>
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
            <Diamond className="w-5 h-5 text-primary" />
            <p className="text-xl text-muted-foreground font-medium">
              Gérez vos rendez-vous avec élégance et sophistication
            </p>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Boutons d'action premium */}
        <ActionButtons 
          onAdd={handleOpenAdd}
          onEdit={() => handleOpenEdit()}
          onDelete={handleOpenDelete}
          onSearch={handleOpenSearch}
        />

        {/* Calendrier hebdomadaire avec effet ultra premium */}
        <div className="calendar-luxury rounded-3xl premium-shadow-xl border-0 overflow-hidden relative glow-effect">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-primary/5 to-purple-500/10"></div>
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-primary font-bold">En direct</span>
            </div>
            <Crown className="w-6 h-6 text-primary floating-animation" />
          </div>
          <div className="relative z-10 p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 premium-gradient rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold luxury-text-gradient">
                  Calendrier Intelligent Premium
                </h2>
                <p className="text-muted-foreground font-medium">Excellence dans la gestion du temps</p>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                <Diamond className="w-4 h-4 text-primary" />
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              </div>
            </div>
            <WeekCalendar 
              key={`calendar-${refreshTrigger}`} 
              onAppointmentClick={handleViewAppointment}
              onAppointmentDrop={handleAppointmentDrop}
            />
          </div>
        </div>

        {/* Modal pour ajouter/modifier un rendez-vous */}
        {isAddModalOpen && (
          <AppointmentModal 
            isOpen={isAddModalOpen}
            onClose={handleCloseModals}
            title={activeAppointment ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}
            mode={activeAppointment ? "edit" : "add"}
            appointment={activeAppointment || undefined}
            onSuccess={handleFormSuccess}
          >
            <AppointmentForm 
              appointment={activeAppointment || undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseModals}
              disableDate={!!activeAppointment && !!originalAppointment}
            />
          </AppointmentModal>
        )}

        {isEditModalOpen && (
          <AppointmentModal 
            isOpen={isEditModalOpen}
            onClose={handleCloseModals}
            title="Sélectionner un rendez-vous à modifier"
            mode="select"
            onSuccess={handleFormSuccess}
            onSelect={(appointment) => handleOpenEdit(appointment)}
          >
            <AppointmentSelector 
              onSelect={(appointment) => handleOpenEdit(appointment)}
              onCancel={handleCloseModals}
              mode="edit"
            />
          </AppointmentModal>
        )}

        {isDeleteModalOpen && (
          <AppointmentModal 
            isOpen={isDeleteModalOpen}
            onClose={handleCloseModals}
            title="Sélectionner un rendez-vous à supprimer"
            mode="delete"
            onSuccess={handleFormSuccess}
          >
            <AppointmentSelector 
              onSelect={handleViewAppointment}
              onCancel={handleCloseModals}
              mode="delete"
            />
          </AppointmentModal>
        )}

        {isSearchModalOpen && (
          <AppointmentModal 
            isOpen={isSearchModalOpen}
            onClose={handleCloseModals}
            title="Rechercher un rendez-vous"
            mode="search"
            onSuccess={handleFormSuccess}
          >
            <SearchAppointmentForm onSelect={handleViewAppointment} />
          </AppointmentModal>
        )}

        {activeAppointment && showAppointmentDetails && (
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
