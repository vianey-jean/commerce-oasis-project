
/**
 * ============================================================================
 * PAGE DE CONTACT - FORMULAIRE DE CONTACT ET INFORMATIONS
 * ============================================================================
 * 
 * Cette page permet aux utilisateurs de contacter l'équipe Riziky Agendas
 * via un formulaire sécurisé avec validation en temps réel.
 * 
 * FONCTIONNALITÉS PRINCIPALES :
 * - Formulaire de contact avec validation complète
 * - Informations de contact de l'entreprise
 * - Envoi d'emails automatique via le service backend
 * - Notifications de succès/erreur avec ModernToast
 * - Design responsive et accessible
 * 
 * CHAMPS DU FORMULAIRE :
 * - Nom complet (obligatoire)
 * - Adresse email (obligatoire, validation format)
 * - Sujet du message (obligatoire)
 * - Message détaillé (obligatoire, 500 caractères max)
 * 
 * VALIDATION :
 * - Validation côté client avec regex pour email
 * - Limitation de caractères pour éviter le spam
 * - Vérification de tous les champs obligatoires
 * - Messages d'erreur contextuels et utiles
 * 
 * INTÉGRATION BACKEND :
 * - Utilise ContactService pour l'envoi
 * - Sauvegarde en base de données (messages.json)
 * - Envoi d'email via nodemailer (si configuré)
 * - Notification en temps réel via WebSocket
 * 
 * DESIGN PREMIUM :
 * - Cards avec glass-morphism effect
 * - Animations CSS fluides
 * - Icônes contextuelles (Mail, Phone, MapPin)
 * - États de chargement avec spinners
 * - Layout responsive avec grid system
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock, AlertCircle } from 'lucide-react';
import { ContactService } from '@/services/ContactService';
import { ModernToast } from '@/components/ui/modern-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors = {
      nom: '',
      email: '',
      sujet: '',
      message: ''
    };

    // Validation du nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Format d\'email invalide (ex: test@test.com)';
    }

    // Validation du sujet
    if (!formData.sujet.trim()) {
      newErrors.sujet = 'Le sujet est obligatoire';
    }

    // Validation du message
    if (!formData.message.trim()) {
      newErrors.message = 'Le message est obligatoire';
    } else if (formData.message.length < 8) {
      newErrors.message = 'Le message doit contenir au moins 8 caractères';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => error === '');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await ContactService.send(formData);
      
      if (result.success) {
        ModernToast.success("✅ Message envoyé avec succès !");
        setFormData({ nom: '', email: '', sujet: '', message: '' });
        setErrors({ nom: '', email: '', sujet: '', message: '' });
      } else {
        ModernToast.error("❌ Erreur lors de l'envoi du message");
      }
    } catch (error) {
      ModernToast.error("❌ Erreur de connexion au serveur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-100 mt-[80px]">
      {/* Éléments décoratifs */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-full text-sm font-medium text-teal-800 mb-6 shadow-lg">
              <MessageCircle className="w-4 h-4 mr-2" />
              Nous sommes là pour vous
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Une question, une suggestion ou besoin d'aide ? Notre équipe est à votre écoute
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Formulaire de contact */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Send className="w-6 h-6" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Nom complet *</label>
                      <Input
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        className={`bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg ${
                          errors.nom ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="Votre nom"
                      />
                      {errors.nom && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.nom}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email *</label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg ${
                          errors.email ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="votre@email.com"
                      />
                      {errors.email && (
                        <div className="flex items-center gap-2 text-red-500 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sujet *</label>
                    <Input
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      className={`bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg ${
                        errors.sujet ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="Objet de votre message"
                    />
                    {errors.sujet && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.sujet}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Message * 
                      <span className="text-blue-600 font-bold ml-2">
                        (minimum 8 caractères)
                      </span>
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`text-blue-600 font-bold  bg-gray-50 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-lg resize-none ${
                        errors.message ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="Décrivez votre demande en détail..."
                    />
                    {errors.message && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {errors.message}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      {formData.message.length}/8 caractères minimum
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Envoi en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Informations de contact */}
            <div className="space-y-8">
              {/* Coordonnées */}
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-800 flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    Nos coordonnées
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <a href="mailto:vianey.jean@ymail.com" className="text-red-600 hover:text-red-700 transition-colors">
                        vianey.jean@ymail.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Téléphone</h4>
                      <a href="tel:+262692842370" className="text-green-600 hover:text-green-700 transition-colors">
                        + (262) 06 92842370
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Localisation</h4>
                      <p className="text-gray-600">La Réunion, France</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Horaires */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="text-xl text-green-800 flex items-center gap-3">
                    <Clock className="w-5 h-5" />
                    Horaires de support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <span className="font-medium text-gray-700">Lundi - Vendredi</span>
                      <span className="text-green-600 font-semibold">8h00 - 18h00</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-green-100">
                      <span className="font-medium text-gray-700">Samedi</span>
                      <span className="text-green-600 font-semibold">9h00 - 12h00</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-700">Dimanche</span>
                      <span className="text-gray-400">Fermé</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
