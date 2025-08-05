
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, MessageCircle, Phone, Mail, Crown, Sparkles } from 'lucide-react';

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-20">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl shadow-lg mb-6 floating-animation">
            <HelpCircle className="w-10 h-10 text-white" />
            <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Support Client
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une assistance premium pour votre tranquillité d'esprit
          </p>
        </div>

        {/* Options de contact */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-blue-700">Chat en Direct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Assistance immédiate par chat pour toutes vos questions
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                Démarrer le Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-violet-200 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-violet-700">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Réponse détaillée sous 24h ouvrées
              </p>
              <Button className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white">
                Envoyer un Email
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-xl text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-indigo-700">Téléphone</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Support vocal premium pour les urgences
              </p>
              <Button className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white">
                Appeler Maintenant
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-blue-300 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-800 flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6" />
              Questions Fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white/60 rounded-lg p-4">
                <h3 className="font-semibold text-blue-700 mb-2">Comment créer un rendez-vous ?</h3>
                <p className="text-gray-700">Cliquez sur le bouton "+" puis "Nouveau RDV" pour ouvrir le formulaire.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h3 className="font-semibold text-violet-700 mb-2">Puis-je modifier un rendez-vous ?</h3>
                <p className="text-gray-700">Oui, cliquez sur le rendez-vous dans le calendrier puis sur "Modifier".</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4">
                <h3 className="font-semibold text-indigo-700 mb-2">Comment synchroniser mes données ?</h3>
                <p className="text-gray-700">La synchronisation est automatique. Vos données sont sauvegardées en temps réel.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportPage;
