
/**
 * ============================================================================
 * PIED DE PAGE PRINCIPAL - FOOTER DE L'APPLICATION
 * ============================================================================
 * 
 * Ce composant affiche le pied de page de l'application avec les liens de navigation,
 * informations légales et branding de l'application Riziky Agendas.
 * 
 * SECTIONS DU FOOTER :
 * 1. Logo et Description : Branding principal avec slogan
 * 2. Liens Rapides : Navigation vers les pages principales (Dashboard, Calendar, Clients)
 * 3. À Propos : Liens vers pages informatives (Mission, About, Contact)
 * 4. Légal & Support : Liens vers pages légales et support
 * 5. Copyright : Mentions légales et droits d'auteur
 * 
 * FONCTIONNALITÉS :
 * - Navigation organisée en 4 colonnes responsives
 * - Icônes Lucide pour améliorer la lisibilité
 * - Effets de survol sur tous les liens
 * - Design adaptatif (mobile, tablette, desktop)
 * - Gradient background cohérent avec le header
 * 
 * DESIGN :
 * - Gradient background bleu-violet cohérent
 * - Grid layout responsive (1-4 colonnes selon écran)
 * - Icônes contextuelles pour chaque lien
 * - Transitions CSS douces sur interactions
 * - Typographie hiérarchisée et lisible
 * 
 * ACCESSIBILITÉ :
 * - Liens avec texte descriptif
 * - Contraste de couleurs respecté
 * - Navigation au clavier possible
 * - Structure sémantique HTML
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Heart, Shield, FileText, HelpCircle, Target } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-violet-600 text-white py-8 lg:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-300" />
              <h3 className="text-lg font-bold">Riziky-Agendas</h3>
            </div>
            <p className="text-white/80 text-sm">
              La solution premium pour gérer vos rendez-vous avec élégance et efficacité.
            </p>
          </div>

          {/* Liens rapides */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Liens Rapides</h4>
            <div className="space-y-2">
              <Link to="/dashboard" className="block text-white/80 hover:text-white transition-colors text-sm">
                Tableau de bord
              </Link>
              <Link to="/calendar" className="block text-white/80 hover:text-white transition-colors text-sm">
                Calendrier
              </Link>
              <Link to="/clients" className="block text-white/80 hover:text-white transition-colors text-sm">
                Clients
              </Link>
            </div>
          </div>

          {/* À propos */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">À Propos</h4>
            <div className="space-y-2">
              <Link to="/mission" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Target className="w-4 h-4" />
                Notre Mission
              </Link>
              <Link to="/about" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Heart className="w-4 h-4" />
                À Propos
              </Link>
              <Link to="/contact" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                Contact
              </Link>
            </div>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Légal & Support</h4>
            <div className="space-y-2">
              <Link to="/confidentialite" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <Shield className="w-4 h-4" />
                Confidentialité
              </Link>
              <Link to="/conditions" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <FileText className="w-4 h-4" />
                Conditions d'utilisation
              </Link>
              <Link to="/support" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                Support
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <p className="text-white/80 text-sm">
            © 2024 Riziky-Agendas Premium. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
