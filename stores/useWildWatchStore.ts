import { create } from 'zustand';
import type AnimalMarker from '../app/types';

interface Location {
  latitude: number;
  longitude: number;
}

interface Region extends Location {
  latitudeDelta: number;
  longitudeDelta: number;
}

interface WildWatchState {
  // Données des marqueurs d'animaux
  markers: AnimalMarker[];
  
  // Localisation
  currentLocation: Location | null;
  initialRegion: Region | null;
  
  // États modaux et sélections
  selectedMarker: AnimalMarker | null;
  modalVisible: boolean;
  selectedCoordinate: Location | null;
  
  // Actions pour les marqueurs
  addMarker: (animalData: {
    name: string;
    photoUri: string;
    selectedDate: string;
    selectedTime: string;
  }) => void;
  
  updateMarker: (
    markerId: string,
    animalData: {
      name: string;
      photoUri: string;
      selectedDate: string;
      selectedTime: string;
    }
  ) => void;
  
  deleteMarker: (markerId: string) => void;
  
  // Actions pour la localisation
  setCurrentLocation: (location: Location) => void;
  setInitialRegion: (region: Region) => void;
  
  // Actions pour les modals et sélections
  setSelectedMarker: (marker: AnimalMarker | null) => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedCoordinate: (coordinate: Location | null) => void;
  
  // Actions utilitaires
  clearSelectedData: () => void;
  resetStore: () => void;
}

export const useWildWatchStore = create<WildWatchState>((set, get) => ({
  // État initial
  markers: [],
  currentLocation: null,
  initialRegion: null,
  selectedMarker: null,
  modalVisible: false,
  selectedCoordinate: null,
  
  // Actions pour les marqueurs
  addMarker: (animalData) => {
    const { selectedCoordinate } = get();
    if (!selectedCoordinate) return;
    
    const newMarker: AnimalMarker = {
      id: animalData.name + selectedCoordinate.latitude + Date.now(),
      coordinate: selectedCoordinate,
      name: animalData.name,
      photoUri: animalData.photoUri,
      selectedDate: animalData.selectedDate,
      selectedTime: animalData.selectedTime,
    };
    
    set((state) => ({
      markers: [...state.markers, newMarker],
      modalVisible: false,
      selectedCoordinate: null,
    }));
  },
  
  updateMarker: (markerId, animalData) => {
    set((state) => ({
      markers: state.markers.map((marker) =>
        marker.id === markerId ? { ...marker, ...animalData } : marker
      ),
      modalVisible: false,
      selectedMarker: null,
    }));
  },
  
  deleteMarker: (markerId) => {
    set((state) => ({
      markers: state.markers.filter((marker) => marker.id !== markerId),
      selectedMarker: null,
      modalVisible: false,
    }));
  },
  
  // Actions pour la localisation
  setCurrentLocation: (location) => {
    set({ currentLocation: location });
  },
  
  setInitialRegion: (region) => {
    set({ initialRegion: region });
  },
  
  // Actions pour les modals et sélections
  setSelectedMarker: (marker) => {
    set({ selectedMarker: marker });
  },
  
  setModalVisible: (visible) => {
    set({ modalVisible: visible });
  },
  
  setSelectedCoordinate: (coordinate) => {
    set({ selectedCoordinate: coordinate });
  },
  
  // Actions utilitaires
  clearSelectedData: () => {
    set({
      selectedMarker: null,
      selectedCoordinate: null,
      modalVisible: false,
    });
  },
  
  resetStore: () => {
    set({
      markers: [],
      currentLocation: null,
      initialRegion: null,
      selectedMarker: null,
      modalVisible: false,
      selectedCoordinate: null,
    });
  },
}));
