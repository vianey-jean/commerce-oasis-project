
/**
 * ============================================================================
 * PAGE D'INSCRIPTION - CRÉATION DE COMPTE UTILISATEUR
 * ============================================================================
 * 
 * Cette page gère l'inscription de nouveaux utilisateurs avec un formulaire complet
 * et sécurisé incluant la validation en temps réel et la vérification des mots de passe.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Formulaire d'inscription complet avec validation Zod
 * - Vérification de force du mot de passe en temps réel
 * - Confirmation de mot de passe avec validation
 * - Sélection du genre avec icônes personnalisées
 * - Acceptation des conditions d'utilisation obligatoire
 * - Redirection automatique après inscription réussie
 * 
 * CHAMPS DU FORMULAIRE :
 * - Informations personnelles : Nom, Prénom, Genre
 * - Contact : Email, Téléphone, Adresse
 * - Sécurité : Mot de passe, Confirmation mot de passe
 * - Légal : Acceptation des conditions d'utilisation
 * 
 * SÉCURITÉ :
 * - Validation stricte des mots de passe (8+ chars, maj, min, chiffres, spéciaux)
 * - Vérification unicité de l'email côté serveur
 * - Hachage sécurisé des mots de passe (côté serveur)
 * - Protection contre les attaques par injection
 * 
 * EXPÉRIENCE UTILISATEUR :
 * - Interface moderne avec animations fluides
 * - Indicateur de force du mot de passe visuel
 * - Messages d'erreur contextuels et utiles
 * - Boutons avec états de chargement
 * - Design responsive et accessible
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, User, Mail, MapPin, Phone, Shield, Sparkles, UserPlus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

const formSchema = z.object({
  nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Format d'email invalide" }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "Le mot de passe doit contenir au moins un caractère spécial"),
  confirmPassword: z.string(),
  genre: z.string(),
  adresse: z.string().min(5, { message: "L'adresse doit contenir au moins 5 caractères" }),
  phone: z.string().min(10, { message: "Le numéro de téléphone doit contenir au moins 10 caractères" }),
  acceptTerms: z.boolean().refine(val => val === true, { message: "Vous devez accepter les conditions d'utilisation" })
}).refine(data => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      password: "",
      confirmPassword: "",
      genre: "homme",
      adresse: "",
      phone: "",
      acceptTerms: false
    },
  });

  // Email validation with debounce
  useEffect(() => {
    const email = form.watch('email');
    let debounceTimer: NodeJS.Timeout;

    const checkEmail = async () => {
      if (!email || !email.includes('@')) return;

      setIsEmailChecking(true);
      try {
        const emailExists = await AuthService.checkEmail(email);
        setIsEmailAvailable(!emailExists);
        if (emailExists) {
          form.setError('email', {
            type: 'manual',
            message: 'Cet email est déjà utilisé'
          });
          toast.error('Cet email est déjà utilisé');
        } else {
          form.clearErrors('email');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error);
      } finally {
        setIsEmailChecking(false);
      }
    };

    if (email) {
      debounceTimer = setTimeout(checkEmail, 500);
    }

    return () => clearTimeout(debounceTimer);
  }, [form.watch('email')]);
  
  // Gestionnaire pour vérifier la validité du mot de passe
  const handlePasswordValidityChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };
  
  const onSubmit = async (values: FormValues) => {
    if (!isEmailAvailable) {
      toast.error('Cet email est déjà utilisé');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const user = {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        password: values.password,
        genre: values.genre,
        adresse: values.adresse,
        phone: values.phone
      };
      
      const result = await AuthService.register(user);
      
      if (result) {
        toast.success(`Bienvenue ${values.prenom} ${values.nom} !`);
        navigate('/');
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur s'est produite lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (currentUser) {
    return <Navigate to="/" />;
  }

  const isFormDisabled = !isEmailAvailable || isEmailChecking || isSubmitting || !isPasswordValid;
  
  return (
    <div className="mt-[80px] min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '6s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-2xl mb-4 relative">
            <UserPlus className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Inscription
          </h1>
          <p className="text-gray-600">Créez votre compte en quelques étapes</p>
        </div>

        <div className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent"></div>
          
          <div className="relative z-10 p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h2 className="text-xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Vos informations
                </h2>
                <Sparkles className="w-5 h-5 text-teal-500" />
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-emerald-500" />
                          Nom
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre nom" 
                            className="h-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="prenom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                          <User className="w-3 h-3 text-teal-500" />
                          Prénom
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Votre prénom" 
                            className="h-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Mail className="w-3 h-3 text-emerald-500" />
                        Email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="email" 
                            placeholder="votre@email.com" 
                            className={`h-10 pl-8 bg-white/50 backdrop-blur-sm border transition-all duration-300 rounded-lg text-sm ${
                              !isEmailAvailable ? "border-red-300 focus:border-red-400 focus:ring-red-200/50" : "border-gray-200/50 focus:border-emerald-400 focus:ring-emerald-200/50"
                            }`}
                            {...field} 
                          />
                          <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                          {isEmailChecking && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-3 w-3 border-2 border-emerald-500 border-t-transparent rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Genre</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 transition-all duration-300 rounded-lg text-sm">
                            <SelectValue placeholder="Sélectionnez votre genre" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white/95 backdrop-blur-xl border-gray-200/50">
                          <SelectItem value="homme">Homme</SelectItem>
                          <SelectItem value="femme">Femme</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-teal-500" />
                        Adresse
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="123 Rue de Paris, 75001 Paris" 
                            className="h-10 pl-8 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                          <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-emerald-500" />
                        Téléphone
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder="0612345678" 
                            className="h-10 pl-8 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                          <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-500" />
                        Mot de passe
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            className="h-10 pl-8 pr-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <Shield className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-3 h-3 text-gray-400" /> : <Eye className="w-3 h-3 text-gray-400" />}
                        </button>
                      </div>
                      <PasswordStrengthIndicator 
                        password={field.value} 
                        onValidityChange={handlePasswordValidityChange}
                      />
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium text-gray-700">Confirmer le mot de passe</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            className="h-10 pl-8 pr-10 bg-white/50 backdrop-blur-sm border border-gray-200/50 focus:border-teal-400 focus:ring-2 focus:ring-teal-200/50 transition-all duration-300 rounded-lg text-sm"
                            {...field} 
                          />
                        </FormControl>
                        <Shield className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                        <div 
                          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-0.5 hover:bg-gray-100 rounded transition-colors"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3 h-3 text-gray-400" /> : <Eye className="w-3 h-3 text-gray-400" />}
                        </div>
                      </div>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg p-3 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 border border-emerald-200/30">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-xs text-gray-700">
                          J'accepte les conditions d'utilisation et la politique de confidentialité
                        </FormLabel>
                        <FormMessage className="text-xs" />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isFormDisabled} 
                  className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Inscription en cours...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      S'inscrire
                    </div>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-xs text-gray-600">
                    Déjà inscrit ?{" "}
                    <Link to="/connexion" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                      Se connecter
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
