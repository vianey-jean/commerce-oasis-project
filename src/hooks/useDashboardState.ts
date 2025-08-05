
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Appointment, AppointmentService } from '@/services/AppointmentService';

export const useDashboardState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États pour gérer les rendez-vous et les différentes modales
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [originalAppointment, setOriginalAppointment] = useState<Appointment | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Gérer le paramètre edit de l'URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId) {
      const appointmentId = parseInt(editId, 10);
      if (!isNaN(appointmentId)) {
        AppointmentService.getById(appointmentId).then(appointment => {
          if (appointment) {
            setActiveAppointment(appointment);
            setIsAddModalOpen(true);
            setSearchParams(params => {
              params.delete('edit');
              return params;
            });
          }
        }).catch(error => {
          console.error('Erreur lors du chargement du rendez-vous:', error);
        });
      }
    }
  }, [searchParams, setSearchParams]);

  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const resetState = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsSearchModalOpen(false);
    setShowAppointmentDetails(false);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setSelectedDate(null);
  };

  return {
    // États
    activeAppointment,
    setActiveAppointment,
    originalAppointment,
    setOriginalAppointment,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isConfirmDeleteOpen,
    setIsConfirmDeleteOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    showAppointmentDetails,
    setShowAppointmentDetails,
    refreshTrigger,
    selectedDate,
    setSelectedDate,
    
    // Méthodes
    refreshData,
    resetState
  };
};
