import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import * as Location from "expo-location";  
import { GestureHandlerRootView, PanGestureHandler, State, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '../../constants/styles';
import { useLocationStore } from '@/store/useStore';
import LocationInput from "@/components/itineraire";
import Map2 from '@/components/MapItineraire';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';

const { height } = Dimensions.get('window');
const MIN_HEIGHT = height - 520;
const MAX_HEIGHT = 0;
const { height: screenHeight } = Dimensions.get("window");

const GOOGLE_MAPS_APIKEY  = 'AIzaSyCVAsvOEIbDKET3Q6FRGNnptvfcWtY9HsI'; 

type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};

const Itineraire = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [userLocation, setUserLocationState] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      const userLoc: LocationType = {
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      };

      setUserLocation(userLoc);
      setUserLocationState(userLoc);

    })();
  }, []);

  const handleDestinationSelect = (location: LocationType) => {
    setDestination(location);
    setDestinationLocation(location);
  };

  const handleNext = () => {
    router.navigate('/(Driver)/trajet');
  };

  const translateY = useSharedValue(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const gestureHandler = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    translateY.value = Math.min(MIN_HEIGHT, Math.max(MAX_HEIGHT, translationY));
  };

  const gestureEndHandler = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent;
    if (translationY > height / 4) {
      translateY.value = withSpring(MIN_HEIGHT);
      setIsCollapsed(true);
    } else {
      translateY.value = withSpring(MAX_HEIGHT);
      setIsCollapsed(false);
    }
  };

  const handleExpand = () => {
    translateY.value = withSpring(MAX_HEIGHT);
    setIsCollapsed(false);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const trajet = {
    id: 1,
    type: "Passager",
    localisation: "Sotuba à Yirimadio",
    personnes: 1,
    temps: "5 mins",
    distance: "800m",
    prix: "2000 CFA",
    image: require("../../assets/image/person.jpg"),
  };

  return (
    <GestureHandlerRootView style={styles.container}> 
      {/* Carte avec Directions */}
      <View style={styles.mapContainer}>
        <Map2 userLocation={userLocation} destination={destination}/>
      </View>

      {/* Composant KnownLocationInput */}
      <View style={styles.inputContainer}>
        <MapView style={{ flex: 1 }}
          initialRegion={{
            latitude: userLocation?.latitude || 0,
            longitude: userLocation?.longitude || 0,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >

{userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              title="Votre position"
            />
          )}
          {destination && (
            <Marker
              coordinate={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              title="Destination"
            />
          )}
          {userLocation && destination && (
            <MapViewDirections
              origin={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
              }}
              destination={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              apikey={GOOGLE_MAPS_APIKEY}
              strokeWidth={4}
              strokeColor={COLORS.primary}
            />
          )}

        </MapView>
        <LocationInput
          initialLocation="Vôtre Client"
          knownCoordinates={{ latitude: 12.6392, longitude: -8.0029 }}
          handlePress={handleDestinationSelect}
        />
      </View>

      {/* Icône pour réafficher le panneau */}
      {isCollapsed && (
        <TouchableOpacity style={styles.expandButton} onPress={handleExpand}>
          <Ionicons name="chevron-up" size={30} color="#000" />
        </TouchableOpacity>
      )}

      {/* Détails glissables */}
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        onHandlerStateChange={(event) => {
          if (event.nativeEvent.state === State.END) {
            gestureEndHandler(event);
          }
        }}
      >
        <Animated.View style={[styles.detailsContainer, animatedStyle]}>
          <View style={styles.handleBar} />
          <Text style={styles.arrivalTime}>Heure d’arrivée : 15h35</Text>
          <View style={styles.userInfo}>
            <Image source={trajet.image} style={styles.userImage} />
            <View>
              <Text style={styles.userName}>Aly Touré</Text>
              <Text style={styles.userDetails}>
                {trajet.distance} ({trajet.temps}){'\n'}
                {trajet.localisation}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>Montant du trajet : {trajet.prix}</Text>
          <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
            <Text style={styles.actionButtonText}>Trajet Terminé</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    height: screenHeight * 0.6, 
  },
  inputContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  detailsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 3,
    elevation: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  arrivalTime: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expandButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  },
});

export default Itineraire;
