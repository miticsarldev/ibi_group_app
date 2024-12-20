import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; 
import { COLORS, FONTS, SIZES } from "../../constants/styles";

const Signale = () => {
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log("Type de problème :", problemType);
    console.log("Description :", description); 
  };

  return (
    <View style={styles.container}>
        {/* Icône de signalement */}
      <View style={styles.iconContainer}>
        <Ionicons name="warning" size={60} color="#FF4D4D" />
      </View>

      {/* Champ de sélection pour le type de problème */}
      <Text style={styles.label}>Type de problème</Text>
      <View style={styles.inputWrapper}>
        <Picker
          selectedValue={problemType}
          onValueChange={(itemValue) => setProblemType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez le problème" value="" />
          <Picker.Item label="Panne mécanique" value="panne_mecanique" />
          <Picker.Item label="Problème de propreté" value="proprete" /> 
          <Picker.Item label="Autre" value="autre" />
        </Picker>
      </View>

      {/* Champ de description */}
      <Text style={styles.label}>Description du problème</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.textArea}
          placeholder="Décrivez le problème rencontré..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={ handleSubmit }>
        <Text style={styles.buttonText}>Envoyer</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#374151",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20, 
    justifyContent: "center",
  },
  picker: {
    height: 50,
    color: "#374151",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    fontSize: 14,
    color: "#374151",
  },
  button: {
      backgroundColor: COLORS.primary,
      paddingVertical: 10,
      borderRadius: SIZES.radius,
      alignItems: "center",
      marginTop: SIZES.padding,
    },
    buttonText: {
      color: COLORS.white,
      fontSize: SIZES.fontLarge,
      fontFamily: FONTS.bold,
    }
});

export default Signale;
