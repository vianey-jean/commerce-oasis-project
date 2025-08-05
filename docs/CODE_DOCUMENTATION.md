
# DOCUMENTATION DU CODE - RIZIKY-AGENDAS

## Services Frontend (/src/services)

### AppointmentService.ts
**Rôle**: Service principal pour la gestion des rendez-vous
```typescript
// Point d'entrée unique pour toutes les opérations sur les rendez-vous
// Délègue vers des services spécialisés (API, Search, Calendar)
export const AppointmentService = {
  // CRUD operations
  getAll: AppointmentAPI.getAll,              // Récupère tous les rendez-vous
  add: AppointmentAPI.create,                 // Crée un nouveau rendez-vous
  update: AppointmentAPI.update,              // Met à jour un rendez-vous
  delete: AppointmentAPI.delete,              // Supprime un rendez-vous
  
  // Recherche et filtrage
  search: AppointmentSearch.search,           // Recherche textuelle avancée
  getByDateRange: AppointmentAPI.getByDateRange, // Filtrage par période
  
  // Utilitaires calendrier
  getCurrentWeekAppointments: CalendarUtils.getCurrentWeekAppointments
}
```

### AuthService.ts
**Rôle**: Gestion complète de l'authentification utilisateur
```typescript
export const AuthService = {
  // Authentification
  login(email: string, password: string): Promise<boolean>
  register(userData: Omit<User, 'id'>): Promise<boolean>
  logout(): void
  
  // Gestion d'état
  getCurrentUser(): User | null
  isAuthenticated(): boolean
  
  // Récupération de mot de passe
  resetPassword(email: string, newPassword: string): Promise<boolean>
}
```

### AdvancedNotificationService.ts
**Rôle**: Système de notifications multi-canal
```typescript
export class AdvancedNotificationService {
  // Configuration
  static updateSettings(settings: NotificationSettings): void
  static getSettings(): NotificationSettings
  
  // Notifications système
  static initializeNotifications(): Promise<void>
  static scheduleUpcomingReminders(): void
  
  // Notifications toast
  static showAppointmentCreated(appointment: Appointment): void
  static showConflictWarning(conflicts: Appointment[]): void
}
```

## Composants UI (/src/components)

### Composants de base (ui/)
Tous basés sur **shadcn/ui** et **Radix UI** pour l'accessibilité

#### Button.tsx
```typescript
// Système de variants pour différents styles
const buttonVariants = cva(
  "base-classes",              // Classes de base communes
  {
    variants: {
      variant: {
        default: "primary-style",    // Bouton principal
        destructive: "danger-style", // Actions destructives
        outline: "bordered-style",   // Style contour
        ghost: "transparent-style"   // Transparent
      },
      size: {
        default: "standard-size",    // Taille normale
        sm: "small-size",           // Petit
        lg: "large-size",           // Grand
        icon: "icon-only-size"      // Icône seule
      }
    }
  }
)
```

#### Dialog.tsx
**Composants modaux réutilisables**
```typescript
// Composants composés pour construire des modales
export const Dialog = DialogPrimitive.Root           // Conteneur principal
export const DialogTrigger = DialogPrimitive.Trigger // Déclencheur
export const DialogContent = forwardRef<...>         // Contenu modal
export const DialogHeader = ({ className, ...props }) // En-tête
export const DialogTitle = forwardRef<...>           // Titre accessible
```

### Composants métier

#### AppointmentForm.tsx
**Rôle**: Formulaire principal de création/édition de rendez-vous
```typescript
interface AppointmentFormProps {
  appointment?: Appointment      // Mode édition si présent
  onSave: (data: Appointment) => Promise<void>  // Callback sauvegarde
  onCancel: () => void          // Callback annulation
}

// Utilise React Hook Form + Zod pour validation
const form = useForm<AppointmentFormData>({
  resolver: zodResolver(appointmentSchema),  // Validation automatique
  defaultValues: appointment || defaultValues
})
```

#### WeekCalendar.tsx
**Rôle**: Vue calendrier hebdomadaire interactive
```typescript
interface WeekCalendarProps {
  appointments: Appointment[]    // Rendez-vous à afficher
  onAppointmentClick: (apt: Appointment) => void  // Clic sur rendez-vous
  onTimeSlotClick: (date: string, time: string) => void // Clic sur créneau
}

// Structure de données pour l'affichage
const weekStructure = {
  days: CalendarUtils.getWeekDays(),      // 7 jours de lundi à dimanche
  hours: CalendarUtils.getHours(),        // Heures de travail 7h-20h
  appointmentGrid: Map<string, Appointment[]> // Mapping date+heure -> rendez-vous
}
```

## Hooks personnalisés (/src/hooks)

### useAuth.ts
**Rôle**: Hook centralisé pour l'authentification
```typescript
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(
    () => AuthService.getCurrentUser()  // Initialisation depuis localStorage
  )
  
  // Fonctions mémorisées avec useCallback pour éviter re-renders
  const login = useCallback(async (email, password) => {
    const success = await AuthService.login(email, password)
    if (success) setUser(AuthService.getCurrentUser())
    return success
  }, [])
  
  return { user, isAuthenticated: !!user, login, logout, register }
}
```

