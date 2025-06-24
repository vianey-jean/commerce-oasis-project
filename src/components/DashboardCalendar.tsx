
import React, { useState, useEffect } from 'react';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { format } from 'date-fns';

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
    return <div className="p-4 text-center">Chargement du calendrier...</div>;
  }
  
  return (
    <div className="mt-6 overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-1">
          {/* Header - Empty cell for hours column */}
          <div className="text-center p-2 bg-gray-100 font-medium">Heure</div>
          
          {/* Header - Days of the week */}
          {weekDays.map((day, index) => (
            <div 
              key={index}
              className={`text-center p-2 ${day.isToday ? 'bg-primary text-white' : 'bg-gray-100'} font-medium`}
            >
              <div>{day.dayName}</div>
              <div className="text-sm">{day.dayNumber} {day.month}</div>
            </div>
          ))}
          
          {/* Time slots and appointments */}
          {hours.map((hour, hourIndex) => (
            <React.Fragment key={`row-${hourIndex}`}>
              {/* Hour cell */}
              <div className="p-2 bg-gray-50 text-center border-t border-gray-200">
                {hour}
              </div>
              
              {/* Day cells for this hour */}
              {weekDays.map((day, dayIndex) => {
                const dateStr = format(day.fullDate, 'yyyy-MM-dd');
                const cellAppointments = appointmentGrid[dateStr][hour] || [];
                
                return (
                  <div 
                    key={`cell-${hourIndex}-${dayIndex}`}
                    className={`p-1 border border-gray-200 min-h-[80px] ${day.isToday ? 'bg-accent/30' : ''}`}
                  >
                    {cellAppointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="bg-primary/80 text-white p-1 text-xs rounded mb-1 cursor-pointer"
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <div className="font-medium truncate">{appointment.titre}</div>
                        <div className="truncate">{appointment.location}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendar;
