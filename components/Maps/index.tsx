import React from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

const MapComponent = ({ location, vehicles, routeCoordinates }) => {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.map}
        region={{
          latitude: location ? location.latitude : 12.6392,
          longitude: location ? location.longitude : -8.0029,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marker pour la position actuelle */}
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Votre position"
            description="Vous êtes ici"
            pinColor="blue"
          />
        )}

        {/* Markers pour les véhicules */}
        {vehicles.map((vehicle: { id: React.Key | null | undefined; latitude: any; longitude: any; type: string; }) => (
          <Marker
            key={vehicle.id}
            coordinate={{
              latitude: vehicle.latitude,
              longitude: vehicle.longitude,
            }}
            title={vehicle.type === "car" ? "Voiture" : "Moto"}
            description="Véhicule disponible"
            image={
              vehicle.type === "car"
                ? require("../../assets/image/car-icon.png")
                : require("../../assets/image/moto-icon.png")
            }
          />
        ))}

        {/* Trajet dessiné avec Polyline */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#FF0000"
            strokeWidth={3}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default MapComponent;
