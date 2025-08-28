import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AnimalModal from "./AnimalModal";
import type AnimalMarker from "./types";

export default function Index() {
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [initialRegion, setInitialRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [markers, setMarkers] = useState<AnimalMarker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<AnimalMarker | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoordinate, setSelectedCoordinate] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const handleMapPress = (event: any) => {
    const { coordinate } = event.nativeEvent;
    // Réinitialiser le marqueur sélectionné quand on clique sur la carte
    setSelectedMarker(null);
    setSelectedCoordinate(coordinate);
    setModalVisible(true);
  };

  const addMarker = (animalData: {
    name: string;
    photoUri: string;
    selectedDate: string;
    selectedTime: string;
  }) => {
    if (!selectedCoordinate) return;

    const newMarker: AnimalMarker = {
      id: animalData.name + selectedCoordinate.latitude,
      coordinate: selectedCoordinate,
      name: animalData.name,
      photoUri: animalData.photoUri,
      selectedDate: animalData.selectedDate,
      selectedTime: animalData.selectedTime,
    };

    setMarkers([...markers, newMarker]);
  };

  const updateMarker = (
    markerId: string,
    animalData: {
      name: string;
      photoUri: string;
      selectedDate: string;
      selectedTime: string;
    }
  ) => {
    const updatedMarkers = markers.map((marker) =>
      marker.id === markerId ? { ...marker, ...animalData } : marker
    );
    setMarkers(updatedMarkers);
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
        addMarker={addMarker}
        updateMarker={updateMarker}
        selectedMarker={selectedMarker}
        onClose={() => {
          setSelectedCoordinate(null);
          setSelectedMarker(null);
          setModalVisible(false);
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
