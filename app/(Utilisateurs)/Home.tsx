import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const Home = () => {
  const [location, setLocation] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const [destination, setDestination] = useState(''); 
  const [routeCoordinates, setRouteCoordinates] = useState([]); 

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync(); 
      if (status !== 'granted') {
        console.log('Permission refusée');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({}); 
      setLocation(currentLocation.coords); 
    })();
  }, []);

  const fetchRoute = async () => {
    if (!location) {
      Alert.alert('Erreur', "La position actuelle est introuvable.");
      return;
    }

    try {
      const API_KEY = 'AIzaSyCcYSuP3NHBWpGK-2vBDwAXiW6moe2lcho';
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${location.latitude},${location.longitude}&destination=${destination}&key=${API_KEY}`
      );

      if (response.data.routes.length > 0) {
        
        const coordinates = response.data.routes[0].legs[0].steps.map((step) => ({
          latitude: step.start_location.lat,
          longitude: step.start_location.lng,
        }));
        coordinates.push({
          latitude: response.data.routes[0].legs[0].end_location.lat,
          longitude: response.data.routes[0].legs[0].end_location.lng,
        });
        setRouteCoordinates(coordinates);
      } else {
        Alert.alert('Erreur', 'Aucun trajet trouvé pour cette destination.');
      }
    } catch (error) {
      console.error('Erreur API:', error);
      Alert.alert('Erreur', 'Impossible de récupérer le trajet.');
    }
  };

  const handleValidateDestination = async () => {
    setModalVisible(false);
    await fetchRoute(); 
  };

  return (
    <View style={styles.container}>
      
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location ? location.latitude : 12.6392, 
          longitude: location ? location.longitude : -8.0029,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        
        {location && (
         <Marker
         coordinate={{
           latitude: 12.6413,
           longitude: -8.0078,
         }}
         title="Depart"
         description="votre position"
       />
      )}

        
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000" 
            strokeWidth={3} 
          />
        )}

        
        {routeCoordinates.length > 0 && (
          <Marker
            coordinate={routeCoordinates[routeCoordinates.length - 1]} // Dernier point du trajet
            title="Destination"
          />
        )}
      </MapView>

      
      <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(true)}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Choisir une destination</Text>
        </View>
      </TouchableOpacity>

    
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Choisissez votre adresse</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre position (automatique)"
            value={location ? `${location.latitude}, ${location.longitude}` : ''}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Votre destination"
            value={destination}
            onChangeText={setDestination}
          />
          <TouchableOpacity style={styles.modalButton} onPress={handleValidateDestination}>
            <Text style={styles.modalButtonText}>Valider</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalCloseText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '90%',
    height: 60,
    backgroundColor: '#0FAC71',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 17,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#0FAC71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#0FAC71',
    fontWeight: 'bold',
  },
});

export default Home;
