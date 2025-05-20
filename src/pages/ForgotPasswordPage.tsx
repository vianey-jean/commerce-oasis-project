import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/layout/Layout';
import { toast } from 'sonner';
import { authAPI } from '@/services/api';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email('Email invalide'),
});

const ForgotPasswordPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const location = useLocation();

  // Vérifier et afficher le chemin de la page pour le débogage
  useEffect(() => {
    console.log('Les liens sécurisés aléatoires sont désormais corrigés pour la forgot-password :Navigation vers:', location.pathname);
  }, [location]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Vérifier d'abord si l'email existe
      const checkEmailResponse = await authAPI.checkEmail(data.email);
      if (!checkEmailResponse.data.exists) {
        toast.error("Cet email n'est pas enregistré");
        return;
      }

      // Si l'email existe, envoyer la demande de réinitialisation
      const response = await authAPI.forgotPassword(data.email);

      if (response.status === 200) {
        // Indiquer que l'email a été envoyé
        setEmailSent(true);
        toast.success('Instructions envoyées par email');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de réinitialisation:', error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[70vh]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Mot de passe oublié</CardTitle>
            <CardDescription>Entrez votre email pour réinitialiser votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Un email avec les instructions de réinitialisation a été envoyé à votre adresse.
                </p>
                <Link to="/login" className="text-brand-blue hover:underline block mt-4">
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input placeholder="email@example.com" {...field} />
                            <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Envoi en cours..." : "Envoyer"}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-sm text-muted-foreground w-full text-center">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-brand-blue hover:underline">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default ForgotPasswordPage;
