# Stores Zustand - WildWatch

Ce dossier contient l'implémentation des stores Zustand pour la gestion d'état de l'application WildWatch.

## 📁 Structure des fichiers

```
stores/
├── index.ts                 # Export centralisé des stores
├── useWildWatchStore.ts     # Store principal pour l'état de l'application
├── usePersistedStore.ts     # Store avec persistance AsyncStorage
├── useCombinedStore.ts      # Store combiné avec synchronisation
└── README.md               # Cette documentation
```

## 🏪 Stores disponibles

### 1. `useWildWatchStore` - Store Principal

Gère l'état principal de l'application :

- **Marqueurs d'animaux** : Liste des animaux observés sur la carte
- **Localisation** : Position actuelle et région initiale de la carte
- **États modaux** : Gestion des modals et sélections

```typescript
import { useWildWatchStore } from "../stores";

const {
  markers,
  currentLocation,
  selectedMarker,
  modalVisible,
  addMarker,
  updateMarker,
  deleteMarker,
  setCurrentLocation,
  setModalVisible,
  clearSelectedData,
  resetStore,
} = useWildWatchStore();
```

### 2. `usePersistedStore` - Store Persistant

Gère la persistance des données avec AsyncStorage :

- **Marqueurs persistés** : Sauvegarde automatique des marqueurs
- **Actions CRUD** : Ajout, modification, suppression avec persistance

```typescript
import { usePersistedStore } from "../stores";

const {
  markers: persistedMarkers,
  addMarker,
  updateMarker,
  deleteMarker,
  clearAllMarkers,
} = usePersistedStore();
```

### 3. `useCombinedStore` - Store Combiné

Combine les deux stores avec synchronisation automatique :

- **Synchronisation** : Maintient la cohérence entre les stores
- **Actions combinées** : Opérations qui mettent à jour les deux stores
- **Chargement automatique** : Récupération des données persistées

```typescript
import { useCombinedStore } from "../stores";

const {
  syncMarkers,
  loadPersistedMarkers,
  addMarkerWithPersistence,
  updateMarkerWithPersistence,
  deleteMarkerWithPersistence,
} = useCombinedStore();
```

### 4. `useWildWatchData` - Hook Principal

Hook personnalisé qui combine tous les stores pour une utilisation simplifiée :

```typescript
import { useWildWatchData } from "../stores";

const {
  // États du store principal
  markers,
  currentLocation,
  selectedMarker,
  modalVisible,

  // Données persistées
  persistedMarkers,

  // Actions combinées
  addMarkerWithPersistence,
  updateMarkerWithPersistence,
  deleteMarkerWithPersistence,
  syncMarkers,
  loadPersistedMarkers,

  // Actions du store principal
  setCurrentLocation,
  setModalVisible,
  clearSelectedData,
  resetStore,
} = useWildWatchData();
```

## 🚀 Utilisation recommandée

### Dans les composants principaux

```typescript
import { useWildWatchData } from "../stores";

export default function MyComponent() {
  const {
    markers,
    addMarkerWithPersistence,
    updateMarkerWithPersistence,
    setModalVisible,
    clearSelectedData,
  } = useWildWatchData();

  // Utiliser les actions avec persistance automatique
  const handleAddAnimal = (animalData) => {
    addMarkerWithPersistence(animalData);
  };

  const handleUpdateAnimal = (markerId, animalData) => {
    updateMarkerWithPersistence(markerId, animalData);
  };

  // ...
}
```

### Chargement initial des données

```typescript
useEffect(() => {
  // Charger les marqueurs persistés au démarrage
  loadPersistedMarkers();
}, []);
```

## 🔄 Synchronisation des données

Les stores sont automatiquement synchronisés, mais vous pouvez forcer une synchronisation :

```typescript
// Synchroniser manuellement
syncMarkers();

// Charger les données persistées
loadPersistedMarkers();
```

## 🗑️ Gestion des données

### Réinitialisation

```typescript
// Effacer seulement les sélections
clearSelectedData();

// Reset complet de tous les stores
resetStore();
```

### Suppression

```typescript
// Supprimer un marqueur spécifique
deleteMarkerWithPersistence(markerId);

// Supprimer tous les marqueurs persistés
usePersistedStore.getState().clearAllMarkers();
```

## 📊 Types de données

### AnimalMarker

```typescript
interface AnimalMarker {
  id: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  name: string;
  photoUri: string;
  selectedDate: string;
  selectedTime: string;
}
```

### Location

```typescript
interface Location {
  latitude: number;
  longitude: number;
}
```

### Region

```typescript
interface Region extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}
```

## 🛠️ Débogage

Utilisez le composant `StoreDebugger` pour visualiser l'état des stores :

```typescript
import StoreDebugger from "../components/StoreDebugger";

// Dans votre composant
<StoreDebugger />;
```

## 🔧 Configuration

### AsyncStorage

La persistance utilise AsyncStorage avec la clé `'wildwatch-storage'`. Les données sont automatiquement sauvegardées et restaurées.

### Middleware Zustand

- **persist** : Pour la persistance des données
- **subscribeWithSelector** : Pour la synchronisation entre stores

## 📝 Bonnes pratiques

1. **Utilisez `useWildWatchData`** pour la plupart des cas d'usage
2. **Utilisez les actions avec persistance** (`addMarkerWithPersistence`, etc.)
3. **Chargez les données persistées** au démarrage de l'app
4. **Utilisez `clearSelectedData`** pour nettoyer les sélections
5. **Testez avec `StoreDebugger`** pendant le développement

## 🐛 Dépannage

### Problèmes courants

1. **Données non persistées** : Vérifiez que AsyncStorage est bien installé
2. **Synchronisation manquée** : Appelez `syncMarkers()` manuellement
3. **Performance** : Utilisez des sélecteurs pour éviter les re-renders inutiles

### Logs de débogage

```typescript
// Activer les logs de Zustand
import { devtools } from "zustand/middleware";

// Dans la création du store
create(
  devtools(
    (set, get) => ({
      // votre store
    }),
    { name: "WildWatch Store" }
  )
);
```
