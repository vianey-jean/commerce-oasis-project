/**
 * ============================================================================
 * PAGE DE RÉINITIALISATION DE MOT DE PASSE - COMPOSANT FRONTEND
 * ============================================================================
 * 
 * Ce fichier contient la page complète pour la réinitialisation de mot de passe oublié.
 * Il gère un processus en deux étapes :
 * 1. Vérification de l'email de l'utilisateur
 * 2. Définition d'un nouveau mot de passe avec validation de sécurité
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Validation d'email existant dans la base de données
 * - Formulaire sécurisé avec validation Zod
 * - Indicateur de force du mot de passe en temps réel
 * - Interface utilisateur moderne avec animations
 * - Gestion des états de chargement et d'erreurs
 * - Design responsive avec Tailwind CSS
 * 
 * TECHNOLOGIES UTILISÉES :
 * - React 18 avec hooks (useState, useForm)
 * - React Hook Form pour la gestion des formulaires
 * - Zod pour la validation des schémas
 * - React Router pour la navigation
 * - Sonner pour les notifications toast
 * - Lucide React pour les icônes
 * - Tailwind CSS pour le styling
 * 
 * SÉCURITÉ :
 * - Validation côté client et serveur
 * - Critères de mot de passe stricts (8+ caractères, majuscules, minuscules, chiffres, spéciaux)
 * - Masquage/affichage sécurisé des mots de passe
 * - Vérification de confirmation de mot de passe
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Shield, KeyRound, Sparkles, RotateCcw } from 'lucide-react';
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
  const onSubmitPassword = async (values: z.infer<typeof passwordSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await AuthService.resetPassword(email, values.password);
      
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
    <div className="mt-[80px] min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-400/10 to-orange-400/10 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-2xl mb-4 relative">
            <KeyRound className="w-8 h-8 text-white" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            Mot de passe oublié
          </h1>
          <p className="text-gray-600">Réinitialisez votre mot de passe</p>
        </div>

        <Card className="backdrop-blur-xl bg-white/80 shadow-2xl border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent"></div>
          <CardHeader className="text-center relative z-10 pb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {step === 'email' ? 'Votre email' : 'Nouveau mot de passe'}
              </CardTitle>
              <Sparkles className="w-5 h-5 text-red-500" />
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
                          <Mail className="w-4 h-4 text-orange-500" />
                          Adresse email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              placeholder="votre@email.com" 
                              className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all duration-300 rounded-xl"
                              {...field} 
                            />
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Vérification en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Continuer
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50 rounded-xl mb-4">
                    <p className="text-sm text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-orange-500" />
                      Définissez un nouveau mot de passe pour <span className="font-medium text-orange-600">{email}</span>
                    </p>
                  </div>
                  
                  <FormField
                    control={passwordForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Shield className="w-4 h-4 text-orange-500" />
                          Nouveau mot de passe
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showPassword ? "text" : "password"} 
                              placeholder="Votre nouveau mot de passe" 
                              autoComplete="off"
                              className="pl-12 pr-12 h-12 bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 focus:border-orange-400 focus:ring-2 focus:ring-orange-200/50 transition-all duration-300 rounded-xl"
                              {...field} 
                              onChange={(e) => {
                                field.onChange(e);
                                handlePasswordChange(e);
                              }}
                            />
                            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
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
                      <FormItem className="space-y-3">
                        <FormLabel className="text-sm font-medium text-gray-700">Confirmer le mot de passe</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type={showConfirmPassword ? "text" : "password"} 
                              placeholder="Confirmez votre mot de passe" 
                              autoComplete="off"
                              className="pl-12 pr-12 h-12 bg-white/50 backdrop-blur-sm border-2 border-gray-200/50 focus:border-red-400 focus:ring-2 focus:ring-red-200/50 transition-all duration-300 rounded-xl"
                              {...field} 
                            />
                            <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <button
                              type="button"
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-md transition-colors"
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
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
                    disabled={isSubmitting || !isPasswordValid}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Mise à jour en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4" />
                        Réinitialiser le mot de passe
                      </div>
                    )}
                  </Button>
                </form>
              </Form>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                <Link to="/connexion" className="font-medium text-orange-600 hover:text-orange-700 transition-colors inline-flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" />
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
