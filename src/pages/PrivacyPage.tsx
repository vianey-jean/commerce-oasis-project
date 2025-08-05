
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Crown } from 'lucide-react';

const PrivacyPage = () => {
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
            <Shield className="w-10 h-10 text-white" />
            <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre confidentialité est notre priorité absolue
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <Database className="w-6 h-6" />
                Collecte des Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous collectons uniquement les informations nécessaires au fonctionnement de votre agenda :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Informations de compte (nom, email)</li>
                <li>• Données de rendez-vous (dates, heures, descriptions)</li>
                <li>• Informations clients (avec votre consentement)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-violet-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-violet-700">
                <Lock className="w-6 h-6" />
                Sécurité des Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Vos données sont protégées par des mesures de sécurité de niveau entreprise :
                chiffrement, accès restreint, et conformité aux standards internationaux.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-indigo-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-indigo-700">
                <Eye className="w-6 h-6" />
                Vos Droits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vous disposez de droits complets sur vos données :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Accès et consultation de vos données</li>
                <li>• Modification et correction</li>
                <li>• Suppression définitive</li>
                <li>• Portabilité de vos données</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
