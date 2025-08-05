
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppointmentService, Appointment } from '../services/AppointmentService';
import { toast } from 'sonner';

export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: AppointmentService.getAll,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useWeekAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'week'],
    queryFn: () => AppointmentService.getCurrentWeekAppointments(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
};

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
};

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AppointmentService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    }
  });
};

export const useSearchAppointments = (query: string) => {
  return useQuery({
    queryKey: ['appointments', 'search', query],
    queryFn: () => AppointmentService.search(query),
    enabled: query.length >= 3,
    staleTime: 1 * 60 * 1000,
  });
};
