import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

import MapComponent from "../../components/Maps";
import ModalComponent from "../../components/Modal";
import { LocationObjectCoords } from 'expo-location';

const Home = () => {
  const [location, setLocation] = useState<LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // État de la modal
  const [destination, setDestination] = useState(""); // Destination choisie
  const [routeCoordinates, setRouteCoordinates] = useState([]); // Itinéraire
  const [vehicles, setVehicles] = useState([
    { id: 1, latitude: 12.649521, longitude: -8.000575, type: "car" },
    { id: 2, latitude: 12.652889, longitude: -8.012152, type: "moto" },
    { id: 3, latitude: 12.642199, longitude: -8.034351, type: "car" },
    { id: 4, latitude: 12.634042, longitude: -7.997917, type: "moto" },
  ]);

  // Obtenir la position actuelle de l'utilisateur
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erreur", "Permission refusée pour accéder à la localisation.");
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        console.log("Position actuelle :", currentLocation.coords);
        setLocation(currentLocation.coords); // Définit la position actuelle dans l'état
      } catch (error) {
        console.log("Erreur lors de la récupération de la position :", error);
        Alert.alert("Erreur", "Impossible d'obtenir votre position actuelle.");
      }
    })();
  }, []);
  
 
  const fetchRoute = async (start: { latitude: any; longitude: any; } | undefined, end: { latitude: any; longitude: any; } | undefined, setRouteCoordinates: ((arg0: { latitude: number; longitude: number; }[]) => void) | undefined) => {
    if (!start || !end) {
      console.error("Coordonnées de départ ou d'arrivée manquantes.");
      return;
    }
  
    const API_KEY = "AIzaSyCcYSuP3NHBWpGK-2vBDwAXiW6moe2lcho"; // Remplacez par votre clé API
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${start.latitude},${start.longitude}&destination=${end.latitude},${end.longitude}&key=${API_KEY}`
      );
      const data = await response.json();
  
      if (data.routes.length) {
        const route = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(route); // Décoder la polyline
        setRouteCoordinates(decodedPoints); // Mettre à jour l'état
      } else {
        console.error("Aucun itinéraire trouvé.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du trajet:", error);
    }
  };
  
  
  // Fonction pour décoder une polyline en coordonnées GPS
  const decodePolyline = (encoded: string) => {
    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;
  
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
  
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
  
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
  
    return points;
  };
  

  const handleValidateDestination = async () => {
    setModalVisible(false);
    await fetchRoute();
  };

  return (
    <View style={styles.container}>
      {/* Carte avec position actuelle, véhicules et itinéraire */}
      {!location ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Chargement de votre position...</Text>
      </View>
    ) : (
      <MapComponent
        
        vehicles={vehicles}
        routeCoordinates={routeCoordinates}
      />
    )}

      {/* Bouton pour choisir une destination */}
      <TouchableOpacity
        style={styles.chooseButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.chooseButtonText}>Choisir une destination</Text>
      </TouchableOpacity>

      {/* Modal pour saisir une destination */}
      <ModalComponent
        modalVisible={modalVisible}
        location={location}
        destination={destination}
        setDestination={setDestination}
        onClose={() => setModalVisible(false)}
        onValidate={handleValidateDestination}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chooseButton: {
    width: "95%",
    height: 60,
    backgroundColor: "#0FAC71",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginLeft: 10,
  },
  chooseButtonText: {
    fontSize: 17,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Home;