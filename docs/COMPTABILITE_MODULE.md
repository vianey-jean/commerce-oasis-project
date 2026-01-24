# Cahier des Charges - Module Comptabilité

## 1. Vue d'ensemble

Le **ComptabiliteModule** est un module complet de gestion comptable permettant de suivre les achats, les dépenses, les ventes et le bénéfice réel d'une entreprise.

### 1.1 Objectifs
- Enregistrer et suivre tous les achats de produits
- Enregistrer et catégoriser toutes les dépenses
- Calculer le bénéfice réel (ventes - achats - dépenses)
- Fournir des statistiques et graphiques de suivi
- Maintenir la cohérence des données entre les différentes bases

---

## 2. Architecture Backend

### 2.1 Fichiers de base de données (JSON)

| Fichier | Description | Localisation |
|---------|-------------|--------------|
| `products.json` | Liste des produits | `server/db/products.json` |
| `nouvelle_achat.json` | Historique des achats | `server/db/nouvelle_achat.json` |
| `nouvelle_depense.json` | Historique des dépenses | `server/db/nouvelle_depense.json` |
| `compta.json` | Données comptables agrégées | `server/db/compta.json` |

### 2.2 Modèles (Models)

#### NouvelleAchat (`server/models/NouvelleAchat.js`)
Gère les opérations CRUD pour les achats de produits.

**Fonctionnalités clés :**
- `getAll()` - Récupère tous les achats
- `getById(id)` - Récupère un achat par ID
- `getByMonthYear(month, year)` - Filtre par mois/année
- `getByYear(year)` - Filtre par année
- `create(achatData)` - Crée un nouvel achat
  - Si le produit existe → met à jour le stock dans `products.json`
  - Si le produit n'existe pas → crée le produit dans `products.json`
- `update(id, data)` - Met à jour un achat
- `delete(id)` - Supprime un achat
- `getMonthlyStats(month, year)` - Statistiques mensuelles
- `getYearlyStats(year)` - Statistiques annuelles

#### NouvelleDepense (`server/models/NouvelleDepense.js`)
Gère les opérations CRUD pour les dépenses (taxes, carburant, autres).

**Fonctionnalités clés :**
- `getAll()` - Récupère toutes les dépenses
- `getById(id)` - Récupère une dépense par ID
- `getByMonthYear(month, year)` - Filtre par mois/année
- `getByYear(year)` - Filtre par année
- `create(depenseData)` - Crée une nouvelle dépense
- `update(id, data)` - Met à jour une dépense
- `delete(id)` - Supprime une dépense
- `getMonthlyStats(month, year)` - Statistiques mensuelles
- `getYearlyStats(year)` - Statistiques annuelles

#### Compta (`server/models/Compta.js`)
Agrège et calcule les données comptables.

**Fonctionnalités clés :**
- `getAll()` - Récupère toutes les données comptables
- `getByMonthYear(month, year)` - Données d'un mois spécifique
- `getByYear(year)` - Données d'une année
- `calculateAndSave(month, year)` - Calcule et sauvegarde les données
- `recalculateYear(year)` - Recalcule toute l'année
- `getYearlySummary(year)` - Résumé annuel

### 2.3 Routes API

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/nouvelle-achat` | GET | Liste tous les achats |
| `/api/nouvelle-achat/:id` | GET | Récupère un achat |
| `/api/nouvelle-achat` | POST | Crée un achat |
| `/api/nouvelle-achat/:id` | PUT | Met à jour un achat |
| `/api/nouvelle-achat/:id` | DELETE | Supprime un achat |
| `/api/nouvelle-achat/monthly/:year/:month` | GET | Achats par mois |
| `/api/nouvelle-achat/yearly/:year` | GET | Achats par année |
| `/api/nouvelle-depense` | GET | Liste toutes les dépenses |
| `/api/nouvelle-depense/:id` | GET | Récupère une dépense |
| `/api/nouvelle-depense` | POST | Crée une dépense |
| `/api/nouvelle-depense/:id` | PUT | Met à jour une dépense |
| `/api/nouvelle-depense/:id` | DELETE | Supprime une dépense |
| `/api/compta` | GET | Données comptables |
| `/api/compta/monthly/:year/:month` | GET | Comptabilité mensuelle |
| `/api/compta/yearly/:year` | GET | Comptabilité annuelle |
| `/api/compta/summary/:year` | GET | Résumé annuel |
| `/api/compta/calculate/:year/:month` | POST | Recalcule un mois |
| `/api/compta/recalculate/:year` | POST | Recalcule l'année |

---

## 3. Architecture Frontend

### 3.1 Composants Réutilisables

| Composant | Fichier | Description |
|-----------|---------|-------------|
| `ComptabiliteModule` | `ComptabiliteModule.tsx` | Module principal complet |
| `ComptaHeader` | `ComptaHeader.tsx` | En-tête avec sélecteurs de période |
| `ComptaStatsCards` | `ComptaStatsCards.tsx` | Cartes de statistiques |
| `AchatFormDialog` | `AchatFormDialog.tsx` | Formulaire d'ajout d'achat |
| `DepenseFormDialog` | `DepenseFormDialog.tsx` | Formulaire d'ajout de dépense |
| `StableBarChart` | `StableCharts.tsx` | Graphique en barres |
| `StablePieChart` | `StableCharts.tsx` | Graphique camembert |

### 3.2 Services API

| Service | Fichier | Description |
|---------|---------|-------------|
| `nouvelleAchatApiService` | `nouvelleAchatApi.ts` | API achats |
| `nouvelleDepenseApiService` | `nouvelleDepenseApi.ts` | API dépenses |
| `comptaApiService` | `comptaApi.ts` | API comptabilité |

### 3.3 Types TypeScript

```typescript
// types/comptabilite.ts

