
import { useState, useEffect } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder=" " {...field} />
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
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder=" " {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="email" 
                        placeholder="" 
                        {...field} 
                        className={!isEmailAvailable ? "border-red-500" : ""}
                      />
                      {isEmailChecking && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez votre genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="homme">Homme</SelectItem>
                      <SelectItem value="femme">Femme</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rue de Paris, 75001 Paris" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="0612345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        {...field} 
                      />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator 
                    password={field.value} 
                    onValidityChange={handlePasswordValidityChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input 
                        type={showConfirmPassword ? "text" : "password"} 
                        {...field} 
                      />
                    </FormControl>
                    <div 
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="acceptTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 border">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      J'accepte les conditions d'utilisation et la politique de confidentialité
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isFormDisabled} 
              className="w-full"
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </Button>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                Déjà inscrit ?{" "}
                <Link to="/connexion" className="text-primary font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
