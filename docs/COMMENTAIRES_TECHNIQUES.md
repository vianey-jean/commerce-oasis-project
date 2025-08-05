
# GUIDE DES COMMENTAIRES TECHNIQUES

## Conventions de commentaires adoptées

### Commentaires de fonctions/méthodes
```typescript
/**
 * Description claire de la fonction et son objectif
 * @param parameter - Description du paramètre avec son type
 * @returns Description de la valeur de retour
 * @example
 * // Exemple d'utilisation
 * const result = myFunction('example')
 */
```

### Commentaires inline
```typescript
// Description de la logique métier complexe
const complexCalculation = value * 0.85; // Taux de commission 15%

// Étapes d'un processus multi-étapes
// 1. Validation des données d'entrée
// 2. Transformation selon business rules
// 3. Sauvegarde avec notification
```

### Commentaires de composants React
```typescript
/**
 * Composant pour [objectif du composant]
 * 
 * @props {Type} propName - Description de la propriété
 * @state Explication des états internes gérés
 * @hooks Liste des hooks personnalisés utilisés
 * @dependencies Services ou contextes requis
 */
```

## Types de commentaires par fichier

### Services (/src/services)
- **Objectif du service**: Rôle et responsabilités
- **Méthodes publiques**: Documentation complète de l'API
- **Gestion d'erreurs**: Cas d'erreur et récupération
- **État et cache**: Stratégie de mise en cache
- **Dépendances externes**: APIs, services tiers

### Composants React (/src/components)
- **Props et types**: Documentation TypeScript complète  
- **États internes**: Cycle de vie des données
- **Effets de bord**: useEffect et leurs dépendances
- **Handlers d'événements**: Logique de traitement
- **Rendu conditionnel**: Conditions d'affichage

### Hooks personnalisés (/src/hooks)
- **Objectif du hook**: Logique réutilisable encapsulée
- **Valeurs de retour**: Interface exposée aux composants
- **Effets secondaires**: Synchronisation et cleanup
- **Optimisations**: Memoization et performance

### Utilitaires (/src/utils)
- **Fonctions pures**: Entrées/sorties clairement définies
- **Algorithmes**: Logique métier complexe expliquée
- **Formats et validations**: Règles de transformation
- **Constants**: Valeurs métier avec contexte

### Backend (/server)
- **Routes API**: Documentation des endpoints
- **Modèles de données**: Structure et relations
- **Middlewares**: Logique de traitement des requêtes
- **Validation**: Règles business et contraintes
- **WebSocket**: Communication temps réel

## Standards de qualité

### Clarté et précision
- **Langage simple**: Éviter le jargon technique inutile
- **Contexte métier**: Expliquer le "pourquoi" pas seulement le "comment"
- **Exemples concrets**: Cases d'usage typiques
- **Mise à jour**: Commentaires synchronisés avec le code

### Organisation
- **Hiérarchie**: Commentaires structurés par importance
- **Groupement**: Sections logiques clairement délimitées
- **Références**: Liens vers documentation externe si pertinent
- **TODO et FIXME**: Actions de maintenance identifiées

### Performance et maintenance
- **Complexité**: Algorithmes non-triviaux expliqués
- **Optimisations**: Choix techniques justifiés
- **Limitations**: Contraintes et cas limites documentés
- **Évolutivité**: Points d'extension identifiés

## Commentaires par zone fonctionnelle

### Authentification
```typescript
// Gestion du cycle de vie utilisateur complet
// - Connexion sécurisée avec validation
// - Maintien de session avec localStorage
// - Déconnexion automatique après inactivité
// - Récupération de mot de passe par email
```

### Gestion des rendez-vous
```typescript
// CRUD complet avec validation métier
// - Validation des conflits horaires
// - Notification automatique des modifications
// - Synchronisation temps réel multi-clients
// - Historique des modifications
```

### Interface utilisateur
```typescript
// Design system cohérent avec Tailwind
// - Composants réutilisables avec variants
// - Thème sombre/clair automatique
// - Responsive design mobile-first
// - Animations fluides et transitions
```

### Communications
```typescript
// Architecture multi-canal
// - REST API pour opérations CRUD
// - WebSocket pour temps réel
// - Notifications toast utilisateur
// - Emails automatiques (Nodemailer)
```

Cette approche garantit une documentation technique complète et maintenue du projet.
