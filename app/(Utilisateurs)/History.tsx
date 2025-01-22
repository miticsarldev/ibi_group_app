import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // Assurez-vous que ce chemin est correct

const History = () => {
  const [selectedTab, setSelectedTab] = useState("En cours");
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      const q = query(collection(db, "trajet"));
      const querySnapshot = await getDocs(q);
      const tripsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllTrips(tripsData);
      setFilteredTrips(tripsData.filter(trip => trip.status === "accepter"));
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const filterTrips = () => {
      switch (selectedTab) {
        case "En cours":
          setFilteredTrips(allTrips.filter(trip => trip.status === "accepter"));
          break;
        case "Compléter":
          setFilteredTrips(allTrips.filter(trip => trip.status === "Compléter"));
          break;
        case "Annuler":
          setFilteredTrips(allTrips.filter(trip => trip.status === "Annuler"));
          break;
        default:
          setFilteredTrips(allTrips);
      }
    };

    filterTrips();
  }, [selectedTab, allTrips]);

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
            id: item.id,
            lieuDepart: item.userLocation.address,
            villeDepart: "Bamako Mali",
            lieuArrivee: item.destination,
            villeArrivee: item.destination,
            prix: item.price,
            payePar: "Espèces",
            date: new Date(item.createdAt).toLocaleDateString(),
            heure: new Date(item.createdAt).toLocaleTimeString(),
            nom: "Seydou Keita",
            image: "https://img.freepik.com/photos-gratuite/capture-ecran-homme-noir-souriant-devant-fond-marron-concept-bonheur_181624-53291.jpg?t=st=1733407964~exp=1733411564~hmac=c51c5a069b5ff1991256973084738429fe43448eeaa83858860f02b00400e9c7&w=996",
          },
        })
      }
    >
      <View>
        <Text style={styles.title}>{item.userLocation.address}</Text>
        <Text style={styles.subtitle}>{item.destination}</Text>
        <Text style={styles.subtitle}>Prix : {item.price}</Text>
      </View>
      <Text style={styles.status}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historique</Text>
      </View>

      <View style={styles.tabContainer}>
        {["En cours", "Compléter", "Annuler"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, selectedTab === tab && styles.activeTabButton]}
            onPress={() => handleTabChange(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.listContainer}>
        {filteredTrips.length > 0 ? (
          <FlatList
            data={filteredTrips}
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
    marginLeft: 90,
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
    justifyContent: 'space-between',
    padding: 18,
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
    paddingBottom:8
  },
  subtitle: {
    paddingBottom:5,
    fontSize: 14,
    color: "#777",
  },
  status: {
    paddingTop: 20,
    fontSize: 14,
    color: "#00a84f",
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