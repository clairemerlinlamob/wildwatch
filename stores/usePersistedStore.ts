import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type AnimalMarker from "../app/types";

interface PersistedState {
  markers: AnimalMarker[];
  isHydrated: boolean; // Pour savoir si les données sont chargées

  // Actions
  addMarker: (marker: AnimalMarker) => void;
  updateMarker: (markerId: string, marker: Partial<AnimalMarker>) => void;
  deleteMarker: (markerId: string) => void;
  clearAllMarkers: () => void;
  setMarkers: (markers: AnimalMarker[]) => void;
  setIsHydrated: (hydrated: boolean) => void;
}

export const usePersistedStore = create<PersistedState>()(
  persist(
    (set, get) => ({
      markers: [],
      isHydrated: false,

      addMarker: (marker) => {
        set((state) => ({
          markers: [...state.markers, marker],
        }));
      },

      updateMarker: (markerId, updatedMarker) => {
        set((state) => ({
          markers: state.markers.map((marker) =>
            marker.id === markerId ? { ...marker, ...updatedMarker } : marker
          ),
        }));
      },

      deleteMarker: (markerId) => {
        set((state) => ({
          markers: state.markers.filter((marker) => marker.id !== markerId),
        }));
      },

      clearAllMarkers: () => {
        set({ markers: [] });
      },

      setMarkers: (markers) => {
        set({ markers });
      },

      setIsHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: "wildwatch-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ markers: state.markers }),
      onRehydrateStorage: () => (state) => {
        // Appelé quand les données sont rechargées
        if (state) {
          state.setIsHydrated(true);
        }
      },
    }
  )
);
