import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const Parametre = () => {
  const handleOptionPress = (option: string) => {
    console.log(`Option sélectionnée : ${option}`);
    router.push('/(Details)/SetPassword');
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètre</Text>
      </View>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress("ChangerMdp")}
      >
        <Text style={styles.optionText}>Changer de mot de passe</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => handleOptionPress("SupprimerCompte")}
      >
        <Text style={styles.optionText}>Supprimer mon compte</Text>
        <Text style={styles.arrow}>&gt;</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 100,
  },
  optionButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#00a84f",
    borderRadius: 8,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
  arrow: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Parametre;
