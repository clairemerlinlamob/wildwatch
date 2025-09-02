import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { useWildWatchStore } from "./useWildWatchStore";
import { usePersistedStore } from "./usePersistedStore";
import type AnimalMarker from "../app/types";

interface CombinedState {
  // Synchronisation des marqueurs
  syncMarkers: () => void;
  loadPersistedMarkers: () => void;
  initializeStores: () => void;

  // Actions combinées
  addMarkerWithPersistence: (animalData: {
    name: string;
    photoUri: string;
    selectedDate: string;
    selectedTime: string;
  }) => void;

  updateMarkerWithPersistence: (
    markerId: string,
    animalData: {
      name: string;
      photoUri: string;
      selectedDate: string;
      selectedTime: string;
    }
  ) => void;

  deleteMarkerWithPersistence: (markerId: string) => void;
}

export const useCombinedStore = create<CombinedState>()(
  subscribeWithSelector((set, get) => ({
    syncMarkers: () => {
      const wildWatchStore = useWildWatchStore.getState();
      const persistedStore = usePersistedStore.getState();

      // Synchroniser les marqueurs du store principal vers le store persistant
      wildWatchStore.markers.forEach((marker) => {
        const existingMarker = persistedStore.markers.find(
          (m) => m.id === marker.id
        );
        if (!existingMarker) {
          persistedStore.addMarker(marker);
        }
      });
    },

    loadPersistedMarkers: () => {
      const wildWatchStore = useWildWatchStore.getState();
      const persistedStore = usePersistedStore.getState();

      // Attendre que le store persistant soit hydraté
      if (!persistedStore.isHydrated) {
        console.log("Store persistant pas encore hydraté, attente...");
        return;
      }

      // Charger les marqueurs persistés dans le store principal
      if (persistedStore.markers.length > 0) {
        console.log(
          "Chargement de",
          persistedStore.markers.length,
          "marqueurs persistés"
        );

        // Remplacer complètement les marqueurs du store principal
        useWildWatchStore.setState((state) => ({
          markers: [...persistedStore.markers],
        }));
      }
    },

    initializeStores: () => {
      const persistedStore = usePersistedStore.getState();

      // Attendre que le store persistant soit hydraté
      if (persistedStore.isHydrated) {
        get().loadPersistedMarkers();
      } else {
        // S'abonner aux changements d'hydratation
        const unsubscribe = usePersistedStore.subscribe(
          (state) => state.isHydrated,
          (isHydrated) => {
            if (isHydrated) {
              get().loadPersistedMarkers();
              unsubscribe();
            }
          }
        );
      }
    },

    addMarkerWithPersistence: (animalData) => {
      const wildWatchStore = useWildWatchStore.getState();
      const { selectedCoordinate } = wildWatchStore;

      if (!selectedCoordinate) return;

      const newMarker: AnimalMarker = {
        id: animalData.name + selectedCoordinate.latitude + Date.now(),
        coordinate: selectedCoordinate,
        name: animalData.name,
        photoUri: animalData.photoUri,
        selectedDate: animalData.selectedDate,
        selectedTime: animalData.selectedTime,
      };

      console.log("Ajout du marqueur avec persistance:", newMarker);

      // Ajouter au store principal
      wildWatchStore.addMarker(animalData);

      // Ajouter au store persistant
      usePersistedStore.getState().addMarker(newMarker);
    },

    updateMarkerWithPersistence: (markerId, animalData) => {
      console.log(
        "Mise à jour du marqueur avec persistance:",
        markerId,
        animalData
      );

      // Mettre à jour dans le store principal
      useWildWatchStore.getState().updateMarker(markerId, animalData);

      // Mettre à jour dans le store persistant
      usePersistedStore.getState().updateMarker(markerId, animalData);
    },

    deleteMarkerWithPersistence: (markerId) => {
      console.log("Suppression du marqueur avec persistance:", markerId);

      // Supprimer du store principal
      useWildWatchStore.getState().deleteMarker(markerId);

      // Supprimer du store persistant
      usePersistedStore.getState().deleteMarker(markerId);
    },
  }))
);

// Hook personnalisé pour utiliser les stores combinés
export const useWildWatchData = () => {
  const wildWatchStore = useWildWatchStore();
  const persistedStore = usePersistedStore();
  const combinedStore = useCombinedStore();

  return {
    // Données du store principal
    ...wildWatchStore,

    // Données persistées
    persistedMarkers: persistedStore.markers,
    isHydrated: persistedStore.isHydrated,

    // Actions combinées
    addMarkerWithPersistence: combinedStore.addMarkerWithPersistence,
    updateMarkerWithPersistence: combinedStore.updateMarkerWithPersistence,
    deleteMarkerWithPersistence: combinedStore.deleteMarkerWithPersistence,
    syncMarkers: combinedStore.syncMarkers,
    loadPersistedMarkers: combinedStore.loadPersistedMarkers,
    initializeStores: combinedStore.initializeStores,
  };
};
