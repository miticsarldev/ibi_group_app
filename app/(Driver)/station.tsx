import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import { station } from "@/interface/station";
import { getStations, initialiserStation } from "@/services/stationService";

const StationsScreen = () => {
  const [stations, setStations] = useState<station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter(); 

  useEffect(() => {
    const fetchStations = async () => {
      try {
        await initialiserStation();
        const stationsData = await getStations();
        setStations(stationsData);
      } catch (error) {
        console.error("Erreur lors du chargement des stations :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  const handleNext = async (stationId: string) => {
    try {
      // Trouver la station avec l'ID correspondant
      const station = stations.find(station => station.id === stationId);
  
      if (!station) {
        console.error("Station introuvable");
        return;
      }
  
      // Assurez-vous de récupérer les coordonnées et d'effectuer une logique supplémentaire si nécessaire
      const stationCoordinates = {
        latitude: station.latitude,
        longitude: station.longitude,
      };
  
      // Maintenant, vous pouvez naviguer vers la page d'itinéraire
      router.push(`/(Driver)/stationItineraire?stationId=${stationId}&latitude=${stationCoordinates.latitude}&longitude=${stationCoordinates.longitude}`);
    } catch (error) {
      console.error("Erreur lors du traitement de la station :", error);
    }
  };
  

  const renderStation =  ({ item }: { item: station })  => (
    <View style={styles.stationCard}>
      <View style={styles.stationInfo}>
        <View style={styles.imageContain} >
          <Image source={require("../../assets/image/flash.png")} style={styles.stationIcon} />
        </View>
        <View> 
          <Text style={styles.stationName}>{item.adresse}</Text>
          <Text style={styles.stationTime}> à 800m</Text>
        </View>
      </View>
      <Ionicons name="location" size={24} color="#10B981" onPress={() => handleNext(item.id)} />
    </View>
  );

  return (
    <View style={styles.container} >
      {loading ? (
        <ActivityIndicator size="large" color="#10B981" />
      ) : ( 
        <FlatList
          data={stations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderStation}
          contentContainerStyle={styles.listContainer} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB", 
  },
  listContainer: {
    padding: 16,
    paddingTop: 40,
  },
  stationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15, 
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  stationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContain: {
    backgroundColor: "#C8E6C9",
    borderRadius: 50,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginLeft: -2

  },
  stationIcon: { 
    height: 20, 
    marginLeft:5
  },
  stationName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  stationTime: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default StationsScreen;
