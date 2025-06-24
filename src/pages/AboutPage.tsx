
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Shield, Users, Zap, Award, Target } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-32 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/2 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-5xl mx-auto">
          {/* En-tête héro */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm font-medium text-blue-800 mb-6 shadow-lg">
              <Heart className="w-4 h-4 mr-2" />
              Notre Histoire
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              À propos de Riziky-Agendas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Découvrez l'histoire, la mission et les valeurs qui nous animent dans notre quête d'excellence
            </p>
          </div>

          <div className="grid gap-8 md:gap-12">
            {/* Carte Mission */}
            <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-2xl">Notre Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Chez Riziky-Agendas, notre mission est de <span className="font-semibold text-blue-600">révolutionner la gestion des rendez-vous</span> pour les professionnels et les particuliers. Nous croyons qu'une organisation optimale est la clé d'une vie professionnelle et personnelle épanouie.
                  </p>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    Notre application a été pensée pour être <span className="font-semibold text-indigo-600">intuitive, performante et adaptable</span> aux besoins de chacun. Que vous soyez professionnel de santé, entrepreneur, ou simplement quelqu'un qui souhaite optimiser son temps, Riziky-Agendas transforme votre quotidien.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Grid des fonctionnalités */}
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-green-800">Fonctionnalités Avancées</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Interface moderne et intuitive",
                      "Vue hebdomadaire optimisée",
                      "Recherche intelligente instantanée", 
                      "Notifications et rappels (Beta)",
                      "Partage collaboratif (à venir)",
                      "Application mobile (à venir)"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-center gap-3 text-gray-700">
                        <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-xl text-purple-800">Sécurité & Confidentialité</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    La <span className="font-semibold text-purple-600">protection de vos données</span> est notre priorité absolue. Toutes vos informations sont sécurisées et ne sont jamais partagées sans votre consentement explicite.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nous utilisons les <span className="font-semibold text-violet-600">dernières technologies de cryptage</span> pour garantir la sécurité de vos données personnelles et professionnelles.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Carte équipe/valeurs */}
            <Card className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl text-red-800">Nos Valeurs</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Simplicité</h4>
                    <p className="text-sm text-gray-600">Une expérience utilisateur fluide et intuitive</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Fiabilité</h4>
                    <p className="text-sm text-gray-600">Une plateforme stable et sécurisée</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-2">Innovation</h4>
                    <p className="text-sm text-gray-600">Toujours à la pointe de la technologie</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
