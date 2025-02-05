import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { COLORS } from "../../constants/styles";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const EditProfil = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const [formData, setFormData] = useState({
    fullName: "",
    contact: "",
    email: user?.email || "",
  });

  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDocRef = doc(db, "personne", user.uid); // Changement ici
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setFormData({
            fullName: userDoc.data().fullName || "",
            contact: userDoc.data().contact || "",
            email: userDoc.data().email || user.email || "",
          });
          setProfileImage(userDoc.data().profileImage || null);
        } else {
          // Si le document n'existe pas, créez-le avec des valeurs par défaut
          await setDoc(userDocRef, {
            fullName: "",
            contact: "",
            email: user.email,
            profileImage: null,
          });
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.contact || !formData.email) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs requis.");
      return;
    }

    if (user) {
      try {
        const userDocRef = doc(db, "personne", user.uid); // Changement ici
        await updateDoc(userDocRef, {
          fullName: formData.fullName,
          contact: formData.contact,
          email: formData.email,
          profileImage: profileImage,
        });
        Alert.alert("Succès", "Profil mis à jour avec succès!");
        router.back();
      } catch (error) {
        console.error("Erreur lors de la mise à jour du profil:", error);
        Alert.alert("Erreur", "Une erreur s'est produite lors de la mise à jour du profil.");
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier Profil</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require("../../assets/image/persn.webp")}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
          <Ionicons name="camera" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={formData.fullName}
        onChangeText={(text) => handleInputChange("fullName", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Votre numéro de téléphone"
        keyboardType="phone-pad"
        value={formData.contact}
        onChangeText={(text) => handleInputChange("contact", text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        value={formData.email}
        editable={false}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Modifier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    width: "100%",
    color: "#000",
    textAlign: "center",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 84,
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

export default EditProfil;