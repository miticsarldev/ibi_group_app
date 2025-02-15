import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; 
import { COLORS, FONTS, SIZES } from "@/constants/styles";
import { fetchUserRentalDetails } from "@/services/reservationService";
import { createSignalement } from "@/services/signaleService";
import { getAuth } from "firebase/auth";

const Signale = () => {
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [vehiculeId, setVehiculeId] = useState<string | null>(null);
  const [signaler, setIsSignaler] = useState(false);
  const [loading, setLoading] = useState(true);

    // Vérification du statut de réservation de l'utilisateur
  useEffect(() => {
    const checkRentalStatus = async () => {
      setLoading(true);
      try {
        const { hasActiveReservation, vehiculeId } = await fetchUserRentalDetails();
        setIsSignaler(hasActiveReservation);
        setVehiculeId(vehiculeId || null);
      } catch (error) {
        console.error("Erreur lors de la vérification du statut de réservation :", error);
      } finally {
        setLoading(false);
      }
    };

    checkRentalStatus();
  }, []);

  const handleSubmit = async () => {
    if (!problemType || !description || !vehiculeId) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        Alert.alert("Erreur", "Utilisateur non connecté.");
        return;
      }

      // Créez l'objet signalement
      const signalement = {
        userId: user.uid,
        vehiculeId: vehiculeId,
        typeProbleme: problemType,
        description: description,
        dateSignalement: new Date().toISOString(),
      };

      // Envoyer le signalement
      const signalementId = await createSignalement(signalement);
      Alert.alert("Succès", `Signalement enregistré avec succès, ID : ${signalementId}`);
      setProblemType("");
      setDescription("");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'enregistrer le signalement.");
      console.error("Erreur lors de l'envoi du signalement :", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!signaler) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Vous n'avez pas de voiture louée. Impossible de signaler un problème.
        </Text>
      </View>
    );
  }

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
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#FF4D4D",
    textAlign: "center",
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
