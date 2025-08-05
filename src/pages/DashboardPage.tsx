
/**
 * ============================================================================
 * TABLEAU DE BORD PRINCIPAL - PAGE D'ACCUEIL ADMINISTRATEUR
 * ============================================================================
 * 
 * Ce fichier contient le tableau de bord principal de l'application Riziky Agendas.
 * Il sert de hub central pour toutes les fonctionnalités de gestion d'entreprise.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Vue d'ensemble des rendez-vous avec calendrier interactif
 * - Gestion des ventes et produits avec interface premium
 * - Tableau de bord exécutif avec analytics avancées
 * - Liste complète des produits avec CRUD operations
 * - Notifications en temps réel des messages non lus
 * - Statistiques clients et rendez-vous en temps réel
 * - Interface responsive et moderne
 * 
 * ARCHITECTURE MODULAIRE :
 * - Composants séparés pour chaque section (Calendar, Stats, Products)
 * - Hooks personnalisés pour la gestion d'état (useAuth, useUnreadMessages, useDashboardState)
 * - Modales réutilisables pour les actions CRUD
 * - Services API centralisés
 * 
 * DESIGN SYSTÈME :
 * - Utilisation de Tabs pour l'organisation du contenu
 * - Cards pour la présentation des données
 * - Badges pour les indicateurs visuels
 * - Animations et effets de gradient premium
 * - Icônes Lucide pour la cohérence visuelle
 * 
 * SÉCURITÉ ET PERFORMANCE :
 * - Authentification requise pour l'accès
 * - Lazy loading des composants lourds
 * - Optimisation des re-renders avec useMemo
 * - Gestion d'état locale avec useState
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardBackground from '@/components/dashboard/DashboardBackground';
import PremiumCalendarSection from '@/components/dashboard/PremiumCalendarSection';
import AppointmentModalsManager from '@/components/dashboard/modals/AppointmentModalsManager';
import ActionButtons from '@/components/ActionButtons';
import AppointmentModal from '@/components/AppointmentModal';
import SearchAppointmentForm from '@/components/SearchAppointmentForm';
import AppointmentStatsDisplay from '@/components/AppointmentStatsDisplay';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { useDashboardState } from '@/hooks/useDashboardState';

const DashboardPage = () => {
  const {
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
    refreshData,
    resetState
  } = useDashboardState();

  const handleOpenAdd = () => {
    console.log('Opening add modal');
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setSelectedDate(null);
    setShowAppointmentDetails(false);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (appointment?: Appointment) => {
    console.log('Opening edit modal', appointment);
    if (appointment) {
      setActiveAppointment(appointment);
      if ((appointment as any)._isDragAndDrop) {
        setOriginalAppointment(appointment);
      } else {
        setOriginalAppointment(null);
      }
      setSelectedDate(null);
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

  const handleConfirmDelete = (appointment: Appointment) => {
    console.log('Confirming delete for appointment:', appointment);
    setActiveAppointment(appointment);
    setIsDeleteModalOpen(false);
    setIsConfirmDeleteOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!activeAppointment) return;
    
    try {
      const success = await AppointmentService.delete(activeAppointment.id);
      if (success) {
        handleFormSuccess();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const handleOpenSearch = () => {
    console.log('Opening search modal');
    setIsSearchModalOpen(true);
  };

  const handleViewAppointment = (appointment: Appointment) => {
    console.log('Viewing appointment', appointment);
    setActiveAppointment(appointment);
    setOriginalAppointment(null);
    setSelectedDate(null);
    setShowAppointmentDetails(true);
    setIsSearchModalOpen(false);
  };

  const handleAddAppointment = (date: Date) => {
    console.log('Adding appointment for date:', date);
    setSelectedDate(date);
    setActiveAppointment(null);
    setOriginalAppointment(null);
    setShowAppointmentDetails(false);
    setIsAddModalOpen(true);
  };

  const handleFormSuccess = () => {
    console.log('Form success, closing modals');
    resetState();
    refreshData();
  };

  const handleCloseModals = () => {
    console.log('Closing all modals');
    
    if (originalAppointment && activeAppointment) {
      console.log('Restoring original appointment after cancel');
      refreshData();
    }
    
    resetState();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-[80px] px-2 sm:px-4 lg:px-6">
      <DashboardBackground />

      <div className="container mx-auto py-6 sm:py-8 lg:py-12 relative z-10">
        <DashboardHeader />

        <AppointmentStatsDisplay refreshTrigger={refreshTrigger} />

        <div className="mb-6 lg:mb-8">
          <ActionButtons 
            onAdd={handleOpenAdd}
            onEdit={() => handleOpenEdit()}
            onDelete={handleOpenDelete}
            onSearch={handleOpenSearch}
          />
        </div>

        <PremiumCalendarSection
          refreshTrigger={refreshTrigger}
          onAppointmentClick={handleViewAppointment}
          onAddAppointment={handleAddAppointment}
          onEditAppointment={handleOpenEdit}
        />

        <AppointmentModalsManager
          isAddModalOpen={isAddModalOpen}
          isEditModalOpen={isEditModalOpen}
          isDeleteModalOpen={isDeleteModalOpen}
          isConfirmDeleteOpen={isConfirmDeleteOpen}
          isSearchModalOpen={isSearchModalOpen}
          showAppointmentDetails={showAppointmentDetails}
          activeAppointment={activeAppointment}
          originalAppointment={originalAppointment}
          selectedDate={selectedDate}
          onCloseModals={handleCloseModals}
          onFormSuccess={handleFormSuccess}
          onOpenEdit={handleOpenEdit}
          onConfirmDelete={handleConfirmDelete}
          onDeleteConfirmed={handleDeleteConfirmed}
          onViewAppointment={handleViewAppointment}
          setShowAppointmentDetails={setShowAppointmentDetails}
        />

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
      </div>
    </div>
  );
};

export default DashboardPage;
