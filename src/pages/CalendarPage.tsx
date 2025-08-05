
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WeekCalendar from '@/components/Weekcalendar';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import DashboardCalendar from '@/components/DashboardCalendar';
import AppointmentDetails from '@/components/AppointmentDetails';
import AppointmentForm from '@/components/AppointmentForm';
import AppointmentModal from '@/components/AppointmentModal';
import AppointmentStatsDisplay from '@/components/AppointmentStatsDisplay';
import { Appointment, AppointmentService } from '@/services/AppointmentService';
import { Calendar, CalendarDays, BarChart3, Crown, Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const CalendarPage: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isDragAndDrop, setIsDragAndDrop] = useState(false);

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleDateClick = (date: Date) => {
    console.log('Date cliquée:', date);
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(false);
    // Détecter si c'est un drag and drop
    setIsDragAndDrop(!!(appointment as any)._isDragAndDrop);
    setShowEditForm(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(false);
    setShowDeleteModal(true);
  };

  const handleAddAppointment = (date: Date, time?: string) => {
    setSelectedDate(date);
    setSelectedTime(time || '09:00');
    setShowAddForm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAppointment) return;
    
    try {
      const success = await AppointmentService.delete(selectedAppointment.id);
      if (success) {
        toast.success('Rendez-vous supprimé avec succès');
        setRefreshKey(prev => prev + 1);
        setShowDeleteModal(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du rendez-vous');
    }
  };

  const handleEditSuccess = async (updatedAppointment: Appointment) => {
    try {
      const success = await AppointmentService.update(updatedAppointment);
      if (success) {
        toast.success('Rendez-vous modifié avec succès');
        setRefreshKey(prev => prev + 1);
        setShowEditForm(false);
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast.error('Erreur lors de la modification du rendez-vous');
    }
  };

  const handleAddSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setShowAddForm(false);
    setSelectedDate(null);
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden mt-[80px]">
      {/* Background premium - plus clair */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* En-tête premium */}
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
            Calendrier Complet Premium
          </h1>
          <div className="flex items-center justify-center gap-3 max-w-2xl mx-auto">
            <Sparkles className="w-5 h-5 text-primary" />
            <p className="text-xl text-muted-foreground font-medium">
              Visualisez vos rendez-vous sous tous les angles
            </p>
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          </div>
        </div>

        {/* Statistiques des rendez-vous */}
        <AppointmentStatsDisplay refreshTrigger={refreshKey} />

        {/* Onglets de calendrier */}
        <Tabs defaultValue="week" className="space-y-8" key={refreshKey}>
         <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-2 h-auto p-1 bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 rounded-xl">
  
  <TabsTrigger
    value="week"
    className="flex items-center justify-center gap-2 h-12 font-medium w-full"
  >
    <Calendar className="w-4 h-4" />
    Vue Semaine
  </TabsTrigger>

  <TabsTrigger
    value="month"
    className="flex items-center justify-center gap-2 h-12 font-medium w-full"
  >
    <CalendarDays className="w-4 h-4" />
    Vue Mensuelle
  </TabsTrigger>

  <TabsTrigger
    value="dashboard"
    className="flex items-center justify-center gap-2 h-12 font-medium w-full"
  >
    <BarChart3 className="w-4 h-4" />
    Vue Dashboard
  </TabsTrigger>

</TabsList>

          <TabsContent value="week" className="space-y-6">
            <WeekCalendar 
              onAppointmentClick={handleAppointmentClick}
              enableDragAndDrop={true}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEdit}
            />
          </TabsContent>

          <TabsContent value="month" className="space-y-6">
            <MonthlyCalendar 
              onDateClick={handleDateClick}
              onAppointmentClick={handleAppointmentClick}
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEdit}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardCalendar 
              onAddAppointment={handleAddAppointment}
              onEditAppointment={handleEdit}
            />
          </TabsContent>
        </Tabs>

        {/* Modal d'ajout de rendez-vous */}
        {showAddForm && selectedDate && (
          <AppointmentModal
            isOpen={showAddForm}
            onClose={() => {
              setShowAddForm(false);
              setSelectedDate(null);
              setSelectedTime('');
            }}
            title="Ajouter un rendez-vous"
            mode="add"
            onSuccess={handleAddSuccess}
          >
            <AppointmentForm
              mode="add"
              selectedDate={selectedDate}
              onSuccess={handleAddSuccess}
              onCancel={() => {
                setShowAddForm(false);
                setSelectedDate(null);
                setSelectedTime('');
              }}
            />
          </AppointmentModal>
        )}

        {/* Modal des détails de rendez-vous */}
        {selectedAppointment && showAppointmentDetails && (
          <AppointmentDetails
            appointment={selectedAppointment}
            open={showAppointmentDetails}
            onOpenChange={setShowAppointmentDetails}
            onEdit={() => handleEdit(selectedAppointment)}
            onDelete={() => handleDelete(selectedAppointment)}
          />
        )}

        {/* Modal de modification */}
        {selectedAppointment && showEditForm && (
          <AppointmentModal
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setSelectedAppointment(null);
            }}
            title="Modifier le rendez-vous"
            mode="edit"
            appointment={selectedAppointment}
            onSuccess={() => {
              setRefreshKey(prev => prev + 1);
              setShowEditForm(false);
              setSelectedAppointment(null);
            }}
          >
            <AppointmentForm
              mode="edit"
              appointment={selectedAppointment}
              disableDate={isDragAndDrop}
              onSuccess={() => {
                setRefreshKey(prev => prev + 1);
                setShowEditForm(false);
                setSelectedAppointment(null);
                setIsDragAndDrop(false);
              }}
              onCancel={() => {
                setShowEditForm(false);
                setSelectedAppointment(null);
                setIsDragAndDrop(false);
              }}
            />
          </AppointmentModal>
        )}

        {/* Modal de suppression */}
        <AppointmentModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedAppointment(null);
          }}
          title="Supprimer le rendez-vous"
          mode="delete"
          appointment={selectedAppointment}
          onSuccess={handleDeleteConfirm}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
