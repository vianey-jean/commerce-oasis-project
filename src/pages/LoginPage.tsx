
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Info, Reply, LogIn, AlertCircle, KeyRound, Mail, Lock, Sparkles, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schéma de validation pour l'étape email
const emailSchema = z.object({
  email: z.string().email({
    message: "Veuillez entrer une adresse email valide.",
  }),
});

// Schéma de validation pour l'étape mot de passe
const passwordSchema = z.object({
  email: z.string().email(),
  password: z.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
    .regex(/[a-z]/, "Doit contenir au moins une minuscule")
    .regex(/[0-9]/, "Doit contenir au moins un chiffre")
    .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial"),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'email' | 'password'>('email');
  const [emailValue, setEmailValue] = useState('');
  const [password, setPassword] = useState('');
  const [emailNotFound, setEmailNotFound] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const navigate = useNavigate();
  const { login, checkEmail, user } = useAuth();

  // Rediriger si déjà connecté
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });

  const onSubmitEmail = async (values: z.infer<typeof emailSchema>) => {
    setIsSubmitting(true);
    setEmailNotFound(false);
    try {
      const exists = await checkEmail(values.email);
      if (exists) {
        setEmailValue(values.email);
        setStep('password');
        passwordForm.setValue('email', values.email);
      } else {
        setEmailNotFound(true);
        emailForm.setError('email', {
          message: "Ce profil n'existe pas."
        });
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      emailForm.setError('email', {
        message: "Erreur de connexion. Veuillez réessayer."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 'password') {
      passwordForm.setValue('password', '');
      setPassword('');
      setLoginError(null);
      setIsPasswordValid(false);
    }
  }, [step, passwordForm]);

  const handlePasswordValidityChange = (isValid: boolean) => {
    setIsPasswordValid(isValid);
  };

  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    setLoginError(null);
    try {
      console.log('Tentative de connexion avec:', values.email);
      const success = await login(values.email, values.password);
      console.log('Résultat de la connexion:', success);
      
      if (success) {
        toast({
          title: "Connexion réussie !",
          description: "Vous êtes maintenant connecté.",
          variant: "default",
          className: "bg-indigo-700 text-white",  
        });
        // Redirection vers la page d'accueil
        navigate('/', { replace: true });
      } else {
        setLoginError("Mot de passe incorrect");
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setLoginError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    passwordForm.setValue('password', newPassword, { shouldValidate: true });
  };

  return (
    <div className="mt-[80px] min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-2xl mb-4 relative">
            <Shield className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Connexion
          </h1>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent"></div>
          <CardHeader className="text-center relative z-10 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {step === 'email' ? 'Votre email' : 'Votre mot de passe'}
              </CardTitle>
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            {step === 'email' ? (
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Mail className="w-4 h-4 text-indigo-500" />
                          Adresse email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="votre@email.com" 
                              autoComplete="email"
                              className="premium-input pl-12 h-12 border-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 transition-all duration-300 rounded-xl"
                              {...field}
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                        {emailNotFound && (
                          <div className="mt-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50 rounded-lg">
                            <p className="text-sm text-red-600 mb-2">Ce profil n'existe pas.</p>
                            <Link to="/inscription" className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                              <Sparkles className="w-4 h-4" />
                              Créer un compte
                            </Link>
                          </div>
                        )}
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Vérification...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Continuer
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={() => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-indigo-500" />
                          Mot de passe pour {emailValue}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"}
                              placeholder="Votre mot de passe"
                              autoComplete="current-password"
                              value={password}
                              onChange={handlePasswordChange}
                              className="premium-input pl-12 pr-12 h-12 border-2 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200/50 transition-all duration-300 rounded-xl"
                            />
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={togglePasswordVisibility}
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

                        {loginError && (
                          <div className="space-y-3 mt-3">
                            <Alert variant="destructive" className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200/50">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{loginError}</AlertDescription>
                            </Alert>
                            <div className="text-center">
                              <Link
                                to="/mot-de-passe-oublie"
                                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors group"
                              >
                                <KeyRound className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                                Mot de passe oublié ?
                              </Link>
                            </div>
                          </div>
                        )}

                        <PasswordStrengthIndicator 
                          password={password} 
                          onValidityChange={handlePasswordValidityChange}
                        />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep('email')} 
                      className="text-black flex-1 h-12 border-2 border-gray-200/50 hover:border-gray-300 bg-white/50 backdrop-blur-sm rounded-xl transition-all duration-300 hover:shadow-md"
                    >
                      <Reply className="mr-2 h-4 w-4 text-black" />
                      Retour
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                      disabled={isSubmitting || !isPasswordValid}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Connexion...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LogIn className="w-4 h-4" />
                          Se connecter
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