interface NouvelleAchat {
  id: string;
  date: string;
  productId?: string;
  productDescription: string;
  purchasePrice: number;
  quantity: number;
  fournisseur: string;
  caracteristiques: string;
  totalCost: number;
  type: 'achat_produit' | 'taxes' | 'carburant' | 'autre_depense';
}

interface NouvelleAchatFormData {
  productId?: string;
  productDescription: string;
  purchasePrice: number;
  quantity: number;
  fournisseur?: string;
  caracteristiques?: string;
  date?: string;
}

interface DepenseFormData {
  description: string;
  montant: number;
  type: 'taxes' | 'carburant' | 'autre_depense';
  categorie?: string;
  date?: string;
}

interface ComptabiliteData {
  salesTotal: number;
  salesProfit: number;
  salesCost: number;
  salesCount: number;
  achatsTotal: number;
  depensesTotal: number;
  beneficeReel: number;
  totalDebit: number;
  totalCredit: number;
  soldeNet: number;
}
```

---

## 4. Règles de gestion

### 4.1 Nouvel Achat
1. L'utilisateur recherche un produit (minimum 3 caractères)
2. **Si le produit existe dans `products.json`** :
   - Mise à jour de la quantité (+ quantité achetée)
   - Mise à jour du prix d'achat si spécifié
   - Enregistrement de l'achat dans `nouvelle_achat.json`
3. **Si le produit n'existe pas** :
   - Création du produit dans `products.json`
   - Prix de vente par défaut = prix d'achat × 1.3
   - Enregistrement de l'achat dans `nouvelle_achat.json`

### 4.2 Nouvelle Dépense
1. L'utilisateur sélectionne le type (taxes, carburant, autre)
2. Saisie de la description et du montant
3. Sélection de la catégorie
4. Enregistrement dans `nouvelle_depense.json` **uniquement**

### 4.3 Calcul Comptabilité
Le modèle `Compta` agrège les données :
- **Total Crédit** = Somme des ventes (prix de vente)
- **Achats Total** = Somme des achats depuis `nouvelle_achat.json`
- **Dépenses Total** = Somme des dépenses depuis `nouvelle_depense.json`
- **Total Débit** = Achats Total + Dépenses Total
- **Bénéfice Ventes** = Total Crédit - Coût des ventes
- **Bénéfice Réel** = Bénéfice Ventes - Total Débit
- **Solde Net** = Total Crédit - Total Débit

---

## 5. Utilisation des composants

### 5.1 Import du module complet
```tsx
import { ComptabiliteModule } from '@/components/dashboard/comptabilite';

function Page() {
  return <ComptabiliteModule className="my-class" />;
}
```

### 5.2 Import des composants individuels
```tsx
import { 
  ComptaHeader,
  ComptaStatsCards,
  AchatFormDialog,
  DepenseFormDialog,
  StableBarChart,
  StablePieChart
} from '@/components/dashboard/comptabilite';

function CustomCompta() {
  return (
    <>
      <ComptaHeader
        selectedMonth={month}
        selectedYear={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onNewAchat={() => setShowAchat(true)}
        onNewDepense={() => setShowDepense(true)}
      />
      <ComptaStatsCards
        data={comptaData}
        formatEuro={formatEuro}
        onCreditClick={() => {}}
        onDebitClick={() => {}}
      />
    </>
  );
}
```

### 5.3 Utilisation des services API
```tsx
import { 
  nouvelleAchatApiService,
  nouvelleDepenseApiService,
  comptaApiService 
} from '@/services/api';

// Récupérer les achats du mois
const achats = await nouvelleAchatApiService.getByMonthYear(2024, 1);

// Créer une dépense
await nouvelleDepenseApiService.create({
  description: 'Carburant véhicule',
  montant: 50,
  type: 'carburant',
  categorie: 'transport'
});

// Recalculer la comptabilité
await comptaApiService.calculateMonth(2024, 1);
```

---

## 6. Maintenance et évolutions

### 6.1 Ajouter un nouveau type de dépense
1. Modifier le type `DepenseFormData` dans `types/comptabilite.ts`
2. Ajouter l'option dans `DepenseFormDialog.tsx`
3. Mettre à jour le modèle `NouvelleDepense.js` si nécessaire

### 6.2 Ajouter une nouvelle catégorie
1. Ajouter l'option dans le Select de catégorie du `DepenseFormDialog.tsx`

### 6.3 Modifier les calculs comptables
1. Modifier la fonction `calculateAndSave()` dans `server/models/Compta.js`
2. Mettre à jour le `useMemo` `comptabiliteData` dans `ComptabiliteModule.tsx`

---

## 7. Dépendances

### Backend
- Express.js
- fs (Node.js native)

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui (Dialog, Card, Button, Input, Select, etc.)
- Recharts (graphiques)
- Framer Motion (animations)
- Lucide React (icônes)

---

## 8. Tests recommandés

### Backend
- Test CRUD pour `NouvelleAchat`
- Test CRUD pour `NouvelleDepense`
- Test de calcul pour `Compta`
- Test d'intégration produit/achat

### Frontend
- Test de rendu des composants
- Test des formulaires
- Test des services API
- Test d'intégration du module

---

*Document créé le : 2024*
*Version : 1.0*
