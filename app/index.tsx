import * as Location from "expo-location";
import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AnimalModal from "./AnimalModal";
import { useWildWatchData } from "../stores";

export default function Index() {
  const {
    // États du store
    markers,
    currentLocation,
    initialRegion,
    selectedMarker,
    modalVisible,
    selectedCoordinate,
    isHydrated,

    // Actions du store
    setCurrentLocation,
    setInitialRegion,
    setSelectedMarker,
    setModalVisible,
    setSelectedCoordinate,
    addMarkerWithPersistence,
    updateMarkerWithPersistence,
    initializeStores,
    clearSelectedData,
  } = useWildWatchData();

  useEffect(() => {
    // Initialiser les stores (gère l'hydratation asynchrone)
    initializeStores();

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const currentLoc = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(currentLoc);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  // Log pour déboguer
  useEffect(() => {
    console.log("État de l'hydratation:", isHydrated);
    console.log("Nombre de marqueurs:", markers.length);
  }, [isHydrated, markers.length]);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    // Réinitialiser le marqueur sélectionné quand on clique sur la carte
    setSelectedMarker(null);
    setSelectedCoordinate(coordinate);
    setModalVisible(true);
  };

  const handleMarkerPress = (markerId: string, event: any) => {
    event.stopPropagation();

    const marker = markers.find((marker) => marker.id === markerId);
    if (marker) {
      setSelectedMarker(marker);
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      {initialRegion && (
        <MapView
          style={styles.map}
          initialRegion={initialRegion}
          showsUserLocation
          onPress={handleMapPress}
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              onPress={(event) => handleMarkerPress(marker.id, event)}
              anchor={{ x: 0.5, y: 1 }}
            >
              <View style={{ width: 60, height: 60 }}>
                <Image
                  source={require("../assets/images/pin.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      )}
      <AnimalModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        addMarker={addMarkerWithPersistence}
        updateMarker={updateMarkerWithPersistence}
        selectedMarker={selectedMarker}
        onClose={() => {
          clearSelectedData();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
