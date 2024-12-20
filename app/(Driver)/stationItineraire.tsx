import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS, SIZES } from "../../constants/styles"; 
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const StationElectrique = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/(Driver)/station")}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Itineraire</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.6392,
          longitude: -8.0029,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marker pour la voiture */}
        <Marker
          coordinate={{ latitude: 12.6392, longitude: -8.0029 }}
          title="Voiture"
        />

        {/* Marker pour la station électrique */}
        <Marker
          coordinate={{ latitude: 12.6450, longitude: -8.0050 }}
          title="Station Électrique"
        />

        {/* Polyline pour simuler l'itinéraire */}
        <Polyline
          coordinates={[
            { latitude: 12.6392, longitude: -8.0029 },
            { latitude: 12.6450, longitude: -8.0050 },
          ]}
          strokeColor="#52D5BA"
          strokeWidth={4}
        />
      </MapView> 
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginLeft: 10,
    width: "100%",
    color: "#000",
    textAlign: "center"
  },
  map: {
    width: '100%',
    height: '100%',
  },
  actionButton: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: SIZES.font,
  },
});

export default StationElectrique;
