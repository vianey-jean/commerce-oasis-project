
import React from 'react';
import AppointmentModal from '@/components/AppointmentModal';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentSelector from '@/components/AppointmentSelector';
import AppointmentDetails from '@/components/AppointmentDetails';
import { Appointment } from '@/services/AppointmentService';

interface AppointmentModalsManagerProps {
  // Modal states
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isConfirmDeleteOpen: boolean;
  isSearchModalOpen: boolean;
  showAppointmentDetails: boolean;
  
  // Data states
  activeAppointment: Appointment | null;
  originalAppointment: Appointment | null;
  selectedDate: Date | null;
  
  // Event handlers
  onCloseModals: () => void;
  onFormSuccess: () => void;
  onOpenEdit: (appointment?: Appointment) => void;
  onConfirmDelete: (appointment: Appointment) => void;
  onDeleteConfirmed: () => void;
  onViewAppointment: (appointment: Appointment) => void;
  setShowAppointmentDetails: (show: boolean) => void;
}

const AppointmentModalsManager: React.FC<AppointmentModalsManagerProps> = ({
  isAddModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  isConfirmDeleteOpen,
  isSearchModalOpen,
  showAppointmentDetails,
  activeAppointment,
  originalAppointment,
  selectedDate,
  onCloseModals,
  onFormSuccess,
  onOpenEdit,
  onConfirmDelete,
  onDeleteConfirmed,
  onViewAppointment,
  setShowAppointmentDetails
}) => {
  return (
    <>
      {/* Modal pour ajouter/modifier un rendez-vous */}
      {isAddModalOpen && (
        <AppointmentModal 
          isOpen={isAddModalOpen}
          onClose={onCloseModals}
          title={activeAppointment ? "Modifier le rendez-vous" : "Ajouter un rendez-vous"}
          mode={activeAppointment ? "edit" : "add"}
          appointment={activeAppointment || undefined}
          onSuccess={onFormSuccess}
        >
          <AppointmentForm 
            appointment={activeAppointment || undefined}
            onSuccess={onFormSuccess}
            onCancel={onCloseModals}
            disableDate={!!activeAppointment && !!originalAppointment}
            selectedDate={selectedDate}
          />
        </AppointmentModal>
      )}

      {isEditModalOpen && (
        <AppointmentModal 
          isOpen={isEditModalOpen}
          onClose={onCloseModals}
          title="Sélectionner un rendez-vous à modifier"
          mode="select"
          onSuccess={onFormSuccess}
          onSelect={(appointment) => onOpenEdit(appointment)}
        >
          <AppointmentSelector 
            onSelect={(appointment) => onOpenEdit(appointment)}
            onCancel={onCloseModals}
            mode="edit"
          />
        </AppointmentModal>
      )}

      {isDeleteModalOpen && (
        <AppointmentModal 
          isOpen={isDeleteModalOpen}
          onClose={onCloseModals}
          title="Sélectionner un rendez-vous à supprimer"
          mode="delete"
          onSuccess={onFormSuccess}
        >
          <AppointmentSelector 
            onSelect={onConfirmDelete}
            onCancel={onCloseModals}
            mode="delete"
          />
        </AppointmentModal>
      )}

      {/* Modal de confirmation de suppression */}
      {isConfirmDeleteOpen && activeAppointment && (
        <AppointmentModal 
          isOpen={isConfirmDeleteOpen}
          onClose={onCloseModals}
          title="Confirmer la suppression"
          mode="delete"
          appointment={activeAppointment}
          onSuccess={onFormSuccess}
        >
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200/50 rounded-2xl p-6 premium-shadow">
              <div className="text-center">
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  Êtes-vous sûr de vouloir supprimer ce rendez-vous ?
                </h3>
                <div className="bg-white/80 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-gray-800">{activeAppointment.titre}</p>
                  <p className="text-gray-600">{activeAppointment.date} à {activeAppointment.heure}</p>
                  <p className="text-gray-600">{activeAppointment.location}</p>
                </div>
                <p className="text-red-600 font-medium">
                  Cette action est définitive et ne peut pas être annulée.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button 
                onClick={onCloseModals}
                className="order-2 sm:order-1 px-6 py-3 bg-white border-2 border-gray-300 text-black hover:bg-gray-50 hover:border-gray-400 font-semibold rounded-2xl transition-all duration-200"
              >
                Annuler
              </button>
              <button 
                onClick={onDeleteConfirmed}
                className="order-1 sm:order-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 premium-shadow-lg font-semibold rounded-2xl transition-all duration-200"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </AppointmentModal>
      )}

      {activeAppointment && showAppointmentDetails && (
        <AppointmentDetails
          appointment={activeAppointment}
          open={showAppointmentDetails}
          onOpenChange={setShowAppointmentDetails}
          onEdit={() => onOpenEdit(activeAppointment)}
          onDelete={onFormSuccess}
        />
      )}
    </>
  );
};

export default AppointmentModalsManager;
