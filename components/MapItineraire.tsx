import { styles } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

export type LocationType = {
  latitude: number;
  longitude: number;
  address?: string;
};

type Map2Props = {
  userLocation: LocationType | null;
  destination: LocationType | null;
  stations?: LocationType[];
};

// Icônes personnalisées
const icons = {
  car: require("../assets/icons/selected-marker.png"),
  location: require("../assets/icons/point.png"),
  station: require("../assets/image/flash.png"),
};

const drivers = [
  {
    id: 1,
    latitude: 12.5795,
    longitude: -8.0002,
    name: "Lamine Traoré", 
  },
  {
    id: 2,
    latitude: 12.5782,
    longitude: -8.0056,
    name: "Ousmane Sylla", 
  },
  {
    id: 3,
    latitude: 12.5769,
    longitude: -8.0021,
    name: "Chaka Coulibaly", 
  },
  {
    id: 4,
    latitude: 12.5777,
    longitude: -8.0073,
    name: "Robert Green", 
  },
];

const Map2: React.FC<Map2Props> = ({ userLocation, destination }) => {
  const [markers, setMarkers] = useState(drivers);

  const defaultRegion = {
    latitude: 12.5781975,
    longitude: -8.0036832,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const region = userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }
    : defaultRegion;

  if (!userLocation)
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={region}
      showsUserLocation={true}
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          // title={marker.name} 
          title="Point de départ"
          image={icons.car}
        />
      ))}

      {destination && (
        <>
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title="Destination"
            image={icons.location}
          />

          <MapViewDirections
            origin={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            destination={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

export default Map2;
