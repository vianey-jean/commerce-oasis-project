// Importation des hooks et services nécessaires
import { useState } from 'react'; // Hook pour gérer l'état local du composant
import { useForm } from 'react-hook-form'; // Hook pour gérer les formulaires avec validation
import { zodResolver } from '@hookform/resolvers/zod'; // Intégration de Zod avec react-hook-form pour la validation
import * as z from 'zod'; // Zod est utilisé pour la validation du schéma de données
import { Mail, Phone, MapPin } from 'lucide-react'; // Icones pour afficher les coordonnées
import { Button } from '@/components/ui/button'; // Composant bouton personnalisé
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'; // Composants pour gérer les champs de formulaire
import { Input } from '@/components/ui/input'; // Composant de champ de texte pour les entrées
import { Textarea } from '@/components/ui/textarea'; // Composant de zone de texte pour les messages longs
import { Card, CardContent } from '@/components/ui/card'; // Composants pour afficher un cadre autour du contenu
import { ContactService, ContactForm } from '@/services/ContactService'; // Service pour envoyer les données du formulaire

// Définition du schéma de validation avec Zod
const formSchema = z.object({
  nom: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères.",
  }),
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
  sujet: z.string().min(5, {
    message: "Le sujet doit contenir au moins 5 caractères.",
  }),
  message: z.string().min(10, {
    message: "Le message doit contenir au moins 10 caractères.",
  }),
});

// Définition du composant de la page de contact
const ContactPage = () => {
  // État local pour gérer l'envoi du formulaire
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialisation du formulaire avec react-hook-form et validation Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      sujet: "",
      message: "",
    },
  });
  
  // Fonction appelée lors de la soumission du formulaire
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true); // Indique que la soumission est en cours
    try {
      const success = ContactService.send(values as ContactForm); // Envoi des données via le service
      if (success) {
        form.reset(); // Réinitialisation du formulaire si l'envoi réussit
      }
    } finally {
      setIsSubmitting(false); // Réinitialisation de l'état de soumission
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Conteneur principal de la page */}
      <div className="max-w-4xl mx-auto">
        
        {/* Section de présentation avec le titre et la description */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-primary">Contactez-nous</h1>
          <p className="text-xl text-gray-600">
            Nous sommes à votre écoute pour toute question ou suggestion
          </p>
        </div>
        
        {/* Grid pour organiser les coordonnées et le formulaire en deux colonnes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
            
            {/* Carte contenant les informations de contact */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Informations email */}
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <a href="mailto:contact@riziky-agendas.com" className="text-gray-600 hover:text-primary">
                        contact@riziky-agendas.com
                      </a>
                    </div>
                  </div>
                  
                  {/* Informations téléphone */}
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <a href="tel:+33612345678" className="text-gray-600 hover:text-primary">
                        +33 6 12 34 56 78
                      </a>
                    </div>
                  </div>
                  
                  {/* Informations adresse */}
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Adresse</h3>
                      <address className="text-gray-600 not-italic">
                        123 Avenue des Champs-Élysées<br />
                        75008 Paris, France
                      </address>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Section pour la carte de localisation (actuellement fictive) */}
            <div className="bg-gray-200 h-64 rounded-lg">
              {/* Placeholder pour une carte intégrée */}
              <div className="h-full flex items-center justify-center text-gray-500">
                Carte de localisation
              </div>
            </div>
          </div>
          
          {/* Formulaire de contact */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Formulaire de contact</h2>
            
            {/* Carte contenant le formulaire */}
            <Card>
              <CardContent className="p-6">
                {/* Formulaire avec react-hook-form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Champ pour le nom */}
                    <FormField
                      control={form.control}
                      name="nom"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Champ pour l'email */}
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Champ pour le sujet */}
                    <FormField
                      control={form.control}
                      name="sujet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sujet</FormLabel>
                          <FormControl>
                            <Input placeholder="Sujet de votre message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Champ pour le message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Votre message..." 
                              className="min-h-[120px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Bouton d'envoi */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Envoi en cours..." : "Envoyer"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
