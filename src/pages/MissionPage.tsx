
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Heart, Users, Star, Sparkles, Crown } from 'lucide-react';

const MissionPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-violet-50 pt-20">
      {/* Background décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-violet-600 rounded-2xl shadow-lg mb-6 floating-animation">
            <Target className="w-10 h-10 text-white" />
            <Crown className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent mb-4">
            Notre Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Révolutionner la gestion des rendez-vous avec élégance et simplicité
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-700">
                <Heart className="w-6 h-6" />
                Notre Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                Nous croyons que chaque rendez-vous est une opportunité précieuse. 
                Notre mission est de créer des solutions qui transforment la façon dont 
                les professionnels gèrent leur temps et leurs relations client.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-violet-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-violet-700">
                <Users className="w-6 h-6" />
                Nos Valeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Excellence dans chaque fonctionnalité
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500" />
                  Innovation constante
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Satisfaction client prioritaire
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Section engagement */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border-blue-300 shadow-xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-blue-800">
              Notre Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700">
                Nous nous engageons à fournir une plateforme premium qui allie 
                sophistication, performance et facilité d'utilisation.
              </p>
              <div className="flex justify-center items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-blue-600 font-semibold">Premium par nature</span>
                <Sparkles className="w-5 h-5 text-violet-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionPage;
