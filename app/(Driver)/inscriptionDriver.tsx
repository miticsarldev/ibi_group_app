import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Alert, Modal } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants/styles"; 
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from "react-native-image-picker";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

const InscriptionScreen = ({ navigation }: any) => {
  const handleNext = () => {
    router.navigate('/(Driver)/succees'); 
  }
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    identityURL: "",
    driverLicenseURL: "",
    gender: "",
    referral: "",
    promoCode: "",
  });

  const [showPromoField, setShowPromoField] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleImagePicker = (field: "identityURL" | "driverLicenseURL") => {
    launchImageLibrary({ mediaType: "photo", quality: 0.5 }, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.errorMessage) {
        Alert.alert("Error", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        if (uri) {
          handleInputChange(field, uri);
        } else {
          Alert.alert("Error", "No valid image URI found.");
        }
      } else {
        Alert.alert("Error", "No image selected.");
      }
    });
  };

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [key]: value });
    if (key === "referral" && value === "Personne") {
      setShowPromoField(true);
    } else if (key === "referral") {
      setShowPromoField(false);
    }
  }; 

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = () => {
    if (!acceptTerms) {
      Alert.alert("Erreur", "Vous devez accepter les conditions pour continuer.");
      return;
    } 

    // Validation des champs
    const requiredFields = ["fullName", "email", "phone", "password", "gender"];
    const isValid = requiredFields.every((field) => formData[field as keyof typeof formData]);

    if (!isValid) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs obligatoires.");
      return;
    }

    Alert.alert("Succès", "Inscription réussie !");
    navigation.navigate("/succees");
  };

  return ( 
    <ScrollView style={styles.container}  contentContainerStyle={styles.scrollContent}
    showsVerticalScrollIndicator={false}>
      <View style={styles.innerContainer}></View>
      <Text style={styles.title}>Inscription</Text>

      {/* Nom Complet */}
      <TextInput
        style={styles.input}
        placeholder="Nom Complet"
        value={formData.fullName}
        onChangeText={(text) => handleInputChange("fullName", text)}
      />
      {/* Email */}
      <TextInput
        style={styles.input}
        placeholder="Adresse mail"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(text) => handleInputChange("email", text)}
      />
      {/* Mot de passe */}
      <View style={styles.inputWithButton}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Mot de passe"
        secureTextEntry={!isPasswordVisible}
        value={formData.password}
        onChangeText={(text) => handleInputChange("password", text)}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <Ionicons
          name={isPasswordVisible ? "eye-off" : "eye"}
          size={24}
          color="#414141"
          style={styles.buttonInsideIcone}
        />
      </TouchableOpacity>
    </View> 

      {/* Phone Input */}
      <View style={styles.phoneInputContainer}>
      <Image
          source={{ uri: 'https://flagcdn.com/w40/ml.png' }}
          style={styles.flag}
        />
        <Text style={styles.countryCode}>+223</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Votre numéro"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
        />
      </View>

      {/* Genre Selection */} 
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={formData.gender}
          onValueChange={(value) => handleInputChange("gender", value)}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionnez le genre" value="" />
          <Picker.Item label="Homme" value="Homme" />
          <Picker.Item label="Femme" value="Femme" />
        </Picker>
      </View>

      {/* Pièce d'identité */}
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.input3}
          placeholder="Ajouter l'URL de la pièce d'identité"
          value={formData.identityURL}
          onChangeText={(text) => handleInputChange("identityURL", text)}
          placeholderTextColor="#898989"
        />
        <TouchableOpacity
          style={styles.buttonInsideInput}
          onPress={() => handleImagePicker("identityURL")}
        >
          <Text style={styles.buttonText2}>Insérer</Text>
        </TouchableOpacity>
      </View>

      {/* Permis de conduire */}
      <View style={styles.inputWithButton}>
        <TextInput
          style={styles.input3}
          placeholder="Ajouter l'URL du permis de conduire"
          value={formData.driverLicenseURL}
          onChangeText={(text) => handleInputChange("driverLicenseURL", text)}
          placeholderTextColor="#898989"
        />
        <TouchableOpacity
          style={styles.buttonInsideInput}
          onPress={() => handleImagePicker("driverLicenseURL")}
        >
          <Text style={styles.buttonText2}>Insérer</Text>
        </TouchableOpacity>
      </View>

      {/* Condition et Support */}
      <Text style={styles.sectionTitle}>Comment avez-vous connu cette plateforme ?</Text>
      <View style={styles.radioGroup}>
        {["LinkedIn", "Facebook", "Personne", "Autres"].map((option) => (
          <TouchableOpacity
            key={option}
            style={styles.radioOption}
            onPress={() => handleInputChange("referral", option)}
          >
            <View
              style={[
                styles.radioCircle,
                formData.referral === option && styles.radioCircleSelected,
              ]}
            />
            <Text style={styles.radioText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Code Promo */}
      {showPromoField && (
        <TextInput
          style={styles.input}
          placeholder="Code promo"
          value={formData.promoCode}
          onChangeText={(text) => handleInputChange("promoCode", text)}
        />
      )}

      {/* Acceptation des conditions */}
      <View style={styles.termsContainer}>
        <TouchableOpacity onPress={() => setAcceptTerms(!acceptTerms)}>
          <View
            style={[
              styles.checkbox,
              acceptTerms && { backgroundColor: COLORS.primary },
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.termsText}>
          En vous inscrivant, vous acceptez les{" "}
          <Text style={styles.link} onPress={() => setModalVisible(true)}>
            Conditions d'utilisation
          </Text>{" "}
          et la{" "}
          <Text style={styles.link} onPress={() => setModalVisible(true)}>
            Politique de confidentialité
          </Text>
          .
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </TouchableOpacity>

      {/* Pop Up Acceptation des conditions */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Conditions d'utilisation</Text>
            <ScrollView>
              <Text style={styles.modalText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
                nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed
                nisi. Nulla quis sem at nibh elementum imperdiet.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingVertical: SIZES.padding * 2,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16, 
  },
  inputPassword: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    padding: SIZES.paddingSmall,
    fontSize: SIZES.font,
    color: COLORS.text,
    marginBottom: 5,
    flex: 1,
    paddingRight: SIZES.iconSize * 2, 
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 15,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    padding: 5,
    marginBottom: 10,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 2,
  },
  countryCode: {
    fontSize: SIZES.font,
    marginLeft: 2,
  },
  phoneInput: {
    flex: 1, 
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 8,
    marginBottom: 15,
  },
  inputWithButton: {
    marginBottom: SIZES.paddingSmall,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  buttonInsideInput: {
    position: "absolute",
    right: SIZES.base,
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.base / 2,
    paddingHorizontal: SIZES.base + 2,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonInsideIcone: {
    position: "absolute",
    right: SIZES.base,
    top: "50%",
    transform: [{ translateY: -40 }],
    backgroundColor: COLORS.white,
    paddingVertical: 1,
    paddingHorizontal: SIZES.base + 2,
    borderRadius: SIZES.radius,
  },
  buttonText2: {
    color: COLORS.darkGray,
    fontSize: SIZES.font - 4,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SIZES.paddingSmall,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SIZES.base,
    gap: 6,
    width: "48%",
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: SIZES.iconSize / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: '#6C6C6C',
  },
  radioCircleSelected: {
    backgroundColor: COLORS.primary,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center", 
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#6C6C6C', 
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    width: "80%",
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.fontLarge,
    color: COLORS.text,
    marginBottom: SIZES.base,
  },
  modalText: {
    fontSize: SIZES.font - 2,
    color: COLORS.text,
  },
  closeButton: {
    marginTop: SIZES.padding,
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.base + 2,
    paddingHorizontal: SIZES.padding,
    width: "50%",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: SIZES.radius,
  },
  closeButtonText: {
    color: COLORS.white,
    fontSize: SIZES.font - 2,
    fontFamily: FONTS.medium,
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
  },
  input3: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 5,
    paddingRight: 100,
    fontSize: 14,
    color: "#333",               
    marginBottom: 5,
  },
  radioText: {
    fontSize: 12,
    color: COLORS.text,
    marginRight: 8,
  },
  picker: {
    borderWidth: 0, 
  },
  termsText: {
    fontSize: 14, 
    paddingRight: 14,
    color: COLORS.text,
  },
  link: {
    color: COLORS.primary,
    textDecorationLine: "underline",
  }, 
        
});

export default InscriptionScreen;