import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
 
const MapComponent = ({ location, vehicles, destination }) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  useEffect(() => {
    if (location && destination) {
      // Appelez fetchRoute pour récupérer l'itinéraire
      fetchRoute(location, destination, setRouteCoordinates);
    }
  }, [location, destination]);
   return (
     <View style={styles.mapContainer}>
       <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : {
                latitude: 12.621121, //position par defaut 
                longitude: -8.039114,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
        }
      >
         {location && (
           <Marker
             coordinate={{
               latitude: location.latitude,
               longitude: location.longitude,
             }}
             title="Votre position"
             description="Point de départ"
           />
         )}
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
         {routeCoordinates.length > 0 && (
        <Polyline
          coordinates={routeCoordinates}
          strokeWidth={5}
          strokeColor="blue"
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