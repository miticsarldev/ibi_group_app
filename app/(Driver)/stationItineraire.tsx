import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import * as Location from "expo-location";   
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent, State } from 'react-native-gesture-handler';
import { COLORS } from "../../constants/styles"; 
import { useRouter } from 'expo-router'; 
import { useLocationStore } from '@/Redux/store/useStore';  
import Map2 from '@/components/MapItineraire';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
  
const { height } = Dimensions.get("window");
const MIN_HEIGHT = height - 520;
const MAX_HEIGHT = 0;

type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};

const StationElectrique = () => {
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const router = useRouter();
  const [userLocation, setUserLocationState] = useState<LocationType | null>(null);
  const [destination, setDestination] = useState<LocationType | null>(null);
  const translateY = useSharedValue(0);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  useEffect(() => {
      (async () => {
        // Demande des permissions pour la localisation
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          return;
        }
  
        // Récupère la localisation de l'utilisateur
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
  
        const userLoc: LocationType = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].name}, ${address[0].region}`,
        };
  
        setUserLocation(userLoc);
        setUserLocationState(userLoc);
  
        // Définit automatiquement la destination
        const defaultDestination: LocationType = {
          latitude: 12.6392,
          longitude: -8.0029,
          address: "Vôtre Client",
        };
  
        setDestination(defaultDestination);
        setDestinationLocation(defaultDestination);
      })();
    }, []);

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

      const station = {
        id: 1,
        type: "Electric",
        localisation: "Sotuba", 
        temps: "5 mins",
        distance: "800m",  
      };

      const handleNext = () => {
        router.navigate("/(Driver)/station");
      };

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Carte avec Directions */}
      <View style={styles.mapContainer}>
        <Map2 userLocation={userLocation} destination={destination}/>
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
          <View style={styles.hr} />
            <Text style={styles.boldText}>
              Point de recharge sise à {station.localisation}
            </Text>
            <Text style={styles.centeredText}>
              <Ionicons name="location" size={14} /> {station.distance} ({station.temps})
            </Text>
          <View style={styles.hr} />
          <TouchableOpacity style={styles.actionButton} onPress={handleNext}>
            <Text style={styles.actionButtonText}>Rétour</Text>
          </TouchableOpacity>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray,
    paddingHorizontal: 8,
    paddingTop: 40,
  },
  mapContainer: {
    flex: 1, 
  },
  inputContainer: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  detailsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height / 4,
    elevation: 5,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginBottom: 10,
  },
  hr: {
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  centeredText: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    flexDirection: "row",
  },  
  actionButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  expandButton: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 25,
    elevation: 5,
  }
});

export default StationElectrique;
