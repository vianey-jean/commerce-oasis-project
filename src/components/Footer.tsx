// Importation des composants nécessaires depuis React et des icônes depuis 'lucide-react'
import { Link } from 'react-router-dom'; // Composant Link de React Router pour les liens de navigation
import { Mail, Phone } from 'lucide-react'; // Icônes Mail et Phone pour afficher des icônes dans le footer

// Définition du composant fonctionnel Footer
const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 mt-auto"> {/* Container principal du footer avec des styles de couleur de fond et de texte */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"> {/* Conteneur avec un maximum de largeur, centrage, et marges adaptées aux écrans */}
        
        {/* Structure en grille avec 3 colonnes pour organiser les informations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8"> {/* Grille de 1 colonne sur mobile et 3 colonnes sur écran moyen et plus */}
          
          {/* Première section - Informations sur Riziky-Agendas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Riziky-Agendas</h3> {/* Titre de la section avec style de texte large et gras */}
            <p className="text-sm"> {/* Description du site avec une taille de texte plus petite */}
              Votre solution pour gérer efficacement vos rendez-vous et planifier votre temps.
            </p>
          </div>
          
          {/* Deuxième section - À propos du site */}
          <div>
            <h3 className="text-lg font-semibold mb-4">À propos du site</h3> {/* Titre de la section "À propos du site" */}
            <ul className="space-y-2 text-sm"> {/* Liste avec des éléments espacés verticalement */}
              {/* Chaque élément de la liste est un lien vers des pages internes */}
              <li>
                <Link to="/a-propos" className="hover:text-primary"> {/* Lien vers la page "Notre mission" */}
                  Notre mission
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-primary"> {/* Lien vers la page "Confidentialité" */}
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-primary"> {/* Lien vers la page "Conditions d'utilisation" */}
                  Conditions d'utilisation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Troisième section - Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3> {/* Titre de la section "Contact" */}
            <ul className="space-y-2 text-sm"> {/* Liste avec des éléments espacés verticalement */}
              {/* Premier élément de la liste : lien pour envoyer un email */}
              <li className="flex items-center"> {/* Utilisation de flex pour aligner l'icône et le texte */}
                <Mail className="h-4 w-4 mr-2" /> {/* Icône de mail */}
                <a href="mailto:vianey.jean@ymail.com" className="hover:text-primary"> {/* Lien mailto pour envoyer un email */}
                  vianey.jean@ymail.com
                </a>
              </li>
              {/* Deuxième élément de la liste : lien pour appeler un numéro de téléphone */}
              <li className="flex items-center"> {/* Utilisation de flex pour aligner l'icône et le texte */}
                <Phone className="h-4 w-4 mr-2" /> {/* Icône de téléphone */}
                <a href="tel:+262692842370" className="hover:text-primary"> {/* Lien tel pour appeler un numéro */}
                  + (262) 06 92842370
                </a>
              </li>
              {/* Troisième élément de la liste : lien vers la page de contact */}
              <li>
                <Link to="/contact" className="hover:text-primary"> {/* Lien vers le formulaire de contact */}
                  Nous Contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Section du bas avec les droits d'auteur */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm"> {/* Ajouter une bordure en haut, espacement et texte centré */}
          <p>&copy; 2025 Riziky-Agendas. Tous droits réservés.</p> {/* Mention des droits d'auteur */}
        </div>
      </div>
    </footer>
  );
};

// Export du composant Footer pour pouvoir l'utiliser dans d'autres fichiers
export default Footer;
