import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal } from "react-native";

const ModalComponent = ({
  modalVisible,
  location,
  destination,
  setDestination,
  onClose,
  onValidate,
}) => {
  return (
    <Modal visible={modalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Choisissez votre adresse</Text>
        <TextInput
          style={styles.input}
          placeholder="Votre position (automatique)"
          value={location ? `${location.latitude}, ${location.longitude}` : ""}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Votre destination"
          value={destination}
          onChangeText={setDestination}
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
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 10,
    marginBottom: 10,
  },
  validateButton: {
    backgroundColor: "#0FAC71",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#0FAC71",
    fontWeight: "bold",
  },
});

export default ModalComponent;
