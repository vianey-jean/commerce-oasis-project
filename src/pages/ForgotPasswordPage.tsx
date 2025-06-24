
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthService } from '@/services/AuthService';
import { toast } from 'sonner';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';

// Schéma de validation pour l'email
const emailSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
});

// Schéma de validation pour le mot de passe avec critères de complexité
const passwordSchema = z.object({
  password: z.string().min(8, {
    message: "Le mot de passe doit contenir au moins 8 caractères.",
  }).refine((password) => /[A-Z]/.test(password), {
    message: "Le mot de passe doit contenir au moins une lettre majuscule.",
  }).refine((password) => /[a-z]/.test(password), {
    message: "Le mot de passe doit contenir au moins une lettre minuscule.",
  }).refine((password) => /[0-9]/.test(password), {
    message: "Le mot de passe doit contenir au moins un chiffre.",
  }).refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    message: "Le mot de passe doit contenir au moins un caractère spécial.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

// Composant de réinitialisation de mot de passe
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  
  const navigate = useNavigate();
  
  // Formulaire pour l'email
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });
  
  // Formulaire pour le mot de passe
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Soumission du formulaire d'email
  const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    try {
      const emailExists = await AuthService.checkEmail(values.email);
      
      if (emailExists) {
        setEmail(values.email);
        setStep('password');
      } else {
        toast.error("Cette adresse email n'est pas enregistrée");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Vérification de la validité du mot de passe
  const handlePasswordValidityChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };
  
  // Soumission du formulaire de mot de passe
  const onSubmitPassword = (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    try {
      const success = AuthService.resetPassword(email, values.password);
      
      if (success) {
        toast.success("Mot de passe réinitialisé avec succès");
        navigate('/connexion');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion du changement de mot de passe
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    passwordForm.setValue('password', e.target.value);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 'email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
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
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Vérification en cours..." : "Continuer"}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                  <p className="text-sm text-gray-600 mb-4">
                    Veuillez définir un nouveau mot de passe pour votre compte {email}.
                  </p>
                  
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nouveau mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Votre nouveau mot de passe" 
                              autoComplete="off"
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handlePasswordChange(e);
                              }}
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <PasswordStrengthIndicator 
                          password={password} 
                          onValidityChange={handlePasswordValidityChange}
                        />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirmez votre mot de passe" 
                              autoComplete="off"
                              {...field} 
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !isPasswordValid}
                  >
                    {isSubmitting ? "Mise à jour en cours..." : "Réinitialiser le mot de passe"}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link to="/connexion" className="text-primary hover:underline">
                  Retour à la connexion
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
