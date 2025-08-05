/**
 * ============================================================================
 * POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION
 * ============================================================================
 * 
 * Ce fichier est le bootstrap de l'application React.
 * Il initialise et monte l'application dans le DOM.
 * 
 * CONFIGURATION :
 * - StrictMode pour un développement plus strict et des warnings utiles
 * - createRoot pour la nouvelle API de montage React 18
 * - Import du composant App principal
 * - Chargement des styles CSS globaux
 * 
 * OPTIMISATIONS :
 * - Utilisation de React 18 avec les nouvelles APIs
 * - Mode strict pour détecter les problèmes de développement
 * - Point d'entrée unique pour toute l'application
 * 
 * @author Riziky Agendas Team
 * @version 1.0.0
 * @lastModified 2024
 */

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialisation et montage de l'application React dans le DOM
// Utilisation de la nouvelle API createRoot de React 18
createRoot(document.getElementById("root")!)
.render(<App />);