### useAppointments.ts
**Rôle**: Hooks React Query pour gestion des rendez-vous
```typescript
// Hook principal avec cache intelligent
export const useAppointments = () => {
  return useQuery({
    queryKey: ['appointments'],
    queryFn: AppointmentService.getAll,
    staleTime: 5 * 60 * 1000,        // Cache valide 5min
    gcTime: 10 * 60 * 1000,          // Garbage collect après 10min
  })
}

// Mutations avec invalidation automatique du cache
export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: AppointmentService.add,
    onSuccess: () => {
      // Invalide et recharge automatiquement la liste
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    }
  })
}
```

## Utilitaires (/src/utils)

### dateUtils.ts
**Rôle**: Manipulation des dates avec date-fns
```typescript
// Formatage français automatique
export const formatDateFr = (date: Date | string, pattern = 'PPP'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, pattern, { locale: fr })
}

// Génération semaine de travail
export const getWeekDays = (startDate?: Date) => {
  const monday = startOfWeek(referenceDate, { weekStartsOn: 1 })
  return Array(7).fill(null).map((_, index) => {
    const date = addDays(monday, index)
    return {
      fullDate: date,
      isToday: isToday(date),
      formattedDate: format(date, 'yyyy-MM-dd')
    }
  })
}
```

### formatUtils.ts
**Rôle**: Formatage d'affichage utilisateur
```typescript
// Formatage nom complet
export const formatFullName = (nom: string, prenom: string): string => {
  return `${prenom} ${nom}`.trim()
}

// Durée lisible
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining === 0 ? `${hours}h` : `${hours}h ${remaining}min`
}
```

## Backend - Structure des modèles (/server/models)

### Appointment.js
**Rôle**: Modèle de données pour les rendez-vous
```javascript
class Appointment {
  // Sauvegarde avec validation
  static save(appointmentData) {
    // 1. Validation des champs obligatoires
    // 2. Génération ID unique
    // 3. Horodatage création/modification
    // 4. Sauvegarde fichier JSON
    // 5. Notification WebSocket
  }
  
  // Recherche avec filtres
  static getByUserId(userId, filters = {}) {
    // 1. Lecture fichier JSON
    // 2. Filtrage par utilisateur
    // 3. Application filtres additionnels
    // 4. Tri par date/heure
  }
}
```

### User.js
**Rôle**: Modèle utilisateur avec authentification
```javascript
class User {
  // Authentification sécurisée
  static authenticate(email, password) {
    // 1. Recherche utilisateur par email
    // 2. Vérification mot de passe (hashage prévu)
    // 3. Mise à jour dernière connexion
    // 4. Retour données utilisateur (sans mot de passe)
  }
  
  // Validation unicité email
  static isEmailUnique(email, excludeUserId = null) {
    // Vérifie que l'email n'est pas déjà utilisé
    // Exclut l'utilisateur actuel en cas de modification
  }
}
```

## Routes API (/server/routes)

### appointments.js
**Structure des endpoints**
```javascript
// GET /api/appointments - Liste des rendez-vous
router.get('/', isAuthenticated, async (req, res) => {
  // 1. Extraction user-id depuis headers
  // 2. Appel modèle avec filtres URL
  // 3. Formatage réponse JSON
  // 4. Gestion erreurs avec status appropriés
})

// POST /api/appointments - Création
router.post('/', isAuthenticated, async (req, res) => {
  // 1. Validation payload avec Joi/Yup (prévu)
  // 2. Vérification conflits horaires
  // 3. Sauvegarde via modèle
  // 4. Notification WebSocket aux clients connectés
  // 5. Réponse avec données créées
})
```

### WebSocket (/server/websocket.js)
**Communication temps réel**
```javascript
// Gestionnaire de connexions WebSocket
const setupWebSocket = (server) => {
  const wss = new WebSocketServer({ port: 3001 })
  
  wss.on('connection', (ws, request) => {
    // 1. Extraction userId depuis query params
    // 2. Ajout à la map des connexions actives
    // 3. Envoi état initial (messages non lus, etc.)
    // 4. Gestion déconnexion automatique
  })
  
  // Diffusion sélective par utilisateur
  const broadcastToUser = (userId, message) => {
    // Envoie uniquement aux connexions de cet utilisateur
  }
}
```

## Configuration et setup

### tailwind.config.ts
**Design system personnalisé**
```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Palette de couleurs HSL pour cohérence
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        // Système de couleurs sémantiques
      },
      animation: {
        // Animations personnalisées pour l'expérience premium
        "premium-glow": "premium-glow 2s ease-in-out infinite alternate",
        "floating": "floating 3s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]  // Animations fluides
}
```

### vite.config.ts
**Configuration de build moderne**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,                    // Port de développement
    proxy: {                       // Proxy vers API backend
      '/api': 'http://localhost:10000'
    }
  },
  build: {
    outDir: 'dist',               // Dossier de build
    sourcemap: true,              // Source maps pour debugging
    rollupOptions: {
      output: {
        manualChunks: {           // Code splitting optimisé
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', 'lucide-react']
        }
      }
    }
  }
})
```

Cette documentation couvre l'architecture complète du code avec tous les détails techniques nécessaires pour comprendre et maintenir l'application.
