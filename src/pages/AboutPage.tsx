// Importation des composants nécessaires à l'interface utilisateur
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8"> {/* Conteneur principal pour la page */}
      <div className="max-w-4xl mx-auto"> {/* Conteneur interne pour limiter la largeur */}
        <div className="text-center mb-12"> {/* Section d'en-tête avec un espacement en bas */}
          <h1 className="text-4xl font-bold mb-4 text-primary">À propos de Riziky-Agendas</h1> {/* Titre principal de la page */}
          <p className="text-xl text-gray-600">
            Découvrez notre histoire et notre mission {/* Sous-titre */}
          </p>
        </div>

        <div className="space-y-8"> {/* Espacement vertical entre chaque carte */}
          {/* Carte contenant la mission de l'entreprise */}
          <Card>
            <CardHeader>
              <CardTitle>Notre mission</CardTitle> {/* Titre de la section */}
            </CardHeader>
            <CardContent>
              {/* Description de la mission de l'entreprise */}
              <p className="text-gray-600">
                Chez Riziky-Agendas, notre mission est de simplifier la gestion des rendez-vous pour les 
                professionnels et les particuliers. Nous croyons qu'une bonne organisation est la clé 
                d'une vie professionnelle et personnelle épanouie.
              </p>
              <p className="text-gray-600 mt-4">
                Notre application a été conçue pour être intuitive, efficace et adaptée aux besoins de 
                chacun. Que vous soyez un professionnel de santé, un entrepreneur, ou simplement quelqu'un 
                qui souhaite mieux organiser son temps, Riziky-Agendas est fait pour vous.
              </p>
            </CardContent>
          </Card>

          {/* Carte contenant les fonctionnalités de l'application */}
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle> {/* Titre de la section des fonctionnalités */}
            </CardHeader>
            <CardContent>
              {/* Liste des fonctionnalités de l'application */}
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Gestion simple et intuitive des rendez-vous</li>
                <li>Vue hebdomadaire pour une meilleure organisation</li>
                <li>Recherche rapide de rendez-vous</li>
                <li>Notifications et rappels (Version Beta)</li>
                <li>Partage de calendrier avec vos collaborateurs (à venir)</li>
                <li>Application mobile (à venir)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Carte contenant des informations sur la confidentialité et la sécurité */}
          <Card>
            <CardHeader>
              <CardTitle>Confidentialité et sécurité</CardTitle> {/* Titre de la section sur la confidentialité */}
            </CardHeader>
            <CardContent>
              {/* Description de la politique de confidentialité et de sécurité */}
              <p className="text-gray-600">
                La confidentialité de vos données est notre priorité. Toutes les informations que vous 
                nous confiez sont sécurisées et ne sont jamais partagées avec des tiers sans votre 
                consentement explicite.
              </p>
              <p className="text-gray-600 mt-4">
                Nous utilisons les dernières technologies de cryptage pour protéger vos données personnelles 
                et professionnelles. Vous pouvez utiliser notre service en toute tranquillité.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; // Exportation de la page AboutPage pour utilisation dans d'autres parties de l'application
