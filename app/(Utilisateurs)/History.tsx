import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

const History = () => {
  const [selectedTab, setSelectedTab] = useState("En cours");

  // Exemple de données
  const data = {
    "En cours": [
      { id: "1", lieu: "Badalabougou", ville: "Bamako, Mali", statut: "En cours", destination: "ACI 2000", prix: "2000 FCFA" },
    ],
    Compléter: [],
    Annuler: [],
  };

  const handleTabChange = (tab: React.SetStateAction<string>) => {
    setSelectedTab(tab);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: "/(Details)/DetPage",
          params: {
            id: 1,
            lieuDepart: "JXG9+GMF Bamako",
            villeDepart: "Bamako Mali",
            lieuArrivee: item.lieu,
            villeArrivee: item.ville,
            prix: 1500,
            payePar: "Espèces",
            date: "Jeudi 07 Decembre 2024",
            heure: "17:46",
            nom: "Seydou Keita",
            image: "https://img.freepik.com/photos-gratuite/capture-ecran-homme-noir-souriant-devant-fond-marron-concept-bonheur_181624-53291.jpg?t=st=1733407964~exp=1733411564~hmac=c51c5a069b5ff1991256973084738429fe43448eeaa83858860f02b00400e9c7&w=996", 
          },
        })
      }
    >
      <View>
        <Text style={styles.title}>{item.lieu}</Text>
        <Text style={styles.subtitle}>{item.ville}</Text>
        <Text style={styles.subtitle}>Destination : {item.destination}</Text>
        <Text style={styles.subtitle}>Prix : {item.prix}</Text>
      </View>
      <Text style={styles.status}>{item.statut}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Barre de navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique</Text>
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        {["En cours", "Compléter", "Annuler"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.activeTabButton,
            ]}
            onPress={() => handleTabChange(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste des trajets */}
      <View style={styles.listContainer}>
        {data[selectedTab].length > 0 ? (
          <FlatList
            data={data[selectedTab]}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        ) : (
          <Text style={styles.emptyMessage}>
            Aucun trajet disponible pour {selectedTab.toLowerCase()}.
          </Text>
        )}
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
    marginLeft: 110,
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",

    marginVertical: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#00a84f",
    borderRadius: 3,
  
  },
  activeTabButton: {
    backgroundColor: "#00a84f",
  },
  tabText: {
    color: "#00a84f",
    fontSize: 16,
    fontWeight: "bold",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    flex: 1,
    marginTop: 16,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent:'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: "#00a84f",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
  status: {
    paddingTop: 20,
    fontSize: 14,
    color: "#FEC400",
    fontWeight: "bold",

  },
  emptyMessage: {
    textAlign: "center",
    color: "#777",
    fontSize: 16,
    marginTop: 32,
  },
});

export default History;
