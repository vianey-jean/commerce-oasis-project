
import React, { useState, useEffect } from 'react';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { format } from 'date-fns';
import { Calendar, Clock, Sparkles, Zap } from 'lucide-react';

const DashboardCalendar = () => {
  const weekDays = AppointmentService.getWeekDays();
  const hours = AppointmentService.getHours();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await AppointmentService.getCurrentWeekAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  // Organiser les rendez-vous par jour et par heure
  const appointmentGrid: Record<string, Record<string, Appointment[]>> = {};
  
  weekDays.forEach(day => {
    const dateStr = format(day.fullDate, 'yyyy-MM-dd');
    appointmentGrid[dateStr] = {};
    
    hours.forEach(hour => {
      appointmentGrid[dateStr][hour] = appointments.filter(
        a => a.date === dateStr && a.heure.startsWith(hour.split(':')[0])
      );
    });
  });
  
  if (loading) {
    return (
      <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
        <div className="p-12 text-center">
          <div className="relative mb-6">
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Chargement du calendrier...</span>
            <Sparkles className="w-4 h-4 text-violet-500 animate-pulse" />
          </div>
          <p className="text-sm text-gray-400 mt-2">Synchronisation des données</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="backdrop-blur-xl bg-white/80 rounded-2xl shadow-2xl border border-white/30 overflow-hidden">
      {/* En-tête moderne */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Calendrier Premium</h3>
            <p className="text-violet-100 text-sm">Vue détaillée hebdomadaire</p>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-white/80">En temps réel</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] relative">
          <div className="grid grid-cols-8 gap-px bg-gray-200">
            {/* Header - Empty cell for hours column */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 flex items-center justify-center border-b-2 border-violet-200">
              <Clock className="w-4 h-4 text-violet-600" />
            </div>
            
            {/* Header - Days of the week */}
            {weekDays.map((day, index) => (
              <div 
                key={index}
                className={`p-3 text-center font-medium border-b-2 transition-all duration-300 ${
                  day.isToday 
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-400 shadow-lg' 
                    : 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50'
                }`}
              >
                <div className="font-bold">{day.dayName}</div>
                <div className={`text-sm mt-1 ${day.isToday ? 'text-violet-100' : 'text-gray-500'}`}>
                  {day.dayNumber} {day.month}
                </div>
              </div>
            ))}
            
            {/* Time slots and appointments */}
            {hours.map((hour, hourIndex) => (
              <React.Fragment key={`row-${hourIndex}`}>
                {/* Hour cell */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 text-center border-r border-gray-200 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{hour}</span>
                </div>
                
                {/* Day cells for this hour */}
                {weekDays.map((day, dayIndex) => {
                  const dateStr = format(day.fullDate, 'yyyy-MM-dd');
                  const cellAppointments = appointmentGrid[dateStr][hour] || [];
                  
                  return (
                    <div 
                      key={`cell-${hourIndex}-${dayIndex}`}
                      className={`p-2 min-h-[90px] border-r border-gray-200 transition-all duration-300 hover:bg-gradient-to-br hover:from-violet-50/50 hover:to-purple-50/50 ${
                        day.isToday ? 'bg-gradient-to-br from-violet-50/30 to-purple-50/30' : 'bg-white'
                      }`}
                    >
                      <div className="space-y-1">
                        {cellAppointments.map(appointment => (
                          <div 
                            key={appointment.id}
                            className="bg-gradient-to-r from-violet-500 to-purple-600 text-white p-2 text-xs rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
                            onClick={() => setSelectedAppointment(appointment)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative z-10">
                              <div className="font-medium truncate flex items-center gap-1">
                                <Sparkles className="w-3 h-3 flex-shrink-0" />
                                {appointment.titre}
                              </div>
                              <div className="truncate text-violet-100 mt-1">{appointment.location}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;
