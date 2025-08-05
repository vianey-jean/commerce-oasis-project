
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Crown, Star, Sparkles, User, Phone, Cake, CheckCircle } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';
import {Reply, Edit } from 'lucide-react';
import DateOfBirthInput from './DateOfBirthInput';

// Schéma de validation pour le formulaire
const formSchema = z.object({
  statut: z.enum(['validé', 'annulé'], {
    required_error: "Veuillez sélectionner un statut.",
  }),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  dateNaissance: z.string().optional(),
  telephone: z.string().optional(),
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
  onSuccess: (updatedAppointment?: Appointment) => void;
  onCancel: () => void;
  disableDate?: boolean;
  mode?: 'add' | 'edit';
  selectedDate?: Date | null;
};

const AppointmentForm = ({ 
  appointment, 
  onSuccess, 
  onCancel, 
  disableDate = false, 
  mode, 
  selectedDate 
}: AppointmentFormProps) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const isEditing = !!appointment;
  
  const currentUser = AuthService.getCurrentUser();
  
  // Déterminer la date par défaut
  const getDefaultDate = () => {
    if (appointment) return new Date(appointment.date);
    if (selectedDate) return selectedDate;
    return new Date();
  };
  
  // Initialiser le formulaire avec les valeurs par défaut ou les valeurs de l'appointment existant
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: appointment ? {
      statut: (appointment.statut || 'validé') as 'validé' | 'annulé',
      nom: appointment.nom || '',
      prenom: appointment.prenom || '',
      dateNaissance: appointment.dateNaissance || '',
      telephone: appointment.telephone || '',
      titre: appointment.titre,
      description: appointment.description,
      date: new Date(appointment.date),
      heure: appointment.heure,
      duree: appointment.duree,
      location: appointment.location,
    } : {
      statut: 'validé' as const,
      nom: '',
      prenom: '',
      dateNaissance: '',
      telephone: '',
      titre: "",
      description: "",
      date: getDefaultDate(),
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
    <div className="bg-white rounded-2xl p-6 max-h-[80vh] overflow-y-auto border border-gray-100">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Action
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50">
                      <SelectValue placeholder="Sélectionner le statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="validé" className="bg-green-50 text-green-800 font-medium hover:bg-green-100">Validé</SelectItem>
                    <SelectItem value="annulé" className="bg-red-50 text-red-800 font-medium hover:bg-red-100">Annulé</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="titre"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Titre du rendez-vous
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Rendez-vous avec..." 
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Nom (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Nom de famille" 
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Prénom (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Prénom" 
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dateNaissance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Cake className="w-4 h-4" />
                    Date de naissance (facultatif)
                  </FormLabel>
                  <FormControl>
                    <DateOfBirthInput 
                      value={field.value || ''}
                      onChange={field.onChange}
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Numéro de téléphone (facultatif)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="06 XX XX XX XX" 
                      className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className=" font-bold text-primary flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={disableDate}
                          className={`pl-4 text-black font-medium h-12 rounded-xl border-2 border-gray-200 hover:border-primary/40 ${!field.value ? "text-muted-foreground" : ""} ${disableDate ? "opacity-60 cursor-not-allowed bg-gray-100" : "bg-gray-50/50 hover:bg-white hover:text-black"}`}
                        >
                          {field.value ? (
                            format(field.value, "EEEE d MMMM yyyy", { locale: fr })
                          ) : (
                            <span >Sélectionner une date</span>
                          )}
                          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {!disableDate && (
                      <PopoverContent className="w-auto p-0 bg-white border border-gray-200 premium-shadow-lg" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                          className="rounded-2xl bg-white"
                        />
                      </PopoverContent>
                    )}
                  </Popover>
                  {disableDate && (
                    <div className="flex items-center gap-2 text-sm text-primary bg-blue-50 rounded-lg p-2">
                      <Star className="w-4 h-4" />
                      <span>Date fixée suite au déplacement du rendez-vous</span>
                    </div>
                  )}
                  {selectedDate && !disableDate && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <Star className="w-4 h-4" />
                      <span>Date sélectionnée dans le calendrier</span>
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="heure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Heure
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50/50 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
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
                      <Clock className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-50 text-primary" />
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
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Durée (minutes)
                </FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={15} 
                    max={180} 
                    step={15}
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
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
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Lieu
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Adresse du rendez-vous"
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 h-12 text-base font-medium hover:bg-gray-50"
                    {...field} 
                  />
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
                <FormLabel className="text-base font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Détails du rendez-vous..."
                    className="bg-gray-50/50 rounded-xl border-2 border-gray-200 focus:border-primary/60 min-h-[120px] text-base font-medium resize-none hover:bg-gray-50"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {!isAvailable && availableHours.length === 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 text-yellow-800 p-4 rounded-xl border-2 border-yellow-200 premium-shadow">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-600" />
                <span className="font-bold">Aucun horaire n'est disponible pour cette date. Veuillez sélectionner une autre date.</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-4 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            className="px-8 py-3 text-black border-2 border-red-500 luxury-card hover:border-red-600 font-semibold rounded-2xl premium-hover"
            >
              <Reply className="mr-2 h-4 w-4 text-black" />

              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (!isAvailable && availableHours.length === 0)}
              className="px-8 py-3 btn-premium premium-shadow-lg font-semibold rounded-2xl premium-hover"
            > 
              <Edit className="h-4 w-4 mr-2" />
              {isSubmitting 
                ? "Enregistrement..." 
                : isEditing 
                  ? "Modifier le rendez-vous" 
                  : "Ajouter le rendez-vous"
              }
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AppointmentForm;
