import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as Location from "expo-location";
import axios from "axios";

import MapComponent from "../../components/Maps";
import ModalComponent from "../../components/Modal";

const Home = () => {
  const [location, setLocation] = useState(null); // Position actuelle
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
        Alert.alert("Erreur", "Permission refusée.");
        return;
      }
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);
      } catch (error) {
        Alert.alert("Erreur", "Impossible d'obtenir la position actuelle.");
      }
    })();
  }, []);

  // Récupérer l'itinéraire via Google Maps API
  const fetchRoute = async () => {
    if (!location) {
      Alert.alert("Erreur", "La position actuelle est introuvable.");
      return;
    }
    try {
      const API_KEY = "AIzaSyCcYSuP3NHBWpGK-2vBDwAXiW6moe2lcho";
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${destination}&key=${API_KEY}`
      );
      if (response.data.routes.length > 0) {
        const coordinates = response.data.routes[0].legs[0].steps.map(
          (step) => ({
            latitude: step.start_location.lat,
            longitude: step.start_location.lng,
          })
        );
        coordinates.push({
          latitude: response.data.routes[0].legs[0].end_location.lat,
          longitude: response.data.routes[0].legs[0].end_location.lng,
        });
        setRouteCoordinates(coordinates);
      } else {
        Alert.alert("Erreur", "Aucun trajet trouvé.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de récupérer le trajet.");
    }
  };

  const handleValidateDestination = async () => {
    setModalVisible(false);
    await fetchRoute();
  };

  return (
    <View style={styles.container}>
      {/* Carte avec position actuelle, véhicules et itinéraire */}
      <MapComponent
        location={location}
        vehicles={vehicles}
        routeCoordinates={routeCoordinates}
      />

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
