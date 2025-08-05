
# ARCHITECTURE TECHNIQUE - RIZIKY-AGENDAS

## Vue d'ensemble architecturale

### Architecture générale
```
┌─────────────────┐    HTTP/REST API     ┌─────────────────┐
│   FRONTEND      │◄──────────────────►  │    BACKEND      │
│   React/TS      │                      │   Node.js       │
│   Port: 5173    │    WebSocket (3001)  │   Port: 10000   │
└─────────────────┘◄──────────────────►  └─────────────────┘
         │                                        │
         │                                        │
         ▼                                        ▼
┌─────────────────┐                      ┌─────────────────┐
│  LOCAL STORAGE  │                      │  FILE SYSTEM    │
│   - user auth   │                      │   - JSON files  │
│   - settings    │                      │   - uploads     │
└─────────────────┘                      └─────────────────┘
```

## Stack technique détaillé

### Frontend (React + TypeScript)
- **Framework**: React 18.3.1 + TypeScript 5.5.2
- **Build Tool**: Vite 5.4.1 (ESM, Hot Reload)
- **Routeur**: React Router DOM 6.26.2
- **Gestion d'état**: React Query (TanStack) 5.56.2
- **Formulaires**: React Hook Form 7.53.0 + Zod 3.23.8
- **UI Framework**: Tailwind CSS 3.4.1 + shadcn/ui
- **Dates**: date-fns 3.6.0 (internationalisation française)
- **Icônes**: Lucide React 0.462.0
- **Notifications**: Sonner 1.5.0
- **WebSocket**: Client natif WebSocket

### Backend (Node.js + Express)
- **Runtime**: Node.js (version LTS)
- **Framework**: Express.js 4.18.2
- **Middleware**: CORS 2.8.5, Multer 1.4.5
- **Email**: Nodemailer 6.9.7
- **WebSocket**: ws 8.18.0
- **Storage**: Système de fichiers JSON
- **Variables d'environnement**: dotenv 16.3.1

## Structure des dossiers

### Frontend (/src)
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base (shadcn)
│   ├── dashboard/      # Composants spécifiques au dashboard
│   └── [autres]/       # Composants métier
├── pages/              # Pages de l'application
├── services/           # Services API et logique métier
│   ├── appointment/    # Service rendez-vous
│   └── notification/   # Service notifications
├── hooks/              # Custom React hooks
├── utils/              # Utilitaires et helpers
├── contexts/           # Contextes React
└── lib/               # Configuration et setup
```

### Backend (/server)
```
server/
├── models/            # Modèles de données (JSON)
├── routes/            # Routes API Express
├── middlewares/       # Middlewares Express
├── data/             # Stockage JSON
├── uploads/          # Fichiers uploadés
├── utils/            # Utilitaires serveur
└── websocket.js      # Gestion WebSocket
```

## Communication Client-Serveur

### API REST
- **Base URL**: `http://localhost:10000/api`
- **Format**: JSON (Content-Type: application/json)
- **Authentification**: Headers user-id
- **Gestion erreurs**: Status HTTP + messages explicites

### Endpoints principaux
```
/api/appointments     # CRUD rendez-vous
/api/auth            # Authentification
/api/contact         # Messages de contact
/api/clients         # Gestion clients
/api/messages        # Messages administrateur
/api/sms             # Service SMS (simulation)
```

### WebSocket (Temps réel)
- **Port**: 3001
- **Protocole**: WebSocket natif
- **Usage**: Notifications temps réel, synchronisation données
- **Messages**: JSON structuré avec type + payload

## Gestion des données

### Côté client (Frontend)
- **Cache**: React Query (5min cache, 10min GC)
- **Persistance**: localStorage (authentification, préférences)
- **Synchronisation**: WebSocket + polling de secours

### Côté serveur (Backend)
- **Stockage**: Fichiers JSON dans /server/data/
- **Backup**: Copies automatiques lors des modifications
- **Concurrence**: Verrous de fichiers pour l'intégrité

## Sécurité et authentification

### Frontend
- Protection des routes privées
- Validation des formulaires (client + serveur)
- Sanitisation des inputs utilisateur
- Gestion automatique des tokens expirés

### Backend
- Middleware d'authentification sur routes protégées
- Validation stricte des données entrantes
- Headers de sécurité CORS configurés
- Limitation des uploads (taille, types)

## Performance et optimisation

### Frontend
- Code splitting par routes
- Lazy loading des composants
- Memoization React (useMemo, useCallback)
- Debounce sur recherches et API calls
- Optimistic updates avec React Query

### Backend
- Cache en mémoire pour données fréquentes
- Pagination des résultats volumineux
- Compression gzip automatique
- Limitation du rate limiting par IP

## Déploiement et environnements

### Variables d'environnement
```bash
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:10000
VITE_WS_URL=ws://localhost:3001

# Backend (.env)
PORT=10000
WS_PORT=3001
NODE_ENV=production
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
```

### Build et déploiement
```bash
# Frontend
npm run build        # Génère dist/ pour production
npm run preview      # Test build local

# Backend  
npm start           # Production
npm run dev         # Développement avec nodemon
```

## Tests et qualité

### Frontend
- Validation TypeScript stricte
- ESLint + Prettier (formatage)
- Tests d'intégration React Query
- Validation des formulaires en temps réel

### Backend
- Validation des schémas de données
- Tests de routes API
- Gestion centralisée des erreurs
- Logs structurés pour debugging

## Monitoring et logs

### Frontend
- Console.log structurés par service
- Tracking des erreurs React
- Métriques de performance React Query
- Analytics utilisateur (préparé)

### Backend
- Logs Express avec timestamps
- Suivi des WebSocket connections
- Métriques d'utilisation API
- Alertes sur erreurs critiques

## Scalabilité future

### Prêt pour l'évolution
- Architecture modulaire (services séparés)
- Interfaces TypeScript bien définies
- Séparation claire client/serveur
- Base pour intégration BDD relationnelle
- Support multi-utilisateurs (préparé)
