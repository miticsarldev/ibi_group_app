import React, { useState } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../constants/styles";
import { router } from "expo-router";

const ProfileScreen = () => {
  const [formData, setFormData] = useState({
    fullName: "Admin Admin",
    phone: "75757575",
    email: "admin@mitisarl.com",
    username: "Admin",
    quartier: "Lafiabou",
    ville: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(Driver)/parametre")}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier Profil</Text>
      </View>

        {/* Profile Image */}
        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/image/persn.webp")}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIconContainer}>
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <TextInput
          style={styles.input}
          placeholder="Nom Complet"
          value={formData.fullName}
          onChangeText={(text) => handleInputChange("fullName", text)}
        />

        {/* Phone Input */} 
        <TextInput
          style={styles.input}
          placeholder="75757575"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
        /> 

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Adresse mail"
          value={formData.email}
          editable={false}
        />

        {/* Nom d'utilisateur */}
        <TextInput
          style={styles.input}
          placeholder="Nom d'utilisateur"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
        />

        {/* Quartier */}
        <TextInput
          style={styles.input}
          placeholder="Quartier"
          value={formData.quartier}
          onChangeText={(text) => handleInputChange("quartier", text)}
        />

        {/* Ville */}
        <TextInput
          style={styles.input}
          placeholder="Ville"
          value={formData.ville}
          onChangeText={(text) => handleInputChange("ville", text)}
        />

        {/* Buttons */} 
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Modifier</Text>
        </TouchableOpacity> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  scrollContent: {
    // padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginLeft: 10,
    width: "100%",
    color: "#000",
    textAlign: "center"
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: COLORS.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  phoneCode: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#D1D5DB",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#10B981",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10, 
  },
  saveButtonText: {
    fontSize: 16,
    color: "#FFFFFF", 
  },
});

export default ProfileScreen;