
import { Appointment } from '@/services/AppointmentService';

/**
 * Props pour un rendez-vous dans le calendrier
 */
type CalendarAppointmentProps = {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
};

/**
 * Composant pour afficher un rendez-vous dans le calendrier
 */
const CalendarAppointment = ({ appointment, onClick }: CalendarAppointmentProps) => {
  return (
    <div
      onClick={() => onClick(appointment)}
      className="p-2 text-xs bg-rose-100 border-l-4 border-rose-500 rounded hover:bg-rose-200 cursor-pointer"
    >
      <p className="font-semibold truncate">{appointment.titre}</p>
      <p className="text-rose-700">{appointment.heure}</p>
      <p className="truncate text-gray-600">{appointment.location}</p>
    </div>
  );
};

export default CalendarAppointment;
