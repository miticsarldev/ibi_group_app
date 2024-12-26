import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { COLORS } from "../../constants/styles";

const Parrainage = () => {
  const referralCode = "Admin138";

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeIcon} onPress={() => router.push("/(Driver)/parametre")}>
        <Ionicons name="close" size={32} color="#374151" />
      </TouchableOpacity>

      <Text style={styles.headerText}>PARRAINAGE</Text>

      <Ionicons name="cash-outline" size={64} color="#374151" style={styles.mailIcon} />

      <Text style={styles.rewardText}>
        🎉 <Text style={styles.boldText}>RECEVEZ 500 CFA</Text> 🎉
      </Text>

      <Text style={styles.descriptionText}>
        Offrez à vos amis 500 CFA sur leur 1er trajet et recevez 500 CFA une fois leur trajet effectué ! (limite de 100 parrainages)
      </Text>

      <Text style={styles.referralLabel}>Votre code de parrainage est :</Text>
      <View style={styles.codeContainer}>
        <Ionicons name="copy" size={20} color="#898989" />
        <Text style={styles.referralCode}>{referralCode}</Text>
      </View>

      <TouchableOpacity style={styles.shareButton}>
        <Text style={styles.shareButtonText}>Partager</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity>
        <Text style={styles.inviteText}>Inviter par SMS</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  headerText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    color: COLORS.primary,
    marginBottom: 30,
  },
  mailIcon: {
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 24,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#343434",
    textAlign: "center",
    marginBottom: 20,
  },
  referralLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#898989",
    marginBottom: 10,
  },
  codeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F1F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  referralCode: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: COLORS.primary,
    marginLeft: 10,
  },
  shareButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 30, 
    marginBottom: 10,
    marginTop: 50
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
    color: "#FFFFFF",
  },
  inviteText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#374151",
    textDecorationLine: "underline",
  },
});

export default Parrainage;
