
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';
import {Reply, Edit } from 'lucide-react';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  titre: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères.",
  }),
  date: z.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  heure: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format d'heure invalide (HH:MM).",
  }),
  duree: z.number().min(15, {
    message: "La durée minimale est de 15 minutes.",
  }).max(180, {
    message: "La durée maximale est de 180 minutes.",
  }),
  location: z.string().min(3, {
    message: "Le lieu doit contenir au moins 3 caractères.",
  }),
});

type AppointmentFormProps = {
  appointment?: Appointment;
  onSuccess: () => void;
  onCancel: () => void;
};

const AppointmentForm = ({ appointment, onSuccess, onCancel }: AppointmentFormProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const isEditing = !!appointment;
  
  const currentUser = AuthService.getCurrentUser();
  
  // Initialiser le formulaire avec les valeurs par défaut ou les valeurs de l'appointment existant
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: appointment ? {
      titre: appointment.titre,
      description: appointment.description,
      date: new Date(appointment.date),
      heure: appointment.heure,
      duree: appointment.duree,
      location: appointment.location,
    } : {
      titre: "",
      description: "",
      date: new Date(),
      heure: "09:00",
      duree: 60,
      location: "",
    },
  });

  // Récupérer les heures disponibles pour la date sélectionnée
  const checkAvailability = async (date: Date, currentHeure?: string) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const appointments = await AppointmentService.getCurrentWeekAppointments();
      const dayAppointments = appointments.filter(a => a.date === dateStr);
      
      // Générer toutes les heures possibles (de 7h à 20h par tranche de 30min)
      const allHours = [];
      for (let hour = 6; hour <= 20; hour++) {
        for (let min = 0; min < 60; min += 10) {
          allHours.push(`${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`);
        }
      }
      
      // Filtrer les heures déjà prises
      const unavailableHours = new Set();
      
      dayAppointments.forEach(app => {
        if (appointment && app.id === appointment.id) return; // Ne pas bloquer l'horaire actuel en mode édition
        
        const appHour = parseInt(app.heure.split(':')[0]);
        const appMin = parseInt(app.heure.split(':')[1]);
        const endHour = appHour + Math.floor((appMin + app.duree) / 60);
        const endMin = (appMin + app.duree) % 60;
        
        // Bloquer toutes les heures qui chevauchent ce rendez-vous
        allHours.forEach(time => {
          const [h, m] = time.split(':').map(Number);
          const timeInMinutes = h * 60 + m;
          const appStartInMinutes = appHour * 60 + appMin;
          const appEndInMinutes = endHour * 60 + endMin;
          
          if (timeInMinutes >= appStartInMinutes && timeInMinutes < appEndInMinutes) {
            unavailableHours.add(time);
          }
        });
      });
      
      const available = allHours.filter(hour => !unavailableHours.has(hour));
      setAvailableHours(available);
      
      // Si on est en mode édition et que l'heure actuelle n'est pas disponible, l'ajouter quand même
      if (currentHeure && !available.includes(currentHeure)) {
        setAvailableHours(prev => [...prev, currentHeure].sort());
      }
      
      return available.length > 0;
    } catch (error) {
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return false;
    }
  };
  
  // Vérifier la disponibilité lors du changement de date
  useEffect(() => {
    const date = form.watch('date');
    const heure = form.watch('heure');
    
    if (date) {
      checkAvailability(date, isEditing ? heure : undefined)
        .then(available => setIsAvailable(available));
    }
  }, [form.watch('date'), isEditing]);
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!currentUser) {
      toast.error("Vous devez être connecté pour ajouter un rendez-vous");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Formater les données pour l'API
      const appointmentData = {
        ...values,
        userId: currentUser.id,
        date: format(values.date, 'yyyy-MM-dd'),
      };
      
      let success = false;
      
      if (isEditing && appointment) {
        // Mode édition
        success = await AppointmentService.update({
          ...appointmentData,
          id: appointment.id,
        } as Appointment);
        
        if (success) {
          toast.success("Rendez-vous modifié avec succès");
        }
      } else {
        // Mode création
        const newAppointment = await AppointmentService.add(appointmentData as Omit<Appointment, 'id'>);
        success = !!newAppointment;
        
        if (success) {
          toast.success("Rendez-vous ajouté avec succès");
        }
      }
      
      if (success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du rendez-vous:', error);
      toast.error("Une erreur est survenue lors de l'enregistrement du rendez-vous");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Rendez-vous avec ...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? (
                          format(field.value, "EEEE d MMMM yyyy", { locale: fr })
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="heure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Heure</FormLabel>
                <FormControl>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={!isAvailable || availableHours.length === 0}
                    >
                      {availableHours.length === 0 ? (
                        <option value="">Aucun horaire disponible</option>
                      ) : (
                        availableHours.map(hour => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))
                      )}
                    </select>
                    <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="duree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Durée (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={15} 
                  max={180} 
                  step={15} 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lieu</FormLabel>
              <FormControl>
                <Input placeholder="Adresse" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Détails du rendez-vous..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!isAvailable && availableHours.length === 0 && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md">
            Aucun horaire n'est disponible pour cette date. Veuillez sélectionner une autre date.
          </div>
        )}
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
          <Reply className="mr-1 h-4 w-4" />
            Annuler
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || (!isAvailable && availableHours.length === 0)}
          > <Edit className="h-4 w-4 mr-2" />
            {isSubmitting 
              ? "Enregistrement..." 
              : isEditing 
                ? "Modifier le rendez-vous" 
                : "Ajouter le rendez-vous"
            }
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AppointmentForm;
