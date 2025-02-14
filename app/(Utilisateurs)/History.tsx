import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { onSnapshot, query, collection, doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { images, icons } from "@/constants";

const History = () => {
  type Trip = {
    id: string;
    chauffeurId?: string; 
    status: string;
    userLocation: { address: string };
    destination: { address: string };
    price: number;
    createdAt: string;
    chauffeur?: string; 
  };
  
  const [selectedTab, setSelectedTab] = useState("En cours");
  const [allTrips, setAllTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [ratedTrips, setRatedTrips] = useState(new Set());

  useEffect(() => {
    const q = query(collection(db, "trajet"));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const tripsData: Trip[] = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const tripData: Trip = { id: docSnapshot.id, ...docSnapshot.data() } as Trip;
      
        if (tripData.chauffeurId) {
          try {
            const chauffeurRef = doc(db, "personne", tripData.chauffeurId);
            const chauffeurDoc = await getDoc(chauffeurRef);
      
            if (chauffeurDoc.exists()) {
              tripData.chauffeur = chauffeurDoc.data().fullName;
            } else {
              console.warn(`Aucun chauffeur trouvé: ${tripData.chauffeurId}`);
              tripData.chauffeur = "Chauffeur inconnu";
            }
          } catch (error) {
            console.error("Erreur lors de la récupération du chauffeur:", error);
            tripData.chauffeur = "Chauffeur inconnu";
          }
        }
      
        return tripData;
      }));
      
      

      setAllTrips(tripsData);
      setFilteredTrips(tripsData.filter(trip => trip.status === "accepter"));
    });

    return () => unsubscribe();
  }, [ratedTrips]);

  useEffect(() => {
    const filterTrips = () => {
      switch (selectedTab) {
        case "En cours":
          setFilteredTrips(allTrips.filter(trip => trip.status === "accepter"));
          break;
        case "Compléter":
          setFilteredTrips(allTrips.filter(trip => trip.status === "terminer"));
          break;
        case "Annuler":
          setFilteredTrips(allTrips.filter(trip => trip.status === "annuler"));
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

  const renderItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
         {
          router.push({
            pathname: "/(Details)/DetPage",
            params: {
              id: item.id,
              lieuDepart: item.userLocation.address,
              villeDepart: "Bamako Mali",
              lieuArrivee: item.destination.address,
              villeArrivee: item.destination.address,
              prix: item.price,
              payePar: "Espèces",
              date: new Date(item.createdAt).toLocaleDateString(),
              heure: new Date(item.createdAt).toLocaleTimeString(),
              nom: item.chauffeur || "Chauffeur inconnu",
              image: icons.person,
            },
          });
        }
      }}
    >
      <View>
        <Text style={styles.title}>{item.userLocation.address}</Text>
        <Text style={styles.subtitle}>{item.destination.address}</Text>
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
    paddingBottom: 8
  },
  subtitle: {
    paddingBottom: 5,
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