
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Scale, AlertCircle, Crown } from 'lucide-react';

const TermsPage = () => {
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
            <FileText className="w-10 h-10 text-white" />
            <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Conditions d'Utilisation
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Cadre légal pour une utilisation optimale
          </p>
        </div>

        {/* Contenu */}
        <div className="space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <Scale className="w-6 h-6" />
                Conditions Générales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-4">
                En utilisant Riziky-Agendas Premium, vous acceptez les conditions suivantes :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Utilisation conforme aux lois en vigueur</li>
                <li>• Respect de la confidentialité des données clients</li>
                <li>• Interdiction d'utilisation malveillante</li>
                <li>• Responsabilité des contenus publiés</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-violet-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-violet-700">
                <AlertCircle className="w-6 h-6" />
                Limitations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Notre service est fourni "en l'état". Nous nous efforçons d'assurer 
                une disponibilité maximale mais ne pouvons garantir un fonctionnement 
                ininterrompu. Les utilisateurs sont responsables de leurs sauvegardes.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-blue-300 shadow-xl">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-blue-800">
                Modifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-700">
                Ces conditions peuvent être modifiées. Les utilisateurs seront 
                informés des changements importants par email.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
