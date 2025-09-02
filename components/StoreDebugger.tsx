import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useWildWatchData } from "../stores";

export default function StoreDebugger() {
  const {
    markers,
    currentLocation,
    initialRegion,
    selectedMarker,
    modalVisible,
    selectedCoordinate,
    persistedMarkers,
    isHydrated,
    clearSelectedData,
    resetStore,
    syncMarkers,
    loadPersistedMarkers,
    initializeStores,
  } = useWildWatchData();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔍 Debug Store Zustand</Text>

      {/* Section État de persistance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💾 État de persistance</Text>
        <Text>Store hydraté: {isHydrated ? "✅" : "❌"}</Text>
        <Text>Marqueurs en mémoire: {markers.length}</Text>
        <Text>Marqueurs persistés: {persistedMarkers.length}</Text>
        <Text style={styles.status}>
          Statut: {isHydrated ? "Données chargées" : "Chargement en cours..."}
        </Text>
      </View>

      {/* Section Localisation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Localisation</Text>
        <Text>Position actuelle: {currentLocation ? "✅" : "❌"}</Text>
        {currentLocation && (
          <Text style={styles.data}>
            Lat: {currentLocation.latitude.toFixed(6)}, Lng:{" "}
            {currentLocation.longitude.toFixed(6)}
          </Text>
        )}
        <Text>Région initiale: {initialRegion ? "✅" : "❌"}</Text>
      </View>

      {/* Section Marqueurs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🦁 Marqueurs ({markers.length})</Text>
        <Text>Marqueurs persistés: {persistedMarkers.length}</Text>

        {markers.length === 0 ? (
          <Text style={styles.emptyState}>Aucun marqueur enregistré</Text>
        ) : (
          markers.map((marker, index) => (
            <View key={marker.id} style={styles.markerItem}>
              <Text style={styles.markerTitle}>
                {index + 1}. {marker.name}
              </Text>
              <Text style={styles.markerData}>
                📍 {marker.coordinate.latitude.toFixed(4)},{" "}
                {marker.coordinate.longitude.toFixed(4)}
              </Text>
              <Text style={styles.markerData}>
                📅 {marker.selectedDate} à {marker.selectedTime}
              </Text>
              <Text style={styles.markerData}>
                🆔 ID: {marker.id.substring(0, 20)}...
              </Text>
            </View>
          ))
        )}
      </View>

      {/* Section État Modal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🪟 État Modal</Text>
        <Text>Modal visible: {modalVisible ? "✅" : "❌"}</Text>
        <Text>
          Marqueur sélectionné: {selectedMarker ? selectedMarker.name : "Aucun"}
        </Text>
        <Text>Coordonnée sélectionnée: {selectedCoordinate ? "✅" : "❌"}</Text>
      </View>

      {/* Section Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Actions</Text>

        <TouchableOpacity style={styles.button} onPress={clearSelectedData}>
          <Text style={styles.buttonText}>🧹 Effacer sélection</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={initializeStores}>
          <Text style={styles.buttonText}>🔄 Réinitialiser stores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={syncMarkers}>
          <Text style={styles.buttonText}>🔄 Synchroniser marqueurs</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={loadPersistedMarkers}>
          <Text style={styles.buttonText}>📥 Charger marqueurs persistés</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.dangerButton]}
          onPress={resetStore}
        >
          <Text style={styles.buttonText}>🗑️ Reset complet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 4,
  },
  data: {
    fontSize: 12,
    color: "#666",
    fontFamily: "monospace",
  },
  emptyState: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginVertical: 20,
  },
  markerItem: {
    backgroundColor: "#f8f9fa",
    padding: 8,
    marginVertical: 4,
    borderRadius: 4,
  },
  markerTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  markerData: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    alignItems: "center",
  },
  dangerButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
