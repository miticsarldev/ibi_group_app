import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
const Details = () => {
  const {
    id,
    lieuDepart,
    villeDepart,
    lieuArrivee,
    villeArrivee,
    prix,
    payePar,
    date,
    heure,
    nom,
    image,
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
      </View>

      <Text style={styles.date}>
        {date} - {heure}
      </Text>

      <View style={styles.profileContainer}>
        <Image source={{ uri: image }} style={styles.profileImage} />
        <Text style={styles.profileName}>{nom}</Text>
      </View>

      <View style={styles.locationContainer}>
  {/* Icône de départ avec le texte */}
  <View style={styles.locationRow}>
    <Ionicons name="radio-button-on" size={24} color="red" />
    <View style={styles.locationText}>
      <Text style={styles.locationTitle}>{lieuDepart}</Text>
      <Text style={styles.locationSubtitle}>{villeDepart}</Text>
    </View>
  </View>

  {/* Ligne verticale */}
  <View style={styles.line} />

  {/* Icône d'arrivée avec le texte */}
  <View style={styles.locationRow}>
    <Ionicons name="location" size={24} color="#00a84f" />
    <View style={styles.locationText}>
      <Text style={styles.locationTitle}>{lieuArrivee}</Text>
      <Text style={styles.locationSubtitle}>{villeArrivee}</Text>
    </View>
  </View>
</View>


      {/* Prix et méthode de paiement */}
      <View style={styles.paymentContainer}>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Prix</Text>
          <Text style={styles.paymentValue}>{prix} FCFA</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Payé par</Text>
          <Text style={styles.paymentValue}>{payePar}</Text>
        </View>
      </View>
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 120,
    color: "#000",
  },
  date: {
    textAlign: "center",
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderWidth: 1,
    borderColor:'#00a84f',
    borderRadius: 50,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  locationContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  locationText: {
    marginLeft: 10,
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: "#ccc",
    marginLeft: 11, /* Aligné avec l'icône */
    marginVertical: 2,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  locationSubtitle: {
    fontSize: 14,
    color: "#777",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  paymentContainer: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  paymentValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default Details;
