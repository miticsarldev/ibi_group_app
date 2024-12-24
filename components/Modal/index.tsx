import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Modal } from "react-native";

const ModalComponent = ({ modalVisible, location, destination, setDestination, onClose, onValidate }) => {
  const [suggestions, setSuggestions] = useState([]);

  // Fonction pour récupérer les suggestions depuis Nominatim
  const fetchSuggestions = async (query) => {
    if (!query) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Erreur API Nominatim:", error);
    }
  };
  const defaultLocation = {
    latitude: 12.621121,
    longitude: -8.039114,
  };
  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Choisissez votre adresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre position (automatique)"
          value={location ? `${defaultLocation.latitude}, ${defaultLocation.longitude}` : ""}
          
        />
        <TextInput
          style={styles.input}
          placeholder="Votre destination"
          value={destination}
          onChangeText={(text) => {
            setDestination(text);
            fetchSuggestions(text);
          }}
        />
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setDestination(item.display_name);
                setSuggestions([]);
              }}
            >
              <Text style={styles.suggestionItem}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.validateButton} onPress={onValidate}>
          <Text style={styles.buttonText}>Valider</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Fermer</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  input: { padding: 10, borderWidth: 1, borderColor: "#DDD", borderRadius: 10, marginBottom: 10 },
  suggestionItem: { padding: 10, borderBottomWidth: 1, borderColor: "#DDD" },
  validateButton: { backgroundColor: "#0FAC71", padding: 15, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  closeButton: { marginTop: 10, alignItems: "center" },
  closeText: { color: "#0FAC71", fontWeight: "bold" },
});

export default ModalComponent;
