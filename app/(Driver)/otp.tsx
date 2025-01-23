import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TextInputProps, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router"; 
import { COLORS, FONTS } from "@/constants/styles";
import { verifierOtpTrajet } from "@/services/trajetService";

const OtpScreen: React.FC = () => {
  const router = useRouter(); 
  const { trajetId } = useLocalSearchParams<{ trajetId: string }>(); 
  const [otp, setOtp] = useState<string[]>(Array(5).fill(""));
  const otpRefs = Array.from({ length: 5 }, () => useRef<TextInput>(null));

  // const handleNext = () => {
  //   router.replace("/(Driver)/itineraire?tripStage=dropoff");
  // };
  
  const handleInputChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text.length === 1 && index < otpRefs.length - 1) {
        otpRefs[index + 1].current?.focus();
      }
    }
  };

  const handleValidateOtp = async () => {
    if (!trajetId) {
      Alert.alert("Erreur", "Aucun trajet spécifié.");
      return;
    }

    const otpSaisi = otp.join("");
    if (otpSaisi.length < 5) {
      Alert.alert("Erreur", "Veuillez entrer un OTP valide.");
      return;
    }

    const result = await verifierOtpTrajet(trajetId, otpSaisi);
    if (result.success) {
      router.replace(`/(Driver)/itineraire?tripStage=dropoff`);
    } else {
      Alert.alert("Échec", result.message);
    }
  };

  // const handleInputChange = (text: string, index: number) => {
  //   if (text.length === 1 && index < otpRefs.length - 1) {
  //     otpRefs[index + 1].current?.focus();
  //   }
  // };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Entre le OTP Code</Text>
      </View>

      {/* OTP Inputs */}
      <View style={styles.otpContainer}>
        {otpRefs.map((_, index) => (
          <TextInput
            key={index}
            ref={otpRefs[index]}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            onChangeText={(text) => handleInputChange(text, index)}
          />
        ))}
      </View>

      {/* Button */}
      <TouchableOpacity
        style={styles.validateButton}
        onPress={handleValidateOtp}
      >
        <Text style={styles.validateButtonText}>Valider</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  header: {
    marginBottom: 16,
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#343434", 
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 32,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#CACACA",
    borderRadius: 8,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#F2F1F9",
  },
  validateButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  validateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OtpScreen;
