import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AnimalMarker from "./types";

export default function AnimalModal({
  modalVisible,
  setModalVisible,
  addMarker,
  updateMarker,
  selectedMarker,
  onClose,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
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
  selectedMarker: AnimalMarker | null;
  onClose: () => void;
}) {
  const [animalName, setAnimalName] = useState(selectedMarker?.name || "");
  const [selectedDate, setSelectedDate] = useState(
    selectedMarker?.selectedDate || ""
  );
  const [selectedTime, setSelectedTime] = useState(
    selectedMarker?.selectedTime || ""
  );
  const [photoUri, setPhotoUri] = useState(selectedMarker?.photoUri || "");

  // Mettre à jour les champs quand selectedMarker change ou quand la modal s'ouvre
  useEffect(() => {
    if (selectedMarker) {
      setAnimalName(selectedMarker.name || "");
      setSelectedDate(selectedMarker.selectedDate || "");
      setSelectedTime(selectedMarker.selectedTime || "");
      setPhotoUri(selectedMarker.photoUri || "");
    } else {
      // Réinitialiser les champs quand il n'y a pas de marqueur sélectionné
      setAnimalName("");
      setSelectedDate("");
      setSelectedTime("");
      setPhotoUri("");
    }
  }, [selectedMarker, modalVisible]);

  const handleSubmit = () => {
    if (!animalName.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom pour l'animal");
      return;
    }

    addMarker({
      name: animalName,
      photoUri: photoUri,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
    });

    // Réinitialiser les champs
    setAnimalName("");
    setSelectedDate("");
    setSelectedTime("");
    setPhotoUri("");

    onClose();
  };

  const handleEdit = () => {
    if (!selectedMarker) return;

    if (!animalName.trim()) {
      Alert.alert("Erreur", "Veuillez saisir un nom pour l'animal");
      return;
    }

    updateMarker(selectedMarker.id, {
      name: animalName,
      photoUri: photoUri,
      selectedDate: selectedDate,
      selectedTime: selectedTime,
    });

    // Réinitialiser les champs
    setAnimalName("");
    setSelectedDate("");
    setSelectedTime("");
    setPhotoUri("");

    onClose();
  };

  const takePhoto = async () => {
    // Demander la permission d'utiliser la caméra
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.status !== "granted") {
      Alert.alert(
        "Permission requise",
        "Vous devez autoriser l'accès à la caméra pour prendre une photo."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Camera result:", result);

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("Library result:", result);

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handlePhotoPress = async () => {
    // Afficher un menu de choix
    Alert.alert(
      "Choisir une photo",
      "Comment voulez-vous ajouter une photo ?",
      [
        {
          text: "Prendre une photo",
          onPress: () => takePhoto(),
        },
        {
          text: "Choisir dans la galerie",
          onPress: () => pickFromLibrary(),
        },
        {
          text: "Annuler",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>
            {selectedMarker ? "Modifier l'animal" : "Ajouter un animal"}
          </Text>

          {/* Section Photo */}
          <TouchableOpacity
            style={styles.photoContainer}
            onPress={handlePhotoPress}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.photo} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>+ Photo</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Champ Nom */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom de l animal</Text>
            <TextInput
              style={styles.textInput}
              value={animalName}
              onChangeText={setAnimalName}
              placeholder="Entrez le nom de l'animal"
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date d observation</Text>
            <TextInput
              style={styles.textInput}
              value={selectedDate}
              onChangeText={setSelectedDate}
              placeholder="JJ/MM/AAAA"
              placeholderTextColor="#999"
            />
          </View>

          {/* Champ Heure */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Heure d observation</Text>
            <TextInput
              style={styles.textInput}
              value={selectedTime}
              onChangeText={setSelectedTime}
              placeholder="HH:MM"
              placeholderTextColor="#999"
            />
          </View>

          {/* Boutons */}
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </Pressable>
            {selectedMarker ? (
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleEdit}
              >
                <Text style={styles.buttonText}>Modifier</Text>
              </Pressable>
            ) : (
              <Pressable
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>Enregistrer</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  photoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C0C0C0",
  },
  photoPlaceholderText: {
    color: "#888",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 15,
    alignSelf: "stretch",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: "#333",
    width: "100%",
    alignSelf: "stretch",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 20,
    alignSelf: "stretch",
  },
  buttonCancel: {
    backgroundColor: "#FF6B6B",
    width: "40%",
  },
  buttonSubmit: {
    backgroundColor: "#4CAF50",
    width: "40%",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});
